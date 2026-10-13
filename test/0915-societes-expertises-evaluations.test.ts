import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

describe("IDCC 915 — sociétés d'expertises et d'évaluations", () => {
  async function engineFor(level: string, quotient = "100%") {
    const version = COMPILED_VERSIONS["0915-societes-expertises-evaluations"]?.find((v) => v.version === "2026.1");
    assert.ok(version);
    const extension = await version.loadRules();
    const engine = new Engine({ ...modeleSocial, ...extension }, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'sociétés d'expertises et d'évaluations'",
      "salarié . convention collective . sociétés d'expertises et d'évaluations . niveau": `'${level}'`,
      "salarié . contrat . statut cadre": "non",
      "salarié . contrat . temps de travail . quotité": quotient,
    } as any);
    return engine;
  }

  it("evaluates the sourced N 5 annual minimum and prorates it", async () => {
    const engine = await engineFor("N 5", "50%");
    assert.equal(engine.evaluate("salarié . convention collective . sociétés d'expertises et d'évaluations . salaire minimum annuel conventionnel").nodeValue, 13519.5);
  });

  it("marks a classification outside the modeled grid", async () => {
    const engine = await engineFor("N 11");
    assert.equal(engine.evaluate("salarié . convention collective . sociétés d'expertises et d'évaluations . niveau hors grille").nodeValue, true);
    assert.equal(engine.evaluate("salarié . convention collective . sociétés d'expertises et d'évaluations . salaire minimum annuel conventionnel").nodeValue, 0);
  });
});
