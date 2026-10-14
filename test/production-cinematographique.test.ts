import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "production cinématographique";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS["3097-production-cinematographique"]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(level: number, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: level,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}
function amount() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 3097 — production cinématographique 2026.1", () => {
  it("has the extension date and official references", () => {
    assert.equal(version.validFrom, "2026-02-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000053497544")));
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000051295352")));
  });
  it("evaluates sourced minima", () => {
    setSituation(2);
    assert.equal(amount(), 3029.73);
    setSituation(6);
    assert.equal(amount(), 1855.85);
  });
  it("prorates once", () => {
    setSituation(4, "50%");
    assert.equal(amount(), 1056.77);
  });
  it("blocks levels outside the sourced grid and isolates another agreement", () => {
    setSituation(1);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
    assert.equal(amount(), 0);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
  it("exposes the complete payroll audit boundary", () => {
    setSituation(3);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
  });
});
