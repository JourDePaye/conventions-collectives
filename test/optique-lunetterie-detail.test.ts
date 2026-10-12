import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

describe("IDCC 1431 optique-lunetterie de détail", () => {
  it("calculates the 2024 extended agreement grids and work-time prorating", async () => {
    const version = COMPILED_VERSIONS["1431-optique-lunetterie-detail"]?.find((candidate) => candidate.version === "2024.2");
    assert.ok(version);
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial };
    const namespace = "salarié . convention collective . optique-lunetterie de détail";
    rules["salarié . convention collective"] = {
      ...(rules["salarié . convention collective"] as Rule),
      "une possibilité": [...((rules["salarié . convention collective"] as Rule & { "une possibilité": string[] })["une possibilité"]), "optique-lunetterie de détail"],
    } as Rule;
    Object.assign(rules, extension);
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

    engine.setSituation({
      "salarié . convention collective": "'optique-lunetterie de détail'",
      [`${namespace} . classification`]: "'nouvelle'",
      [`${namespace} . coefficient`]: "'K'",
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1850);

    engine.setSituation({
      salarié: "oui",
      dirigeant: "non",
      "salarié . convention collective": "'optique-lunetterie de détail'",
      [`${namespace} . classification`]: "'ancienne'",
      [`${namespace} . coefficient`]: "'380'",
      "salarié . contrat . temps de travail . quotité": "100%",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 3400);

    engine.setSituation({
      salarié: "oui",
      dirigeant: "non",
      "salarié . convention collective": "'optique-lunetterie de détail'",
      [`${namespace} . classification`]: "'ancienne'",
      [`${namespace} . coefficient`]: "'inconnu'",
      "salarié . contrat . temps de travail . quotité": "100%",
    });
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
  });

  it("applies the extended non-cadre pension plan to standard endpoints and leaves cadres unchanged", async () => {
    const version = COMPILED_VERSIONS["1431-optique-lunetterie-detail"]?.find((candidate) => candidate.version === "2024.2");
    assert.ok(version);
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial };
    const namespace = "salarié . convention collective . optique-lunetterie de détail";
    rules["salarié . convention collective"] = {
      ...(rules["salarié . convention collective"] as Rule),
      "une possibilité": [...((rules["salarié . convention collective"] as Rule & { "une possibilité": string[] })["une possibilité"]), "optique-lunetterie de détail"],
    } as Rule;
    Object.assign(rules, extension);
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      salarié: "oui",
      dirigeant: "non",
      "salarié . convention collective": "'optique-lunetterie de détail'",
      [`${namespace} . classification`]: "'nouvelle'",
      [`${namespace} . coefficient`]: "'B'",
      "salarié . contrat . salaire brut": "5000 €/mois",
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(engine.evaluate(`${namespace} . prévoyance . employeur`).nodeValue, 16.8);
    assert.equal(engine.evaluate(`${namespace} . prévoyance . salarié`).nodeValue, 11.2);
    assert.equal(engine.evaluate("salarié . cotisations . prévoyances . conventionnelle . employeur").nodeValue, 16.8);
    assert.equal(engine.evaluate("salarié . cotisations . prévoyances . conventionnelle . salarié").nodeValue, 11.2);

    engine.setSituation({ "salarié . contrat . statut cadre": "oui" });
    assert.equal(engine.evaluate(`${namespace} . prévoyance`).nodeValue, null);
  });
});