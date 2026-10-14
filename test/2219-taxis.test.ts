import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

describe("IDCC 2219 — taxis", () => {
  it("evaluates the sourced minimum, prorates, rejects other classifications, and stays isolated", async () => {
    const version = COMPILED_VERSIONS["2219-taxis"]?.find((v) => v.version === "2025.1");
    assert.ok(version);
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial };
    const namespace = "salarié . convention collective . taxis";
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
      assert.ok(!(name in rules), `Duplicate modele-social rule: ${name}`);
    }
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = {
      ...choice,
      "une possibilité": [...new Set([...choice["une possibilité"], "taxis"])],
    } as Rule;
    Object.assign(rules, extension);
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'taxis'",
      [`${namespace} . classification`]: "'niveau 1 — conducteur débutant — titulaire carte professionnelle'",
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1837.86);
    engine.setSituation({
      "salarié . convention collective": "'taxis'",
      [`${namespace} . classification`]: "'niveau 1 — conducteur débutant — titulaire carte professionnelle'",
      "salarié . contrat . statut cadre": "non",
      "salarié . contrat . temps de travail . quotité": "50 %",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 918.93);
    engine.setSituation({
      "salarié . convention collective": "'taxis'",
      [`${namespace} . classification`]: "'niveau 2'",
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(engine.evaluate(`${namespace} . classification hors grille`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, false);
  });
});
