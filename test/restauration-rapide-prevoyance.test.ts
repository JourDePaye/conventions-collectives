import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1501-restauration-rapide";
const value = "restauration rapide";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = {
  ...choice,
  "une possibilité": [...choice["une possibilité"], value],
} as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(salary: number, convention = value) {
  engine.setSituation({
    "salarié . convention collective": `'${convention}'`,
    "salarié . contrat . salaire brut": `${salary} €/mois`,
  });
}

describe("IDCC 1501 — 2026.1 prévoyance", () => {
  it("uses the 0.50% branch rate split equally on T1 and T2", () => {
    setSituation(2000);
    assert.equal(engine.evaluate(`${namespace} . prévoyance . employeur`).nodeValue, 5);
    assert.equal(engine.evaluate(`${namespace} . prévoyance . salarié`).nodeValue, 5);
    assert.equal(engine.evaluate(`${namespace} . prévoyance`).nodeValue, 10);
  });

  it("caps both shares at four monthly social-security ceilings", () => {
    setSituation(20000);
    assert.ok(Math.abs((engine.evaluate(`${namespace} . prévoyance . employeur`).nodeValue as number) - 40.05) < 1e-12);
    assert.ok(Math.abs((engine.evaluate(`${namespace} . prévoyance . salarié`).nodeValue as number) - 40.05) < 1e-12);
  });

  it("replaces the standard conventionnelle endpoints only for IDCC 1501", () => {
    setSituation(2000);
    const branchEmployer = engine.evaluate(`${namespace} . prévoyance . employeur`).nodeValue;
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate("salarié . cotisations . prévoyances . conventionnelle . employeur").nodeValue, null);
    assert.equal(branchEmployer, 5);
  });
});
