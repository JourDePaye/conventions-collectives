import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1353-metallurgie-bourgogne";
const value = "métallurgie bourgogne";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === "2022.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setCoefficient(coefficient: number, quotity = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . coefficient ouvrier`]: coefficient,
    "salarié . contrat . temps de travail . quotité": quotity,
  });
}

function minimum() {
  return engine.evaluate(`${namespace} . rémunération minimale hiérarchique`).nodeValue;
}

describe("IDCC 1353 — 2022.1 rémunérations minimales et audit paie", () => {
  it("uses the official source and effective date", () => {
    assert.equal(version.validFrom, "2022-06-01");
    assert.ok(version.sources.some((source: string) => source.includes("KALITEXT000046394511")));
  });

  for (const [coefficient, expected] of Object.entries({ 140: 702, 170: 852, 240: 1203, 305: 1455, 395: 1885 })) {
    it(`coefficient ${coefficient} evaluates the sourced monthly minimum`, () => {
      setCoefficient(Number(coefficient));
      assert.equal(minimum(), expected);
    });
  }

  it("prorates the minimum for part-time work", () => {
    setCoefficient(395, "50%");
    assert.equal(minimum(), 942.5);
  });

  it("marks coefficients outside the bounded grid and isolates the model", () => {
    setCoefficient(180);
    assert.equal(minimum(), 0);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . rémunération minimale hiérarchique`).nodeValue, null);
    assert.equal(Object.keys(extension).some((name) => name in modeleSocial), false);
  });

  it("exposes the explicit payroll audit", () => {
    setCoefficient(140);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
  });
});
