import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1938-industries-transformation-volailles";
const value = "industries de la transformation des volailles";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

// Accord du 28 janvier 2026, annexe, column "1er février 2026" (KALITEXT000054066679).
const MINIMUMS: Record<number, number> = {
  120: 1824, 125: 1834.16, 130: 1842.43, 135: 1850.69, 140: 1858.95, 145: 1868.23,
  150: 1875.05, 155: 1881.87, 160: 1888.69, 165: 1895.51, 170: 1902.33,
  175: 1909.15, 180: 1915.97, 185: 1922.79, 190: 1943.95, 195: 1981.59,
  200: 2000.3, 215: 2058.47, 230: 2160.77, 245: 2260.74, 260: 2370.33,
  280: 2488.89, 300: 2619.25, 320: 2768.59, 340: 2910.82, 350: 2918.88,
  375: 3119.76, 400: 3308.86, 450: 3663.37, 500: 4017.87, 600: 4715.13, 700: 5412.33,
};

function setSituation(coefficient: number, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . coefficient`]: coefficient,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

const amount = () => engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
const outOfGrid = () => engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue;

describe("IDCC 1938 — 2026.1 minimum salaries", () => {
  it("keeps the same rule names as 2025.1", () => {
    assert.deepEqual(Object.keys(extension).sort(), [
      namespace,
      `${namespace} . coefficient`,
      `${namespace} . salaire minimum conventionnel`,
      `${namespace} . grille mensuelle`,
      `${namespace} . coefficient hors grille`,
    ].sort());
  });

  it("is in force from 1 February 2026 and cites the 28 January 2026 accord", () => {
    assert.equal(version.validFrom, "2026-02-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 28 janvier 2026")));
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000054066679")));
  });

  for (const [coefficient, minimum] of Object.entries(MINIMUMS)) {
    it(`${coefficient}: ${minimum} € monthly`, () => {
      setSituation(Number(coefficient));
      assert.equal(amount(), minimum);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the monthly minimum for part-time work", () => {
    setSituation(400, "50%");
    assert.equal(amount(), 1654.43);
  });

  it("rejects coefficients outside the grid", () => {
    for (const coefficient of [100, 121, 210, 701]) {
      setSituation(coefficient);
      assert.equal(outOfGrid(), true, String(coefficient));
      assert.equal(amount(), 0, String(coefficient));
    }
  });
});
