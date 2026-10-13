import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "entreprises d'architecture";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS["2332-entreprises-architecture"]?.find((entry) => entry.version === "2025.1");
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

function setSituation(coefficient: number, zone: string, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . coefficient`]: coefficient,
    [`${namespace} . zone`]: `'${zone}'`,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function amount() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 2332 — entreprises d'architecture 2025.1", () => {
  it("is in force from the regional agreement date and cites the official source", () => {
    assert.equal(version.validFrom, "2025-02-11");
    assert.ok(version.sources.some((source) => source.includes("KALIARTI000051580416")));
  });

  it("applies the zone 1 point value and floor", () => {
    setSituation(200, "zone 1");
    assert.equal(amount(), 1945);
    setSituation(300, "zone 1");
    assert.equal(amount(), 2739);
  });

  it("applies the zone 2 point value and floor", () => {
    setSituation(200, "zone 2");
    assert.equal(amount(), 1892);
    setSituation(300, "zone 2");
    assert.equal(amount(), 2706);
  });

  it("prorates the convention minimum once", () => {
    setSituation(300, "zone 1", "50%");
    assert.equal(amount(), 1369.5);
  });

  it("reports an unknown zone and leaves another agreement untouched", () => {
    setSituation(300, "national");
    assert.equal(engine.evaluate(`${namespace} . zone hors accord`).nodeValue, true);
    assert.equal(amount(), 0);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
