import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1938-industries-transformation-volailles";
const value = "industries de la transformation des volailles";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2025.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const MINIMUMS: Record<number, number> = {
  120: 1802, 125: 1811.52, 130: 1819.68, 135: 1827.84, 140: 1836, 145: 1845.17,
  150: 1851.9, 155: 1858.64, 160: 1865.38, 165: 1872.11, 170: 1878.85,
  175: 1885.58, 180: 1892.32, 185: 1899.06, 190: 1919.95, 195: 1957.13,
  200: 1975.6, 215: 2033.06, 230: 2134.09, 245: 2232.83, 260: 2341.07,
  280: 2458.16, 300: 2586.92, 320: 2734.41, 340: 2874.88, 350: 2882.84,
  375: 3081.24, 400: 3268.01, 450: 3618.15, 500: 3968.26, 600: 4656.91, 700: 5345.51,
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

describe("IDCC 1938 — 2025.1 minimum salaries", () => {
  it("keeps the salary-only agreement isolated from modele-social payroll endpoints", () => {
    assert.deepEqual(Object.keys(extension).sort(), [
      namespace,
      `${namespace} . coefficient`,
      `${namespace} . salaire minimum conventionnel`,
      `${namespace} . grille mensuelle`,
      `${namespace} . coefficient hors grille`,
    ].sort());
  });

  it("is in force from 1 February 2025 and cites the extended agreement", () => {
    assert.equal(version.validFrom, "2025-02-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 6 février 2025")));
    assert.ok(version.sources.some((source) => source.includes("arrêté du 9 avril 2025")));
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
    assert.equal(amount(), 1634.005);
  });

  it("rejects coefficients outside the grid", () => {
    for (const coefficient of [100, 121, 210, 701]) {
      setSituation(coefficient);
      assert.equal(outOfGrid(), true, String(coefficient));
      assert.equal(amount(), 0, String(coefficient));
    }
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation(400);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
