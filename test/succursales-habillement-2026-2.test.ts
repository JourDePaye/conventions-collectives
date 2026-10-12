import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0675-succursales-habillement";
const value = "succursales habillement";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.2");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);

function engineFor(level: string, seniority: string, forfait: string) {
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: `'${level}'`,
    "salarié . ancienneté": seniority,
    [`${namespace} . forfait jours`]: forfait,
  });
  return engine;
}

function amount(engine: Engine, rule: string) {
  const result = engine.evaluate(`${namespace} . ${rule}`).nodeValue;
  assert.equal(typeof result, "number", rule);
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 675 — 2026.2 payroll rules", () => {
  it("cites the agreement and extension and applies the seniority premium", () => {
    assert.equal(version.validFrom, "2026-05-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 16 avril 2026")));
    assert.ok(version.sources.some((source) => source.includes("TRST2616915A")));
    const engine = engineFor("E4", "6 an", "non");
    assert.equal(amount(engine, "prime d'ancienneté"), 114);
    assert.equal(amount(engine, "salaire minimum avec prime d'ancienneté"), 2014);
    assert.equal(engine.evaluate("salarié . rémunération . primes . ancienneté").nodeValue, 114);
  });

  it("applies the 15% cadre forfait-jours annual minimum", () => {
    const engine = engineFor("C2", "0 an", "oui");
    assert.equal(amount(engine, "salaire minimum annuel forfait jours"), 35620.2);
  });

  it("keeps the new payroll rules isolated outside IDCC 675", () => {
    const engine = engineFor("E4", "6 an", "non");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . prime d'ancienneté`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel forfait jours`).nodeValue, null);
  });
});
