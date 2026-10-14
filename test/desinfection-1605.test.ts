import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1605-desinfection-desinsectisation-deratisation";
const value = "désinfection désinsectisation dératisation";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === "2026.1");
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

describe("IDCC 1605 — 2026.1 salary minimums and payroll audit", () => {
  it("uses the official extension publication date", () => {
    assert.equal(version.validFrom, "2026-03-18");
    assert.ok(version.sources.some((source: string) => source.includes("KALITEXT000054040312")));
    assert.ok(version.sources.some((source: string) => source.includes("JORFTEXT000053685524")));
  });

  for (const [level, expected] of Object.entries({
    1: 1837.13,
    2: 1892.13,
    3: 1947.13,
    4: 2002.13,
  })) {
    it(`level ${level} evaluates the sourced monthly minimum`, () => {
      setLevel(Number(level));
      assert.equal(minimum(), expected);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setLevel(4, "50%");
    assert.equal(minimum(), 1001.065);
  });

  it("marks groups 2 and 3 outside the bounded grid", () => {
    setLevel(8);
    assert.equal(minimum(), 0);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
  });

  it("is isolated from another convention", () => {
    setLevel(1);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });

  it("does not redefine payroll-wide endpoints or collide with modele-social", () => {
    setLevel(1);
    assert.equal(Object.keys(extension).some((name) => name.includes("cotisations") || name.includes("prévoyance") || name.includes("santé") || name.includes("formation professionnelle") || name.includes("exonération cotisation AT")), false);
    assert.equal(Object.keys(extension).some((name) => name in modeleSocial), false);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
  });
});
