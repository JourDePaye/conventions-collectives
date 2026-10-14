import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "ports de plaisance";
const namespace = `salarié . convention collective . ${value}`;

async function makeEngine() {
  const version = COMPILED_VERSIONS["1182-ports-plaisance"]?.find((v) => v.version === "2025.1");
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

describe("IDCC 1182 ports de plaisance", () => {
  it("calculates the sourced point minimum and prorates it", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . coefficient`]: 225,
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(engine.evaluate(`${namespace} . valeur du point`).nodeValue, 11.88);
    assert.equal(engine.evaluate(`${namespace} . grille mensuelle`).nodeValue, 2673);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1336.5);
  });

  it("exposes the official 60/40 health and protection split without inventing a total rate", async () => {
    const engine = await makeEngine();
    engine.setSituation({ "salarié . convention collective": `'${value}'` });
    assert.equal(engine.evaluate(`${namespace} . cotisation prévoyance part patronale`).nodeValue, 60);
    assert.equal(engine.evaluate(`${namespace} . cotisation prévoyance part salariale`).nodeValue, 40);

    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, false);
  });

  it("rejects unsupported coefficients and stays isolated from other agreements", async () => {
    const engine = await makeEngine();
    engine.setSituation({ "salarié . convention collective": `'${value}'`, [`${namespace} . coefficient`]: 700 });
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 8316);
    assert.equal(Object.keys(engine.getParsedRules()).some((name) => name.includes("ports de plaisance . cotisation")), true);
  });
});
