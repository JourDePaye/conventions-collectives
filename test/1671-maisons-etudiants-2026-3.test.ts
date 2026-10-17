import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "maisons d'étudiants";
const namespace = `salarié . convention collective . ${value}`;
const list = COMPILED_VERSIONS["1671-maisons-etudiants"]!;

async function engineFor(revision: string) {
  const version = list.find((v) => v.version === revision);
  assert.ok(version, revision);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, await version.loadRules());
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

const engines = { "2026.2": await engineFor("2026.2"), "2026.3": await engineFor("2026.3") };

function minimum(revision: keyof typeof engines, classe: number, quota = "100%") {
  const engine = engines[revision];
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . classe`]: classe,
    "salarié . contrat . temps de travail . quotité": quota,
  });
  return engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue;
}

// Avenant n° 75, article 4 (coefficients) and avenant n° 76 (point 68,80 € from 1 January 2026; 67,78 € before).
const COEFFICIENTS = [333, 340, 347, 356, 365, 373, 381, 390, 400, 410, 420, 431, 459, 469, 499, 529, 559, 587, 627, 677];

describe("IDCC 1671 — 2026.3 (avenants n° 75 and n° 76)", () => {
  it("takes effect on 1 January 2026, for the employers of a signatory organisation", () => {
    assert.equal(list.find((v) => v.version === "2026.3")?.validFrom, "2026-01-01");
    assert.equal(list.filter((v) => v.validFrom <= "2026-01-01").map((v) => v.version).sort().at(-1), "2026.3");
  });

  COEFFICIENTS.forEach((coefficient, index) => {
    it(`class ${index + 1}: coefficient ${coefficient} x 68,80 €`, () => {
      assert.equal(minimum("2026.3", index + 1), Math.round(coefficient * 68.8 * 100) / 100);
    });
  });

  it("gives hard-coded amounts for the lowest, middle and highest classes", () => {
    assert.equal(minimum("2026.3", 1), 22910.4);
    assert.equal(minimum("2026.3", 10), 28208);
    assert.equal(minimum("2026.3", 20), 46577.6);
  });

  it("prorates once for part-time work", () => {
    assert.equal(minimum("2026.3", 10, "50%"), 14104);
  });

  it("flags a class outside the grid", () => {
    assert.equal(minimum("2026.3", 21), null);
    assert.equal(engines["2026.3"].evaluate(`${namespace} . classe hors grille`).nodeValue, true);
  });
});

describe("IDCC 1671 — 2026.2 (avenant n° 75 with the point at 67,78 €)", () => {
  it("keeps the old point value: 410 x 67,78 € for class 10", () => {
    assert.equal(minimum("2026.2", 10), 27789.8);
  });

  it("uses the same coefficients as 2026.3", () => {
    COEFFICIENTS.forEach((coefficient, index) => {
      assert.equal(minimum("2026.2", index + 1), Math.round(coefficient * 67.78 * 100) / 100);
    });
  });
});
