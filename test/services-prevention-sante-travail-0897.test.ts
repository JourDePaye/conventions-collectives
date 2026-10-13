import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0897-services-prevention-sante-travail-interentreprises";
const value = "services prévention santé travail interentreprises";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setClass(classe: string, quotite = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . classe`]: `'${classe}'`,
    "salarié . contrat . temps de travail . quotité": quotite,
  });
}

function minimum() {
  return engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue;
}

describe("IDCC 897 — 2026.1 annual minimums and payroll audit", () => {
  it("uses the official 1 January 2026 effective date and legal references", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000054303796")));
    assert.ok(version.sources.some((source) => source.includes("KALIARTI000054303800")));
  });

  for (const [classe, expected] of Object.entries({
    A: 24378,
    B: 24866,
    C: 26125,
    D: 27227,
    E: 29223,
    F: 30275,
    G: 32493,
    H: 34875,
    I: 36131,
    J: 38778,
    K: 41626,
    L: 73693,
    M: 86449,
  })) {
    it(`class ${classe} evaluates the sourced annual minimum`, () => {
      setClass(classe);
      assert.equal(minimum(), expected);
    });
  }

  it("prorates the annual minimum once for part-time work", () => {
    setClass("G", "50%");
    assert.equal(minimum(), 16246.5);
  });

  it("marks an unknown class outside the grid", () => {
    setClass("N");
    assert.equal(minimum(), 0);
  });

  it("is isolated from another convention", () => {
    setClass("G");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, null);
  });

  it("does not redefine payroll-wide endpoints or collide with modele-social", () => {
    assert.equal(Object.keys(extension).some((name) => name.endsWith(" . cotisations") || name.endsWith(" . prévoyance") || name.endsWith(" . santé") || name.endsWith(" . formation professionnelle") || name.endsWith(" . exonération cotisation AT")), false);
    assert.equal(Object.keys(extension).some((name) => name in modeleSocial), false);
  });
});
