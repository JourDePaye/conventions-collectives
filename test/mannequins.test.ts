import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "mannequins";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS["3252-mannequins"]?.find((entry) => entry.version === "2025.1");
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

function setSituation(category: number, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . catégorie`]: category,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function amount() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 3252 — mannequins 2025.1", () => {
  it("is in force from the agreement date and cites the official text", () => {
    assert.equal(version.validFrom, "2025-07-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000051982866")));
    assert.ok(version.sources.some((source) => source.includes("KALICONT000044594539")));
  });

  it("evaluates the four adult weekly minima", () => {
    setSituation(1);
    assert.equal(amount(), 622.6);
    setSituation(4);
    assert.equal(amount(), 764.13);
  });

  it("prorates the weekly minimum once", () => {
    setSituation(3, "50%");
    assert.equal(amount(), 358.09);
  });

  it("reports an unknown category and leaves another agreement untouched", () => {
    setSituation(5);
    assert.equal(engine.evaluate(`${namespace} . catégorie hors grille`).nodeValue, true);
    assert.equal(amount(), 0);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });

  it("exposes the payroll audit boundary", () => {
    setSituation(2);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
  });
});
