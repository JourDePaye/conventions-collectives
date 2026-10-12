import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1512-promotion-immobiliere";
const value = "promotion immobilière";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.2");
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

function setSituation(options: { salary?: string; cadre?: string } = {}) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(options.salary === undefined ? {} : { "salarié . contrat . salaire brut": options.salary }),
    ...(options.cadre === undefined ? {} : { "salarié . contrat . statut cadre": options.cadre }),
  });
}

describe("IDCC 1512 — 2026.2 payroll audit", () => {
  it("keeps the salary version and effective date", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.equal(version.sources.some((source) => source.includes("Accord du 23 novembre 2023")), true);
    assert.equal(version.sources.some((source) => source.includes("Avenant n° 38")), true);
  });

  it("calculates health at 2.60% of PMSS split equally", () => {
    setSituation();
    assert.equal(engine.evaluate(`${namespace} . santé . employeur`).nodeValue, 52.065);
    assert.equal(engine.evaluate(`${namespace} . santé . salarié`).nodeValue, 52.065);
  });

  it("calculates non-cadre provident contributions through four PMSS", () => {
    setSituation({ salary: "5000 €/mois", cadre: "non" });
    assert.equal(engine.evaluate(`${namespace} . prévoyance . employeur`).nodeValue, 36.93275);
    assert.equal(engine.evaluate(`${namespace} . prévoyance . salarié`).nodeValue, 36.93275);
    setSituation({ salary: "20000 €/mois", cadre: "non" });
    assert.equal(engine.evaluate(`${namespace} . prévoyance . employeur`).nodeValue, 148.78575);
  });

  it("uses the cadre T1/T2 split", () => {
    setSituation({ salary: "5000 €/mois", cadre: "oui" });
    assert.equal(engine.evaluate(`${namespace} . prévoyance . employeur`).nodeValue, 70.17425);
    assert.equal(engine.evaluate(`${namespace} . prévoyance . salarié`).nodeValue, 10.09925);
  });

  it("replaces standard health and conventionnelle endpoints only for IDCC 1512", () => {
    setSituation({ salary: "5000 €/mois", cadre: "non" });
    const health = engine.evaluate(`${namespace} . santé . employeur`).nodeValue;
    const provident = engine.evaluate(`${namespace} . prévoyance . employeur`).nodeValue;
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate("salarié . cotisations . prévoyances . santé . employeur").nodeValue, 20);
    assert.equal(engine.evaluate("salarié . cotisations . prévoyances . conventionnelle . employeur").nodeValue, null);
    assert.equal(health, 52.065);
    assert.equal(provident, 36.93275);
  });
});
