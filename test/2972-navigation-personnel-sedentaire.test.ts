import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

describe("IDCC 2972 personnel sédentaire des entreprises de navigation", () => {
  it("evaluates the 2026 annual minimum and prorates it", async () => {
    const version = COMPILED_VERSIONS["2972-navigation-personnel-sedentaire"]?.find((v) => v.version === "2026.1");
    assert.ok(version);
    const rules: Record<string, Rule> = { ...modeleSocial, ...(await version.loadRules()) };
    const namespace = "salarié . convention collective . personnel sédentaire entreprises navigation";
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'personnel sédentaire entreprises navigation'",
      [`${namespace} . niveau`]: "'I'",
      "salarié . contrat . statut cadre": "non",
      "salarié . contrat . temps de travail . quotité": "80 %",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, 18083.44);
  });

  it("returns zero for an unknown level", async () => {
    const version = COMPILED_VERSIONS["2972-navigation-personnel-sedentaire"]?.find((v) => v.version === "2026.1");
    assert.ok(version);
    const rules: Record<string, Rule> = { ...modeleSocial, ...(await version.loadRules()) };
    const namespace = "salarié . convention collective . personnel sédentaire entreprises navigation";
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'personnel sédentaire entreprises navigation'",
      [`${namespace} . niveau`]: "'X'",
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, 0);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
  });
});
