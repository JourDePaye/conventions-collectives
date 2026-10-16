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
const version = versions.find((entry) => entry.version === "2025.2");
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

// Annex of the accord of 13 March 2025 (KALITEXT000051787046), amounts in euros.
const MONTHLY: Record<string, number> = {
  "200": 1852.12, "210": 1858.37, "220": 1867.80, "230": 1882.42, "240": 1911.42, "250": 1989.36,
  "300": 2145.22, "310": 2456.96, "320": 2768.68, "400": 2846.62, "410": 3158.36, "420": 3781.82,
  "430": 4405.29, "440": 5184.63, "450": 6119.83, "460": 7522.62,
};
// Seniority premium columns: 3, 6, 9, 10, 11, 12, 13, 14, 15 years.
const YEARS = [3, 6, 9, 10, 11, 12, 13, 14, 15];
const PREMIUM: Record<string, number[]> = {
  "200": [55.56, 111.13, 166.69, 185.21, 203.73, 222.25, 240.78, 259.30, 277.82],
  "210": [55.75, 111.50, 167.25, 185.84, 204.42, 223.00, 241.59, 260.17, 278.76],
  "220": [56.03, 112.07, 168.10, 186.78, 205.46, 224.14, 242.81, 261.49, 280.17],
  "230": [56.47, 112.95, 169.42, 188.24, 207.07, 225.89, 244.71, 263.54, 282.36],
  "240": [57.34, 114.69, 172.03, 191.14, 210.26, 229.37, 248.48, 267.60, 286.71],
  "250": [59.68, 119.36, 179.04, 198.94, 218.83, 238.72, 258.62, 278.51, 298.40],
  "300": [64.36, 128.71, 193.07, 214.52, 235.97, 257.43, 278.88, 300.33, 321.78],
  "310": [73.71, 147.42, 221.13, 245.70, 270.27, 294.83, 319.40, 343.97, 368.54],
  "320": [83.06, 166.12, 249.18, 276.87, 304.55, 332.24, 359.93, 387.61, 415.30],
};

describe("IDCC 1408 — 2025.2 minimum salaries and seniority premium", () => {
  it("supersedes 2025.1 on the same effective date and cites the right text", () => {
    assert.equal(version.validFrom, "2025-05-01");
    const first = versions.find((entry) => entry.version === "2025.1");
    assert.equal(first?.validFrom, "2025-05-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000051787046")));
    assert.ok(version.sources.some((source) => source.includes("13 mars 2025")));
    assert.ok(version.sources.some((source) => source.includes("27 mai 2025")));
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
        // The annex gives 294,83 (310, 12 years) and 387,61 (320, 14 years): one cent under the rate applied
        // to the published minimum, which the model computes (294,8352 and 387,6152).
        const expected = amounts[index] as number;
        assert.ok(Math.abs(round2(premium()) - expected) <= 0.011, `${coefficient} at ${years} years: ${premium()} vs ${expected}`);
      });
    });
  }
  it("gives no premium before 3 years and keeps the last step reached between two steps", () => {
    setSituation("200", "2 années");
    assert.equal(premium(), 0);
    setSituation("200", "4 années");
    assert.equal(round2(premium()), 55.56);
    setSituation("200", "20 années");
    assert.equal(round2(premium()), 277.82);
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
    assert.equal(round2(minimum()), 1384.34);
    assert.equal(round2(premium()), 207.65);
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
