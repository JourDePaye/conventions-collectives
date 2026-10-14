import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

describe("établissements de soins vétérinaires (IDCC 3256)", () => {
  it("calcule le minimum mensuel avec la valeur du point 2026", async () => {
    const version = COMPILED_VERSIONS["3256-etablissements-soins-veterinaires"]?.find((v) => v.version === "2026.1");
    assert.ok(version);
    const namespace = "salarié . convention collective . établissements de soins vétérinaires";
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial, ...extension };
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = {
      ...choice,
      "une possibilité": [...new Set([...choice["une possibilité"], "établissements de soins vétérinaires"])],
    } as Rule;
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'établissements de soins vétérinaires'",
      [`${namespace} . coefficient`]: 120,
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2155.2);
  });

  it("prorate le minimum mensuel une seule fois", async () => {
    const version = COMPILED_VERSIONS["3256-etablissements-soins-veterinaires"]?.find((v) => v.version === "2026.1");
    assert.ok(version);
    const namespace = "salarié . convention collective . établissements de soins vétérinaires";
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial, ...extension };
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = { ...choice, "une possibilité": [...new Set([...choice["une possibilité"], "établissements de soins vétérinaires"])] } as Rule;
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'établissements de soins vétérinaires'",
      [`${namespace} . coefficient`]: 120,
      "salarié . contrat . statut cadre": "non",
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1077.6);
  });

  it("ne extrapole pas un coefficient absent de la grille", async () => {
    const version = COMPILED_VERSIONS["3256-etablissements-soins-veterinaires"]?.find((v) => v.version === "2026.1");
    assert.ok(version);
    const namespace = "salarié . convention collective . établissements de soins vétérinaires";
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial, ...extension };
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = { ...choice, "une possibilité": [...new Set([...choice["une possibilité"], "établissements de soins vétérinaires"])] } as Rule;
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'établissements de soins vétérinaires'",
      [`${namespace} . coefficient`]: 121,
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
  });
});
