import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3238-production-transformation-papiers-cartons";
const value = "production transformation papiers cartons";
const namespace = `salarié . convention collective . ${value}`;

async function engineFor(situation: Record<string, string>) {
  const version = COMPILED_VERSIONS[agreement]?.find((candidate) => candidate.version === "2026.2");
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...new Set([...choice["une possibilité"], value])],
  } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    "salarié . contrat . statut cadre": "non",
    ...situation,
  });
  return engine;
}

describe("IDCC 3238 — production et transformation des papiers et cartons", () => {
  it("returns the 2026 OETAM minimum for coefficient 185", async () => {
    const engine = await engineFor({ [`${namespace} . coefficient`]: "185" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1985);
  });

  it("prorates the OETAM minimum for part-time work", async () => {
    const engine = await engineFor({
      [`${namespace} . coefficient`]: "260",
      "salarié . contrat . temps de travail . quotité": "50 %",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1255);
  });

  it("returns zero and marks an unknown coefficient out of grid", async () => {
    const engine = await engineFor({ [`${namespace} . coefficient`]: "999" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
  });

  it("exposes the 2026 OETAM annual guarantee without converting it to monthly", async () => {
    const engine = await engineFor({ [`${namespace} . coefficient`]: "185" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, 22779);
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . coefficient`]: "185",
      "salarié . contrat . temps de travail . quotité": "50 %",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, 11389.5);
  });
});
