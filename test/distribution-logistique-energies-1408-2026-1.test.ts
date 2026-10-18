import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1408-distribution-logistique-energies";
const value = "distribution logistique énergies";
const namespace = `salarié . convention collective . ${value}`;
const versions = COMPILED_VERSIONS[agreement];
assert.ok(versions);
const version = versions.find((entry) => entry.version === "2026.1");
assert.ok(version);
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, await version.loadRules());
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(coefficient: string, seniority?: string, quota?: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . coefficient`]: coefficient,
    ...(seniority === undefined ? {} : { [`${namespace} . ancienneté`]: seniority }),
    ...(quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": quota }),
  });
}
const round2 = (n: unknown) => Math.round((n as number) * 100) / 100;
const minimum = () => engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
const premium = () => engine.evaluate(`${namespace} . prime d'ancienneté`).nodeValue;

// Annex of the accord of 3 April 2026 (KALITEXT000054801796), amounts in euros.
const MONTHLY: Record<string, number> = {
  "200": 1870.64, "210": 1876.95, "220": 1886.48, "230": 1901.24, "240": 1930.53, "250": 2009.25,
  "300": 2166.67, "310": 2481.53, "320": 2796.37, "400": 2875.09, "410": 3189.94, "420": 3819.64,
  "430": 4449.34, "440": 5236.48, "450": 6181.03, "460": 7597.85,
};
// Seniority premium columns: 3, 6, 9, 10, 11, 12, 13, 14, 15 years.
const YEARS = [3, 6, 9, 10, 11, 12, 13, 14, 15];
const PREMIUM: Record<string, number[]> = {
  "200": [56.12, 112.24, 168.36, 187.06, 205.77, 224.48, 243.18, 261.89, 280.60],
  "210": [56.31, 112.62, 168.93, 187.70, 206.46, 225.23, 244.00, 262.77, 281.54],
  "220": [56.59, 113.19, 169.78, 188.65, 207.51, 226.38, 245.24, 264.11, 282.97],
  "230": [57.04, 114.07, 171.11, 190.12, 209.14, 228.15, 247.16, 266.17, 285.19],
  "240": [57.92, 115.83, 173.75, 193.05, 212.36, 231.66, 250.97, 270.27, 289.58],
  "250": [60.28, 120.56, 180.83, 200.93, 221.02, 241.11, 261.20, 281.30, 301.39],
  "300": [65.00, 130.00, 195.00, 216.67, 238.33, 260.00, 281.67, 303.33, 325.00],
  "310": [74.45, 148.89, 223.34, 248.15, 272.97, 297.78, 322.60, 347.41, 372.23],
  "320": [83.89, 167.78, 251.67, 279.64, 307.60, 335.56, 363.53, 391.49, 419.46],
};

describe("IDCC 1408 — 2026.1 minimum salaries and seniority premium", () => {
  it("applies from 1 May 2026, without extension, and cites the accord of 3 April 2026", () => {
    assert.equal(version.validFrom, "2026-05-01");
    assert.equal(version.extension, undefined);
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000054801796")));
    assert.ok(version.sources.some((source) => source.includes("3 avril 2026")));
  });
  it("2025.3 supersedes 2025.2 with the extension of the accord of 13 March 2025", () => {
    const extended = versions.find((entry) => entry.version === "2025.3");
    assert.equal(extended?.validFrom, "2025-05-01");
    assert.equal(extended?.extension, "2025-05-31");
    assert.equal(versions.find((entry) => entry.version === "2025.2")?.extension, undefined);
  });
  for (const [coefficient, monthly] of Object.entries(MONTHLY)) {
    it(`${coefficient}: ${monthly} € a month`, () => {
      setSituation(coefficient);
      assert.equal(minimum(), monthly);
    });
  }
  for (const [coefficient, amounts] of Object.entries(PREMIUM)) {
    it(`${coefficient}: premium at 3 to 15 years`, () => {
      YEARS.forEach((years, index) => {
        setSituation(coefficient, `${years} années`);
        // The annex rounds each amount; the model applies the rate to the published minimum.
        const expected = amounts[index] as number;
        assert.ok(Math.abs(round2(premium()) - expected) <= 0.011, `${coefficient} at ${years} years: ${premium()} vs ${expected}`);
      });
    });
  }
  it("gives no premium before 3 years and keeps the last step reached between two steps", () => {
    setSituation("200", "2 années");
    assert.equal(premium(), 0);
    setSituation("200", "4 années");
    assert.equal(round2(premium()), 56.12);
    setSituation("200", "20 années");
    assert.equal(round2(premium()), 280.6);
  });
  it("gives no seniority premium to coefficients 400 and above", () => {
    for (const coefficient of ["400", "410", "420", "430", "440", "450", "460"]) {
      setSituation(coefficient, "15 années");
      assert.equal(premium(), 0, coefficient);
      assert.equal(engine.evaluate(`${namespace} . coefficient ouvrant droit à la prime`).nodeValue, false);
    }
  });
  it("prorates the minimum and the premium once for part-time work", () => {
    setSituation("320", "15 années", "50%");
    assert.equal(round2(minimum()), 1398.19);
    assert.equal(round2(premium()), 209.73);
  });
  it("rejects coefficients outside the grid, without premium", () => {
    for (const coefficient of ["199", "330", "'non renseigné'"]) {
      setSituation(coefficient, "15 années");
      assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
      assert.equal(minimum(), 0);
      assert.equal(premium(), 0);
    }
  });
  it("is inapplicable outside the agreement", () => {
    setSituation("320");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . prime d'ancienneté`).nodeValue, null);
  });
});
