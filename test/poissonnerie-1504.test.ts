import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const name = "1504-poissonnerie";
const value = "poissonnerie";
const namespace = `salarié . convention collective . ${value}`;

describe("IDCC 1504 — 2024.1 salaires et audit paie", () => {
  it("calculates sourced minima, detects scope, and stays isolated", async () => {
    const version = COMPILED_VERSIONS[name]?.find((entry) => entry.version === "2024.1");
    assert.ok(version);
    assert.equal(version.validFrom, "2024-05-01");
    assert.ok(version.sources.some((source) => source.includes("KALIARTI000049439193")));
    assert.ok(version.sources.some((source) => source.includes("JORFTEXT000049475104")));
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial };
    for (const ruleName of Object.keys(extension)) {
      assert.ok(ruleName === namespace || ruleName.startsWith(`${namespace} . `), ruleName);
      assert.ok(!(ruleName in rules), `Duplicate modele-social rule: ${ruleName}`);
    }
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
    Object.assign(rules, extension);
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . coefficient`]: "150",
      "salarié . contrat . temps de travail . quotité": "100 %",
    });
    assert.equal(engine.evaluate(`${namespace} . grille`).nodeValue, 1928.13);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1928.13);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, false);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . coefficient`]: "999",
      "salarié . contrat . temps de travail . quotité": "50 %",
    });
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, null);
  });
});
