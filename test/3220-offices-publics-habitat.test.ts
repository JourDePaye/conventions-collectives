import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

describe("IDCC 3220 — offices publics et coopératifs de l'habitat social", () => {
  it("evaluates the sourced 2026 national minimums and keeps the namespace isolated", async () => {
    const version = COMPILED_VERSIONS["3220-offices-publics-habitat"]?.find((v) => v.version === "2026.1");
    assert.ok(version);
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial };
    const namespace = "salarié . convention collective . offices publics habitat";
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
      assert.ok(!(name in rules), `Duplicate modele-social rule: ${name}`);
    }
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = {
      ...choice,
      "une possibilité": [...new Set([...choice["une possibilité"], "offices publics habitat"])],
    } as Rule;
    Object.assign(rules, extension);
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'offices publics habitat'",
      [`${namespace} . classe`]: 13,
      "salarié . contrat . statut cadre": "oui",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 5359.23);
    engine.setSituation({
      "salarié . convention collective": "'offices publics habitat'",
      [`${namespace} . classe`]: 1,
      "salarié . contrat . statut cadre": "non",
      "salarié . contrat . temps de travail . quotité": "50 %",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 912.61);
    engine.setSituation({
      "salarié . convention collective": "'offices publics habitat'",
      [`${namespace} . classe`]: 14,
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(engine.evaluate(`${namespace} . classe hors grille`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, false);
  });
});
