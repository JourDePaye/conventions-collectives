import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3205-cooperatives-consommateurs";
const value = "coopératives de consommateurs";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setLevel(level: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: `'${level}'`,
    "salarié . contrat . temps de travail . quotité": "100%",
  });
}

function minimum() {
  return engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
}

describe("IDCC 3205 — 2026.1 salary minimums and payroll audit", () => {
  it("uses the official 1 May 2026 effective date", () => {
    assert.equal(version.validFrom, "2026-05-01");
    assert.ok(version.sources.some((source: string) => source.includes("Avenant n° 932")));
  });

  for (const [level, expected] of Object.entries({
    "1": 1823.07,
    "2": 1840.70,
    "3": 1862.28,
    "4": 1883.78,
    "5": 1907.54,
    "6": 1943.77,
    "7": 2008.22,
    "8": 2134.86,
    "9": 2335.64,
    "10": 2611.78,
    "11": 2972.05,
    "12": 3360.78,
  })) {
    it(`level ${level} evaluates the sourced monthly minimum`, () => {
      setLevel(level);
      assert.equal(minimum(), expected);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setLevel("8");
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . niveau`]: "'8'",
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(minimum(), 1067.43);
  });

  it("marks an unknown level outside the grid", () => {
    setLevel("13");
    assert.equal(minimum(), 0);

  });

  it("is isolated from another convention", () => {
    setLevel("8");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });

  it("does not redefine payroll-wide endpoints or collide with modele-social", () => {
    assert.equal(Object.keys(extension).some((name) => name.includes("cotisations") || name.includes("prévoyance") || name.includes("santé") || name.includes("formation professionnelle") || name.includes("exonération cotisation AT")), false);
    assert.equal(Object.keys(extension).some((name) => name in modeleSocial), false);
  });
});
