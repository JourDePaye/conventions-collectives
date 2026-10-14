import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "opérateurs voyages et guides";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS["3245-operateurs-voyages-guides"]?.find((entry) => entry.version === "2025.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(group: string, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . groupe`]: `'${group}'`,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 3245 — opérateurs de voyages et guides 2025.1", () => {
  it("uses the official effective date and source", () => {
    assert.equal(version.validFrom, "2025-01-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000051447495")));
    assert.ok(version.sources.some((source) => source.includes("Bulletin officiel des conventions collectives 2025/08")));
  });

  it("evaluates the seven monthly salary minima", () => {
    setSituation("A");
    assert.equal(minimum(), 1819.82);
    setSituation("G");
    assert.equal(minimum(), 3075.5);
  });

  it("prorates the minimum once", () => {
    setSituation("E", "50%");
    assert.equal(minimum(), 1081.04);
  });

  it("detects an unknown group and leaves another agreement untouched", () => {
    setSituation("H");
    assert.equal(engine.evaluate(`${namespace} . groupe hors grille`).nodeValue, true);
    assert.equal(minimum(), 0);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
