/**
 * Building 2026.7 and public works 2026.6: the shared versions under their own rule value,
 * `bâtiment et travaux publics`, instead of modele-social's `BTP` agreement, whose rules they take
 * over after checking them on Légifrance (RNPO: avenant n° 59 du 20 mars 2018; RNPE: avenant
 * n° 34 du 20 mars 2018; OPPBTP: arrêté du 12 décembre 2025; code du travail L. 1242-16 and
 * L. 3141-32).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const NS = "salarié . convention collective . bâtiment et travaux publics";
const OLD = "salarié . convention collective . BTP";
const quiet = { logger: { log() {}, warn() {}, error() {} } };

async function engineOf(model: string, version: string, value?: string) {
  const found = COMPILED_VERSIONS[model]?.find((v) => v.version === version);
  assert.ok(found, `${model} ${version}`);
  const rules: Record<string, Rule> = { ...modeleSocial };
  if (value) {
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  }
  const extension = await found.loadRules();
  for (const name of Object.keys(extension)) assert.ok(!(name in modeleSocial), `Duplicate modele-social rule: ${name}`);
  Object.assign(rules, extension);
  return new Engine(rules, quiet);
}

const base = (gross: number) => ({ salarié: "oui", dirigeant: "non", date: "01/10/2026", "salarié . contrat . salaire brut": `${gross} €/mois` });
const round = (value: unknown) => Math.round(Number(value ?? 0) * 100) / 100;
const OUTPUTS = [
  "salarié . cotisations . employeur",
  "salarié . cotisations . salarié",
  "salarié . rémunération . net . à payer avant impôt",
  "salarié . cotisations . prévoyances . conventionnelle . employeur",
  "salarié . cotisations . retraite complémentaire . salarié",
];

for (const [model, previous, current, building] of [
  ["1597-batiment-ouvriers-plus-de-10", "2026.6", "2026.7", true],
  ["1702-travaux-publics-ouvriers", "2026.5", "2026.6", false],
] as const) {
  describe(`${model} ${current}`, () => {
    it(`gives the amounts of ${previous} under modele-social's BTP agreement`, async () => {
      const before = await engineOf(model, previous);
      const after = await engineOf(model, current, "bâtiment et travaux publics");
      for (const category of ["ouvrier", "etam", "cadre"]) {
        for (const gross of [1900, 3200, 9000, 16000]) {
          before.setSituation({
            ...base(gross),
            "salarié . convention collective": "'BTP'",
            [`${OLD} . catégorie`]: `'${category}'`,
            ...(building && { [`${OLD} . congés intempéries . caisse de rattachement`]: "'grand ouest'", [`${OLD} . chômage intempéries . catégorie`]: "'second œuvre'" }),
          });
          after.setSituation({
            ...base(gross),
            "salarié . convention collective": "'bâtiment et travaux publics'",
            [`${NS} . catégorie`]: `'${category}'`,
            ...(building && { [`${NS} . cotisation congés payés . caisse de rattachement`]: "'grand ouest'", [`${NS} . chômage intempéries . catégorie`]: "'second œuvre'" }),
          });
          for (const output of OUTPUTS) {
            assert.equal(round(after.evaluate(output).nodeValue), round(before.evaluate(output).nodeValue), `${category} ${gross} ${output}`);
          }
        }
      }
    });

    it("applies none of modele-social's BTP rules", async () => {
      const engine = await engineOf(model, current, "bâtiment et travaux publics");
      engine.setSituation({ ...base(2500), "salarié . convention collective": "'bâtiment et travaux publics'" });
      assert.equal(engine.evaluate(NS).nodeValue, true);
      assert.equal(engine.evaluate(OLD).nodeValue, false);
      assert.equal(engine.evaluate(`${OLD} . OPPBTP`).nodeValue, null);
    });
  });
}

describe("bâtiment et travaux publics, rules taken over from modele-social", () => {
  it("pays no paid leave indemnity at the end of a fixed-term contract: the fund pays the leave", async () => {
    const engine = await engineOf("1597-batiment-ouvriers-plus-de-10", "2026.7", "bâtiment et travaux publics");
    const cdd = { "salarié . contrat": "'CDD'", "salarié . contrat . CDD . congés pris": "0 jour ouvré" };
    engine.setSituation({ ...base(2500), ...cdd, "salarié . convention collective": "'bâtiment et travaux publics'" });
    assert.equal(engine.evaluate("salarié . rémunération . indemnités CDD . congés payés").nodeValue, null);
    // Elsewhere, a tenth of the pay when no leave is taken.
    engine.setSituation({ ...base(2500), ...cdd, "salarié . convention collective": "'droit commun'" });
    assert.ok(Number(engine.evaluate("salarié . rémunération . indemnités CDD . congés payés").nodeValue) > 0);
  });

  it("charges the provident contributions on the social security base, bonuses included", async () => {
    const engine = await engineOf("1597-batiment-ouvriers-plus-de-10", "2026.7", "bâtiment et travaux publics");
    const conventional = "salarié . cotisations . prévoyances . conventionnelle";
    for (const [category, employer, employee] of [["ouvrier", 1.72, 0.87], ["etam", 1.25, 0.6]] as const) {
      engine.setSituation({
        ...base(2000),
        "salarié . rémunération . primes . activité . base": "500 €/mois",
        "salarié . convention collective": "'bâtiment et travaux publics'",
        [`${NS} . catégorie`]: `'${category}'`,
      });
      assert.equal(round(engine.evaluate(`${conventional} . employeur`).nodeValue), round(2500 * employer / 100), category);
      assert.equal(round(engine.evaluate(`${conventional} . salarié`).nodeValue), round(2500 * employee / 100), category);
    }
  });

  it("makes the cadres executives", async () => {
    const engine = await engineOf("1702-travaux-publics-ouvriers", "2026.6", "bâtiment et travaux publics");
    engine.setSituation({ ...base(4000), "salarié . convention collective": "'bâtiment et travaux publics'", [`${NS} . catégorie`]: "'cadre'" });
    assert.equal(engine.evaluate("salarié . contrat . statut cadre").nodeValue, true);
  });
});
