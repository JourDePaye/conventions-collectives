import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3243-quincaillerie";
const value = "quincaillerie fournitures industrielles fers métaux équipement maison";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setLevel(level: string, quotity = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau et échelon`]: `'${level}'`,
    "salarié . contrat . temps de travail . quotité": quotity,
  });
}

function minimum() {
  return engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
}

describe("IDCC 3243 — 2026.1 salary minimums and payroll audit", () => {
  it("uses the official 1 May 2026 extension effective date", () => {
    assert.equal(version.validFrom, "2026-05-01");
    assert.ok(version.sources.some((source: string) => source.includes("22 janvier 2026")));
    assert.ok(version.sources.some((source: string) => source.includes("8 avril 2026")));
  });

  for (const [level, expected] of Object.entries({
    "I.1": 1840,
    "III.3": 1906,
    "IV.2": 1936,
    "V.3": 2138,
    "VI.3": 2351,
    "VII.3": 3402,
    "VIII.2": 3763,
    "IX.1": 4753,
  })) {
    it(`classification ${level} evaluates the sourced monthly minimum`, () => {
      setLevel(level);
      assert.equal(minimum(), expected);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setLevel("VI.3", "50%");
    assert.equal(minimum(), 1175.5);
  });

  it("marks an unknown classification outside the grid", () => {
    setLevel("IX.2");
    assert.equal(minimum(), 0);
  });

  it("is isolated from another convention", () => {
    setLevel("V.1");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });

  it("does not redefine payroll-wide endpoints or collide with modele-social", () => {
    assert.equal(Object.keys(extension).some((name) => name.includes("cotisations") || name.includes("prévoyance") || name.includes("santé") || name.includes("formation professionnelle") || name.includes("exonération cotisation AT")), false);
    assert.equal(Object.keys(extension).some((name) => name in modeleSocial), false);
  });
});
