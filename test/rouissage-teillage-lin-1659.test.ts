import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1659-rouissage-teillage-lin";
const value = "rouissage teillage lin";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2024.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const GRID: Record<number, number> = {
  120: 1833.13, 125: 1871.48, 130: 1882.67, 140: 1892.26, 150: 1959.39,
  160: 1994.55, 170: 2034.51, 190: 2122.41, 240: 2189.02, 270: 2406.37,
  300: 2558.05, 400: 3190.5, 500: 3909.12, 600: 4529.68,
};

function setSituation(coefficient: number, quotité = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . coefficient`]: coefficient,
    "salarié . contrat . temps de travail . quotité": quotité,
  });
}

function minimum() {
  return engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
}

describe("IDCC 1659 — 2024.1 salaires et audit paie", () => {
  it("uses the official 2024 salary amendment and extension references", () => {
    assert.equal(version.validFrom, "2024-01-01");
    assert.ok(version.sources.some((source) => source.includes("KALIARTI000049271188")));
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000005654162")));
    assert.ok(version.sources.some((source) => source.includes("JORF n° 0164")));
  });

  for (const [coefficient, expected] of Object.entries(GRID)) {
    it(`calculates ${expected} € for coefficient ${coefficient}`, () => {
      setSituation(Number(coefficient));
      assert.equal(minimum(), expected);
      assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, false);
    });
  }

  it("prorates the minimum for part-time work", () => {
    setSituation(600, "50%");
    assert.equal(minimum(), 2264.84);
  });

  it("rejects classifications outside the sourced grid", () => {
    setSituation(180);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
    assert.equal(minimum(), null);
  });

  it("exposes the payroll audit and keeps standard contributions isolated", () => {
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
    assert.equal(Object.keys(extension).some((name) => name in modeleSocial), false);
    assert.equal(Object.keys(extension).some((name) => /cotisations|prévoyance|santé|formation professionnelle|retraite|AT/.test(name)), false);
  });

  it("is inapplicable for another collective agreement", () => {
    setSituation(120);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
