import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

describe("IDCC 1922 radiodiffusion", () => {
  it("calculates the published point formula and prorates it", async () => {
    const version = COMPILED_VERSIONS["1922-radiodiffusion"]?.find((v) => v.version === "2025.1");
    assert.ok(version);
    const rules: Record<string, Rule> = { ...modeleSocial, ...(await version.loadRules()) };
    const namespace = "salarié . convention collective . radiodiffusion";
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'radiodiffusion'",
      [`${namespace} . indice`]: 200,
      "salarié . contrat . statut cadre": "non",
      "salarié . contrat . temps de travail . quotité": "80 %",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2105.6);
    assert.equal(engine.evaluate(`${namespace} . prévoyance non cadre`).nodeValue, 0.88);
    assert.equal(engine.evaluate(`${namespace} . prévoyance non cadre . part employeur`).nodeValue, 0.44);
    assert.equal(engine.evaluate(`${namespace} . santé . part employeur`).nodeValue, 50);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
  });

  it("exposes the cadre obligation and blocks indices below the formula range", async () => {
    const version = COMPILED_VERSIONS["1922-radiodiffusion"]?.find((v) => v.version === "2025.1");
    assert.ok(version);
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial, ...extension };
    const namespace = "salarié . convention collective . radiodiffusion";
    for (const name of Object.keys(extension)) assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'radiodiffusion'",
      [`${namespace} . indice`]: 119,
    });
    assert.equal(engine.evaluate(`${namespace} . indice hors grille`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . prévoyance cadre`).nodeValue, 1.5);
  });
});
