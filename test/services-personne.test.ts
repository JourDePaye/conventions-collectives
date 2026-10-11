import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const model = "3127-services-personne";
const value = "services à la personne";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[model]?.find((entry) => entry.version === "2024.1");
assert.ok(version, "IDCC 3127 version 2024.1 must be compiled");
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = {
  ...choice,
  "une possibilité": [...new Set([...choice["une possibilité"], value])],
} as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const HOURLY = {
  jardinage: 11.68,
  bricolage: 11.68,
  "auxiliaire-vie-1": 11.68,
  "garde-enfants-1": 11.68,
  "assistant-menager-1": 11.68,
  "garde-enfants-2": 11.77,
  "assistant-menager-2": 11.77,
  "auxiliaire-vie-2": 11.85,
  "garde-enfants-3": 11.85,
  "auxiliaire-vie-3": 12.11,
} as const;

function setSituation(inputs: Record<string, string | number> = {}, context: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . emploi-repère`]: "'jardinage'",
    ...Object.fromEntries(Object.entries(inputs).map(([name, input]) => [`${namespace} . ${name}`, input])),
    ...context,
  });
}

function amount(name: string) {
  const result = engine.evaluate(`${namespace} . ${name}`).nodeValue;
  assert.equal(typeof result, "number", name);
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 3127 — 2024.1 services à la personne", () => {
  it("is effective from 20 June 2024 and cites the extended wage amendment", () => {
    assert.equal(version.validFrom, "2024-06-20");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 11 du 22 janvier 2024")));
    assert.ok(version.sources.some((source) => source.includes("KALIARTI000049731128")));
  });

  for (const [job, hourly] of Object.entries(HOURLY)) {
    it(`${job}: ${hourly} € per hour`, () => {
      setSituation({ "emploi-repère": `'${job}'` });
      assert.equal(amount("taux horaire minimum conventionnel"), hourly);
      assert.equal(amount("salaire minimum conventionnel"), Math.round(hourly * 151.67 * 100) / 100);
      assert.equal(engine.evaluate(`${namespace} . emploi-repère hors grille`).nodeValue, false);
    });
  }

  it("prorates its monthly minimum once for part-time work", () => {
    setSituation({ "emploi-repère": "'auxiliaire-vie-3'" }, { "salarié . contrat . temps de travail . quotité": "50%" });
    assert.equal(amount("salaire minimum conventionnel"), Math.round(12.11 * 151.67 * 50) / 100);
  });

  it("rejects unknown or missing employment references", () => {
    for (const job of ["auxiliaire-vie-4", "garde-enfants-4", "jardinage-1", "non renseigné"]) {
      setSituation({ "emploi-repère": `'${job}'` });
      assert.equal(engine.evaluate(`${namespace} . emploi-repère hors grille`).nodeValue, true, job);
      assert.equal(amount("salaire minimum conventionnel"), 0, job);
    }
    engine.setSituation({ "salarié . convention collective": `'${value}'` });
    assert.equal(engine.evaluate(`${namespace} . emploi-repère hors grille`).nodeValue, true);
  });

  it("calculates the hourly seniority premium separately", () => {
    for (const [years, rate] of [[0, 0], [2, 0.05], [5, 0.15], [10, 0.25]] as const) {
      setSituation({ ancienneté: `${years} an`, "heures ouvrant droit à la prime d'ancienneté": "10 heure/mois" });
      assert.equal(amount("prime d'ancienneté"), rate * 10, `${years} years`);
      assert.equal(amount("salaire minimum conventionnel"), Math.round(11.68 * 151.67 * 100) / 100);
    }
  });

  it("calculates the large-childcare, night and non-cumulative Sunday/holiday premiums", () => {
    setSituation({
      "taux horaire contractuel": "15 €/heure",
      "heures de garde de plus de trois enfants": "2 heure/mois",
      "heures de nuit ouvrant droit à majoration": "2 heure/mois",
      "heures dimanche ou férié ordinaire ouvrant droit à majoration": "2 heure/mois",
      "heures du 1er mai ou du 25 décembre": "2 heure/mois",
    });
    assert.equal(amount("prime de garde de plus de trois enfants"), 3);
    assert.equal(amount("majoration de nuit"), 1.5);
    assert.equal(amount("majoration dimanche et férié ordinaire"), 3);
    assert.equal(amount("majoration du 1er mai et du 25 décembre"), 30);
  });

  it("provides night compensatory rest only to night workers", () => {
    setSituation({ "salarié de nuit": "oui", "heures de nuit ouvrant droit à majoration": "20 heure/mois" });
    assert.equal(amount("repos compensateur de nuit"), 1);
    setSituation({ "salarié de nuit": "non", "heures de nuit ouvrant droit à majoration": "20 heure/mois" });
    assert.equal(amount("repos compensateur de nuit"), 0);
  });

  it("calculates professional mileage reimbursement", () => {
    setSituation({ "kilomètres professionnels avec véhicule personnel": "10 km/mois" });
    assert.equal(amount("indemnité kilométrique conventionnelle"), 3.5);
  });

  it("is inapplicable outside the agreement", () => {
    setSituation({}, { "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "emploi-repère hors grille", "prime d'ancienneté", "majoration de nuit"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
