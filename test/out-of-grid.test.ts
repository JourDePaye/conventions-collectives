import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

type Situation = Record<string, string | number>;

async function engineOf(model: string, revision: string, warnings: string[] = []) {
  const version = COMPILED_VERSIONS[model]?.find((entry) => entry.version === revision);
  assert.ok(version, `${model}.${revision}`);
  const extension = await version.loadRules();
  const head = Object.entries(extension).find(
    ([, rule]) => typeof rule?.valeur === "string" && rule.valeur.startsWith("convention collective = "),
  );
  const rules: Record<string, Rule> = { ...modeleSocial };
  const value = head ? (head[1].valeur as string).match(/'(.*)'/)?.[1] : undefined;
  if (value) {
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = {
      ...choice,
      "une possibilité": [...new Set([...choice["une possibilité"], value])],
    } as Rule;
  }
  Object.assign(rules, extension);
  const logger = { log() {}, error() {}, warn(message: unknown) { warnings.push(String(message)); } };
  const engine = new Engine(rules, { logger });
  return { engine, extension, namespace: head?.[0], value };
}

// Released versions whose out-of-grid rule reads itself: `grille = 0 €/mois` resolves `grille` to
// the out-of-grid rule, not to `salaire minimum conventionnel . grille`. They stay unchanged; the
// next revision of each fixes it.
const SELF_REFERENCING = new Set([
  "0993-prothesistes-dentaires.2026.1",
  "1606-bricolage.2025.1",
  "3013-librairie.2026.1",
  "3205-cooperatives-consommateurs.2026.1",
  "3243-quincaillerie.2026.1",
  "3250-commissaires-justice.2026.1",
]);

describe("rules of every released version", () => {
  for (const [model, versions] of Object.entries(COMPILED_VERSIONS)) {
    for (const { version } of versions) {
      const key = `${model}.${version}`;
      it(`${key} has no rule that depends on itself`, async () => {
        const warnings: string[] = [];
        const { engine, extension, namespace, value } = await engineOf(model, version, warnings);
        if (value) engine.setSituation({ "salarié . convention collective": `'${value}'` });
        for (const name of Object.keys(extension)) engine.evaluate(name);
        const cycles = warnings.filter((warning) => /cycle/i.test(warning) && namespace && warning.includes(namespace));
        if (SELF_REFERENCING.has(key)) assert.notEqual(cycles.length, 0, key);
        else assert.deepEqual(cycles, [], key);
      });
    }
  }
});

const FIXED: {
  model: string;
  version: string;
  rule: string;
  input: string;
  valid: string | number;
  invalid: (string | number)[];
  situation?: Situation;
}[] = [
  { model: "0993-prothesistes-dentaires", version: "2026.2", rule: "niveau hors grille", input: "niveau", valid: "'PHQ1'", invalid: ["'PHQ9'", "'non renseigné'"] },
  { model: "1606-bricolage", version: "2025.2", rule: "coefficient hors grille", input: "coefficient", valid: 250, invalid: [0, 251] },
  { model: "3013-librairie", version: "2026.2", rule: "niveau hors grille", input: "niveau", valid: "'8'", invalid: ["'99'", "'non renseigné'"] },
  { model: "3205-cooperatives-consommateurs", version: "2026.2", rule: "niveau hors grille", input: "niveau", valid: "'8'", invalid: ["'99'", "'non renseigné'"] },
  { model: "3243-quincaillerie", version: "2026.2", rule: "niveau et échelon hors grille", input: "niveau et échelon", valid: "'VI.3'", invalid: ["'VI.9'", "'non renseigné'"] },
  {
    model: "3250-commissaires-justice",
    version: "2026.2",
    rule: "catégorie et coefficient hors grille",
    input: "catégorie et coefficient",
    valid: "'II.2-283'",
    invalid: ["'II.2-999'", "'non renseigné'"],
    situation: { "champ juridique": "'employeur signataire ou adhérent'" },
  },
  { model: "3255-boulangerie-industrielle", version: "2026.2", rule: "niveau hors grille", input: "niveau", valid: "'E3'", invalid: ["'E9'", "'non renseigné'"] },
  { model: "1512-promotion-immobiliere", version: "2026.3", rule: "coefficient hors grille", input: "coefficient", valid: 100, invalid: [0, 101, 900] },
  // Palier 1 starts at coefficient 9 and palier 12 covers 400 and above.
  { model: "7024-production-agricole-cuma", version: "2025.3", rule: "coefficient hors grille", input: "coefficient", valid: 1000, invalid: [0, 8] },
  // Executives' coefficients only have an annual guarantee, and are in the grid.
  { model: "0489-industries-cartonnage", version: "2025.4", rule: "classification hors grille", input: "coefficient", valid: 600, invalid: [0, 999] },
  { model: "1558-industries-ceramiques", version: "2025.2", rule: "niveau hors grille", input: "classification", valid: "'J'", invalid: ["'ZZ-E9'", "'non renseigné'"] },
];

describe("out-of-grid rules fixed by a new revision", () => {
  for (const { model, version, rule, input, valid, invalid, situation = {} } of FIXED) {
    it(`${model}.${version}: ${rule} is true only outside the grid`, async () => {
      const { engine, namespace, value } = await engineOf(model, version);
      const evaluate = (classification: string | number) => {
        engine.setSituation({
          "salarié . convention collective": `'${value}'`,
          "salarié . contrat . statut cadre": "non",
          ...Object.fromEntries(Object.entries(situation).map(([name, v]) => [`${namespace} . ${name}`, v])),
          [`${namespace} . ${input}`]: classification,
        });
        return engine.evaluate(`${namespace} . ${rule}`).nodeValue;
      };
      assert.equal(evaluate(valid), false, String(valid));
      for (const classification of invalid) assert.equal(evaluate(classification), true, String(classification));
    });
  }
});
