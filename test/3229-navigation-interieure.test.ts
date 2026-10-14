import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

describe("IDCC 3229 — navigation intérieure", () => {
  it("evaluates the sourced matelot minima, prorates, rejects other classifications, and stays isolated", async () => {
    const version = COMPILED_VERSIONS["3229-navigation-interieure"]?.find((v) => v.version === "2026.1");
    assert.ok(version);
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial };
    const namespace = "salarié . convention collective . navigation intérieure";
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
      assert.ok(!(name in rules), `Duplicate modele-social rule: ${name}`);
    }
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = {
      ...choice,
      "une possibilité": [...new Set([...choice["une possibilité"], "navigation intérieure"])],
    } as Rule;
    Object.assign(rules, extension);
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'navigation intérieure'",
      [`${namespace} . classification`]: "'matelot — 3 à 6 ans'",
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, 23576);
    engine.setSituation({
      "salarié . convention collective": "'navigation intérieure'",
      [`${namespace} . classification`]: "'matelot — 12 à 15 ans'",
      "salarié . contrat . statut cadre": "non",
      "salarié . contrat . temps de travail . quotité": "50 %",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, 12818);
    engine.setSituation({
      "salarié . convention collective": "'navigation intérieure'",
      [`${namespace} . classification`]: "'capitaine'",
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(engine.evaluate(`${namespace} . classification hors grille`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, 0);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, false);
  });
});
