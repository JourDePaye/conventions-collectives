import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

describe("IDCC 2002 — blanchisserie teinturerie", () => {
  it("evaluates the sourced 2026 grid and isolates the namespace", async () => {
    const version = COMPILED_VERSIONS["2002-blanchisserie-teinturerie"]?.find((v) => v.version === "2026.1");
    assert.ok(version);
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial };
    const namespace = "salarié . convention collective . blanchisserie teinturerie";
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
      assert.ok(!(name in rules), `Duplicate modele-social rule: ${name}`);
    }
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = { ...choice, "une possibilité": [...new Set([...choice["une possibilité"], "blanchisserie teinturerie"])] } as Rule;
    Object.assign(rules, extension);
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'blanchisserie teinturerie'",
      [`${namespace} . niveau`]: "'I-1'",
      "salarié . contrat . temps de travail . quotité": "50 %",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum horaire`).nodeValue, 12.02);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 911.5366999999999);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
    engine.setSituation({
      "salarié . convention collective": "'blanchisserie teinturerie'",
      [`${namespace} . niveau`]: "'X'",
    });
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0);
  });
});
