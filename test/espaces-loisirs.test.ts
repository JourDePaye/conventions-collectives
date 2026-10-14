import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

describe("espaces de loisirs, d'attractions et culturels (IDCC 1790)", () => {
  it("evaluates the sourced minimum and prorates it", async () => {
    const version = COMPILED_VERSIONS["1790-espaces-loisirs"]?.find((v) => v.version === "2026.1");
    assert.ok(version);
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial };
    const namespace = "salarié . convention collective . espaces loisirs";
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
      assert.ok(!(name in rules), `Duplicate modele-social rule: ${name}`);
    }
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "espaces loisirs"] } as Rule;
    Object.assign(rules, extension);
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'espaces loisirs'",
      [`${namespace} . niveau`]: "'IV'",
      [`${namespace} . coefficient`]: 280,
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(engine.evaluate(`${namespace} . rémunération minimale`).nodeValue, 2441.10);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1220.55);
  });

  it("isolates an unknown classification", async () => {
    const version = COMPILED_VERSIONS["1790-espaces-loisirs"]?.find((v) => v.version === "2026.1");
    assert.ok(version);
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial };
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "espaces loisirs"] } as Rule;
    Object.assign(rules, extension);
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'espaces loisirs'",
      "salarié . convention collective . espaces loisirs . niveau": "'IX'",
      "salarié . convention collective . espaces loisirs . coefficient": 999,
    });
    assert.equal(engine.evaluate("salarié . convention collective . espaces loisirs . classification hors grille").nodeValue, true);
    assert.equal(engine.evaluate("salarié . convention collective . espaces loisirs . salaire minimum conventionnel").nodeValue, 0);
  });
});
