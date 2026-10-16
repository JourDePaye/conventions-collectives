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
  "3243-quincaillerie.2026.1",
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
  { model: "3243-quincaillerie", version: "2026.2", rule: "niveau et échelon hors grille", input: "niveau et échelon", valid: "'VI.3'", invalid: ["'VI.9'", "'non renseigné'"] },
  { model: "1512-promotion-immobiliere", version: "2026.3", rule: "coefficient hors grille", input: "coefficient", valid: 100, invalid: [0, 101, 900] },
  { model: "0897-services-prevention-sante-travail-interentreprises", version: "2026.2", rule: "classe hors grille", input: "classe", valid: "'M'", invalid: ["'N'", "'non renseigné'"] },
  // Palier 1 starts at coefficient 9 and palier 12 covers 400 and above.
  { model: "7024-production-agricole-cuma", version: "2026.1", rule: "coefficient hors grille", input: "coefficient", valid: 1000, invalid: [0, 8] },
  // Executives' coefficients only have an annual guarantee, and are in the grid.
  { model: "0489-industries-cartonnage", version: "2025.4", rule: "classification hors grille", input: "coefficient", valid: 600, invalid: [0, 999] },
  { model: "1558-industries-ceramiques", version: "2025.2", rule: "niveau hors grille", input: "classification", valid: "'J'", invalid: ["'ZZ-E9'", "'non renseigné'"] },
  { model: "1267-patisserie", version: "2026.1", rule: "coefficient hors grille", input: "coefficient", valid: 220, invalid: [0, 195, 351] },
  { model: "1513-eaux-embouteillees-boissons-bieres", version: "2026.1", rule: "classification hors grille", input: "classification", valid: "'7-1'", invalid: ["'9-1'", "'non renseigné'"] },
  { model: "1880-commerce-ameublement", version: "2026.1", rule: "niveau hors grille", input: "niveau", valid: "'5.2'", invalid: ["'9.3'", "'non renseigné'"] },
  { model: "0200-exploitations-frigorifiques", version: "2026.1", rule: "coefficient hors grille", input: "coefficient", valid: 305, invalid: [0, 130, 706] },
  { model: "3250-commissaires-justice", version: "2026.1", rule: "classification hors grille", input: "classification", valid: "'II-296'", invalid: ["'II-999'", "'non renseigné'"] },
  { model: "2002-blanchisserie-teinturerie", version: "2026.1", rule: "classification hors grille", input: "classification", valid: "'5-1'", invalid: ["'10-1'", "'non renseigné'"] },
  { model: "3205-cooperatives-consommateurs", version: "2026.3", rule: "groupe hors grille", input: "groupe", valid: "'8a'", invalid: ["'8'", "'non renseigné'"] },
  { model: "1077-negoce-produits-du-sol-engrais", version: "2025.1", rule: "coefficient hors grille", input: "coefficient", valid: 350, invalid: [0, 130, 681] },
  { model: "3255-boulangerie-industrielle", version: "2026.1", rule: "niveau hors grille", input: "niveau", valid: "'L3'", invalid: ["'OE1'", "'non renseigné'"] },
  { model: "0478-societes-financieres", version: "2026.1", rule: "coefficient hors grille", input: "coefficient", valid: 400, invalid: [0, 260, 1000], situation: { "adhérent d'une organisation signataire": "oui" } },
  { model: "3252-entreprises-creation-evenement", version: "2026.1", rule: "classification hors grille", input: "classification", valid: "'5'", invalid: ["'1'", "'11'", "'non renseigné'"] },
  { model: "0275-transport-aerien-personnel-sol", version: "2025.4", rule: "coefficient hors grille", input: "coefficient", valid: 750, invalid: [0, 161, 999] },
  { model: "3236-industrie-services-nautiques", version: "2025.2", rule: "niveau et échelon hors grille", input: "niveau et échelon", valid: "'II.3'", invalid: ["'VIII.1'", "'non renseigné'"] },
  { model: "2219-taxis", version: "2025.2", rule: "classification hors grille", input: "classification", valid: "'non roulant — échelon VI'", invalid: ["'non roulant — échelon VII'", "'niveau 3 — conducteur confirmé — non titulaire carte professionnelle'", "'non renseigné'"] },
  { model: "1557-commerce-articles-sports-loisirs", version: "2025.2", rule: "classification hors grille", input: "classification", valid: "'250'", invalid: ["'135'", "'O5'", "'non renseignée'"] },
  { model: "3016-ateliers-chantiers-insertion", version: "2026.2", rule: "coefficient hors grille", input: "coefficient", valid: 313, invalid: [0, 260, 300, 671] },
  { model: "3013-librairie", version: "2026.3", rule: "niveau hors grille", input: "niveau", valid: "'8'", invalid: ["'99'", "'non renseigné'"] },
  { model: "1558-industries-ceramiques", version: "2026.1", rule: "niveau hors grille", input: "classification", valid: "'J'", invalid: ["'ZZ-E9'", "'non renseigné'"] },
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
