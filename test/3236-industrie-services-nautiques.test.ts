import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

describe("IDCC 3236 industrie et services nautiques", () => {
  it("evaluates the sourced minimum and prorates it", async () => {
    const version = COMPILED_VERSIONS["3236-industrie-services-nautiques"]?.find((v) => v.version === "2025.1");
    assert.ok(version);
    const rules: Record<string, Rule> = { ...modeleSocial, ...(await version.loadRules()) };
    const namespace = "salarié . convention collective . industrie services nautiques";
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'industrie services nautiques'",
      [`${namespace} . niveau et échelon`]: "'VI.2'",
      "salarié . contrat . statut cadre": "non",
      "salarié . contrat . temps de travail . quotité": "80 %",
    });
    assert.equal(Math.round((engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue as number) * 100) / 100, 1982.30);
  });

  it("returns zero for an unknown level and echelons", async () => {
    const version = COMPILED_VERSIONS["3236-industrie-services-nautiques"]?.find((v) => v.version === "2025.1");
    assert.ok(version);
    const rules: Record<string, Rule> = { ...modeleSocial, ...(await version.loadRules()) };
    const namespace = "salarié . convention collective . industrie services nautiques";
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'industrie services nautiques'",
      [`${namespace} . niveau et échelon`]: "'X.9'",
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0);
    assert.equal(engine.evaluate(`${namespace} . niveau et échelon hors grille`).nodeValue, true);
  });
});
