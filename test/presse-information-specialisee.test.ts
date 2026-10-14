import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "presse information spécialisée";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS["3230-presse-information-specialisee"]?.find((entry) => entry.version === "2024.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(level: number, seniority = "0 an", quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: level,
    [`${namespace} . ancienneté dans l'entreprise`]: seniority,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 3230 — presse d'information spécialisée 2024.1", () => {
  it("uses the official effective date and legal sources", () => {
    assert.equal(version.validFrom, "2024-01-01");
    assert.ok(version.sources.some((source) => source.includes("KALIARTI000048975121")));
    assert.ok(version.sources.some((source) => source.includes("KALICONT000038661444")));
  });

  it("evaluates the sourced minimum grid and seniority", () => {
    setSituation(1);
    assert.equal(minimum(), 1800);
    setSituation(1, "9 an");
    assert.equal(minimum(), 1908);
    setSituation(9, "3 an");
    assert.equal(minimum(), 3564);
  });

  it("prorates the minimum once", () => {
    setSituation(5, "6 an", "50%");
    assert.equal(minimum(), 1208);
  });

  it("detects an unknown level and leaves another agreement untouched", () => {
    setSituation(10);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
    assert.equal(minimum(), 0);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
