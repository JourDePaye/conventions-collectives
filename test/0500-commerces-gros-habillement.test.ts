import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

describe("IDCC 500 — commerces de gros de l'habillement", () => {
  async function engineFor(classification: string, quotient = "100%") {
    const version = COMPILED_VERSIONS["0500-commerces-gros-habillement"]?.find((v) => v.version === "2024.1");
    assert.ok(version);
    const extension = await version.loadRules();
    const engine = new Engine({ ...modeleSocial, ...extension }, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'commerces de gros habillement'",
      "salarié . convention collective . commerces de gros habillement . classification": `'${classification}'`,
      "salarié . contrat . statut cadre": "non",
      "salarié . contrat . temps de travail . quotité": quotient,
    } as any);
    return engine;
  }

  it("evaluates the sourced employee minimum and prorates it", async () => {
    const engine = await engineFor("employés IV B", "50%");
    assert.equal(engine.evaluate("salarié . convention collective . commerces de gros habillement . salaire minimum conventionnel").nodeValue, 950);
  });

  it("evaluates a management classification", async () => {
    const engine = await engineFor("agents de maîtrise VI C");
    assert.equal(engine.evaluate("salarié . convention collective . commerces de gros habillement . salaire minimum conventionnel").nodeValue, 2278);
  });

  it("marks an unknown classification outside the modeled grid", async () => {
    const engine = await engineFor("employés IX Z");
    assert.equal(engine.evaluate("salarié . convention collective . commerces de gros habillement . classification hors grille").nodeValue, true);
    assert.equal(engine.evaluate("salarié . convention collective . commerces de gros habillement . salaire minimum conventionnel").nodeValue, 0);
  });
});
