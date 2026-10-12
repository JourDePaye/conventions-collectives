import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1631-hotellerie-plein-air";
const value = "hôtellerie de plein air";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === "2024.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setCoefficient(coefficient: number, quotité = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . coefficient`]: coefficient,
    "salarié . contrat . temps de travail . quotité": quotité,
  });
}

function minimum() {
  return engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
}

describe("IDCC 1631 — 2024.1 salary minimums and payroll audit", () => {
  it("uses the current official extended salary agreement", () => {
    assert.equal(version.validFrom, "2024-11-01");
    assert.ok(version.sources.some((source: string) => source.includes("KALIARTI000051149881")));
  });

  for (const [coefficient, expected] of Object.entries({
    285: 2112.73,
    300: 2203.92,
    325: 2595.82,
    349: 2773.96,
    420: 3581.52,
  })) {
    it(`coefficient ${coefficient} evaluates the sourced monthly minimum`, () => {
      setCoefficient(Number(coefficient));
      assert.equal(minimum(), expected);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setCoefficient(300, "50%");
    assert.equal(minimum(), 1101.96);
  });

  it("marks an unknown coefficient outside the grid", () => {
    setCoefficient(301);
    assert.equal(minimum(), null);
  });

  it("is isolated from another convention", () => {
    setCoefficient(300);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });

  it("does not redefine payroll-wide endpoints or collide with modele-social", () => {
    assert.equal(Object.keys(extension).some((name) => name.includes("cotisations") || name.includes("prévoyance") || name.includes("santé") || name.includes("formation professionnelle") || name.includes("exonération cotisation AT")), false);
    assert.equal(Object.keys(extension).some((name) => name in modeleSocial), false);
  });
});
