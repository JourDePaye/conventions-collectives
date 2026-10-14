import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1077-cooperatives-agricoles-cereales";
const value = "coopératives agricoles céréales";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === "2025.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setLevel(level: number, quotity = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: level,
    "salarié . contrat . temps de travail . quotité": quotity,
  });
}

function minimum() {
  return engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
}

describe("IDCC 1077 — 2025.1 salary minimums and payroll audit", () => {
  it("uses the official salary agreement source and effective date", () => {
    assert.equal(version.validFrom, "2025-03-01");
    assert.ok(version.sources.some((source: string) => source.includes("KALITEXT000051910263")));
  });

  for (const [level, expected] of Object.entries({ 1: 1831.8, 2: 1846.77, 3: 1872.97, 4: 1947.89, 5: 1984.1, 6: 2039.05 })) {
    it(`level ${level} evaluates the sourced monthly minimum`, () => {
      setLevel(Number(level));
      assert.equal(minimum(), expected);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setLevel(6, "50%");
    assert.equal(minimum(), 1019.525);
  });

  it("marks classifications outside the bounded grid", () => {
    setLevel(7);
    assert.equal(minimum(), 0);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
  });

  it("is isolated from another convention and leaves payroll-wide endpoints untouched", () => {
    setLevel(1);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(Object.keys(extension).some((name) => name.includes("cotisations") || name.includes("prévoyance") || name.includes("santé") || name.includes("formation professionnelle") || name.includes("exonération cotisation AT")), false);
    assert.equal(Object.keys(extension).some((name) => name in modeleSocial), false);
  });

  it("exposes the explicit payroll audit", () => {
    setLevel(1);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
  });
});
