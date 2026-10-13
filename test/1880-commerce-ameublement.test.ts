import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

describe("IDCC 1880 — commerce de l'ameublement", () => {
  it("evaluates the sourced level 5 minimum and prorates it", async () => {
    const version = COMPILED_VERSIONS["1880-commerce-ameublement"]?.find((v) => v.version === "2026.1");
    assert.ok(version);
    const extension = await version.loadRules();
    const rules = { ...modeleSocial, ...extension };
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'commerce de l'ameublement'",
      "salarié . convention collective . commerce de l'ameublement . niveau": "'5'",
      "salarié . contrat . statut cadre": "non",
      "salarié . contrat . temps de travail . quotité": "50%",
    } as any);
    assert.equal(engine.evaluate("salarié . convention collective . commerce de l'ameublement . salaire minimum conventionnel").nodeValue, 935.5);
  });

  it("marks an unknown classification outside the modeled grid", async () => {
    const version = COMPILED_VERSIONS["1880-commerce-ameublement"]?.find((v) => v.version === "2026.1");
    assert.ok(version);
    const extension = await version.loadRules();
    const rules = { ...modeleSocial, ...extension };
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'commerce de l'ameublement'",
      "salarié . convention collective . commerce de l'ameublement . niveau": "'cadre'",
      "salarié . contrat . statut cadre": "non",
    } as any);
    assert.equal(engine.evaluate("salarié . convention collective . commerce de l'ameublement . niveau hors grille").nodeValue, true);
  });
});
