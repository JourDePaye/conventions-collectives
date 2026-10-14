import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

describe("IDCC 3228 — personnel navigant du GASPE", () => {
  it("evaluates the sourced 2022 minima and keeps the namespace isolated", async () => {
    const version = COMPILED_VERSIONS["3228-groupement-armateurs-passages-eau"]?.find((v) => v.version === "2022.1");
    assert.ok(version);
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial };
    const namespace = "salarié . convention collective . groupement armateurs passages eau";
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
      assert.ok(!(name in rules), `Duplicate modele-social rule: ${name}`);
    }
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = {
      ...choice,
      "une possibilité": [...new Set([...choice["une possibilité"], "groupement armateurs passages eau"])],
    } as Rule;
    Object.assign(rules, extension);
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'groupement armateurs passages eau'",
      [`${namespace} . fonction`]: "'capitaines et chefs mécaniciens 15e catégorie ENIM'",
      "salarié . contrat . statut cadre": "oui",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2675.39);
    engine.setSituation({
      "salarié . convention collective": "'groupement armateurs passages eau'",
      [`${namespace} . fonction`]: "'matelots matelots légers'",
      "salarié . contrat . statut cadre": "non",
      "salarié . contrat . temps de travail . quotité": "50 %",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 803.005);
    engine.setSituation({
      "salarié . convention collective": "'groupement armateurs passages eau'",
      [`${namespace} . fonction`]: "'inconnu'",
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(engine.evaluate(`${namespace} . fonction hors grille`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, false);
  });
});
