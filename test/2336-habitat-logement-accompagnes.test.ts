import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

describe("IDCC 2336 habitat et logement accompagnés", () => {
  it("evaluates the sourced PACT ARIM minimum and prorates it", async () => {
    const version = COMPILED_VERSIONS["2336-habitat-logement-accompagnes"]?.find((v) => v.version === "2025.1");
    assert.ok(version);
    const rules: Record<string, Rule> = { ...modeleSocial, ...(await version.loadRules()) };
    const namespace = "salarié . convention collective . habitat logement accompagnés";
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'habitat logement accompagnés'",
      [`${namespace} . coefficient`]: 500,
      [`${namespace} . temps payé`]: "'35 heures'",
      "salarié . contrat . statut cadre": "non",
      "salarié . contrat . temps de travail . quotité": "80 %",
    });
    assert.equal(Math.round((engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue as number) * 100) / 100, 1500.19);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
  });

  it("supports the 39-hour paid schedule and remains isolated", async () => {
    const version = COMPILED_VERSIONS["2336-habitat-logement-accompagnes"]?.find((v) => v.version === "2025.1");
    assert.ok(version);
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial, ...(await version.loadRules()) };
    const namespace = "salarié . convention collective . habitat logement accompagnés";
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
    }
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'habitat logement accompagnés'",
      [`${namespace} . coefficient`]: 500,
      [`${namespace} . temps payé`]: "'39 heures'",
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2081.56);
  });
});
