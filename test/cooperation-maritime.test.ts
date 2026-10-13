import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2494-cooperation-maritime";
const value = "coopération maritime";
const namespace = `salarié . convention collective . ${value}`;

async function engineOf() {
  const version = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === "2026.1");
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  return { version, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
}

function setSituation(engine: Engine, classification: string, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau et échelon`]: `'${classification}'`,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum(engine: Engine): number {
  const result = engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return result as number;
}

describe("IDCC 2494 — coopération maritime salary minima", async () => {
  const { version, engine } = await engineOf();

  it("is effective on 1 July 2026 after extension of the 31 March 2026 agreement", () => {
    assert.equal(version.validFrom, "2026-07-01");
    assert.ok(version.sources.some((source: string) => source.includes("31 mars 2026")));
    assert.ok(version.sources.some((source: string) => source.includes("11 juin 2026")));
  });

  it("returns the sourced annual minimum for level 3 step 2", () => {
    setSituation(engine, "3.2");
    assert.equal(minimum(engine), 26273);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, false);
  });

  it("prorates the annual minimum once for part-time work", () => {
    setSituation(engine, "5", "50%");
    assert.equal(minimum(engine), 16352);
  });

  it("handles the cadre seniority branches explicitly", () => {
    setSituation(engine, "6.A");
    assert.equal(minimum(engine), 34358);
    setSituation(engine, "6.B");
    assert.equal(minimum(engine), 38275);
  });

  it("returns zero and flags an unknown classification", () => {
    setSituation(engine, "3.4");
    assert.equal(minimum(engine), 0);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
  });

  it("is inapplicable to another collective agreement", () => {
    setSituation(engine, "3.2");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, null);
  });
});
