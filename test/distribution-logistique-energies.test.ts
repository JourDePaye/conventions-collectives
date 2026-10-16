import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1408-distribution-logistique-energies";
const value = "distribution logistique énergies";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2025.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const MONTHLY: Record<string, number> = {
  "200": 1852.12, "210": 1858.37, "220": 1867.80, "230": 1882.42,
  "240": 1911.42, "250": 1989.36, "300": 2145.22, "310": 2456.96,
  "320": 2768.68, "400": 2846.62, "410": 3158.36, "420": 3781.82,
  "430": 4405.29, "440": 5184.63, "450": 6119.83, "460": 7522.62,
};
function setSituation(coefficient: string | undefined, quota?: string, seniority?: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(coefficient === undefined ? {} : { [`${namespace} . coefficient`]: coefficient }),
    ...(quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": quota }),
    ...(seniority === undefined ? {} : { [`${namespace} . ancienneté`]: seniority }),
  });
}
const amount = () => engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
const seniority = () => engine.evaluate(`${namespace} . prime d'ancienneté`).nodeValue;

describe("IDCC 1408 — 2025.1 minimum salaries", () => {
  it("cites the extended salary agreement", () => {
    assert.equal(version.validFrom, "2025-05-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000051787046")));
    assert.ok(version.sources.some((source) => source.includes("arrêté du 27 mai 2025")));
  });
  for (const [coefficient, monthly] of Object.entries(MONTHLY)) {
    it(`${coefficient}: ${monthly} € a month`, () => {
      setSituation(coefficient);
      assert.equal(amount(), monthly);
    });
  }
  it("prorates once for part-time work", () => {
    setSituation("320", "50%");
    assert.equal(Math.round((amount() as number) * 100) / 100, 1384.34);
  });
  it("calculates the 15% seniority premium at 15 years", () => {
    setSituation("320", undefined, "15 ans");
    assert.equal(Math.round((seniority() as number) * 100) / 100, 415.30);
  });
  it("rejects coefficients outside the grid", () => {
    for (const coefficient of ["199", "330", "'non renseigné'"]) {
      setSituation(coefficient);
      assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
      assert.equal(amount(), 0);
    }
  });
  it("is inapplicable outside the agreement", () => {
    setSituation("320");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . prime d'ancienneté`).nodeValue, null);
  });
});
