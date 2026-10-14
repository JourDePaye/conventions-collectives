import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const name = "3235-commerce-distribution-selective-parfumerie-beaute";
const value = "commerce de détail distribution sélective parfumerie beauté";
const namespace = `salarié . convention collective . ${value}`;

describe("IDCC 3235 — 2025.1 formation et audit paie", () => {
  it("calculates sourced employer contributions and stays isolated", async () => {
    const version = COMPILED_VERSIONS[name]?.find((entry) => entry.version === "2025.1");
    assert.ok(version);
    assert.equal(version.validFrom, "2025-06-08");
    assert.ok(version.sources.some((source) => source.includes("KALIARTI000050299025")));
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
      [`${namespace} . effectif entreprise`]: "10 salarié",
      [`${namespace} . assiette annuelle formation`]: "100000 €/an",
      [`${namespace} . assiette annuelle CDD`]: "20000 €/an",
      [`${namespace} . Alsace-Moselle`]: "non",
    });
    assert.equal(engine.evaluate(`${namespace} . taux contribution formation`).nodeValue, 0.55);
    assert.equal(Math.round((engine.evaluate(`${namespace} . contribution formation professionnelle`).nodeValue as number) * 100) / 100, 550);
    assert.equal(engine.evaluate(`${namespace} . taux taxe apprentissage`).nodeValue, 0.68);
    assert.equal(Math.round((engine.evaluate(`${namespace} . taxe apprentissage`).nodeValue as number) * 100) / 100, 680);
    assert.equal(Math.round((engine.evaluate(`${namespace} . contribution CPF CDD`).nodeValue as number) * 100) / 100, 200);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . effectif entreprise`]: "11 salarié",
      [`${namespace} . assiette annuelle formation`]: "100000 €/an",
      [`${namespace} . assiette annuelle CDD`]: "0 €/an",
      [`${namespace} . Alsace-Moselle`]: "oui",
    });
    assert.equal(engine.evaluate(`${namespace} . taux contribution formation`).nodeValue, 1);
    assert.equal(engine.evaluate(`${namespace} . taux taxe apprentissage`).nodeValue, 0.44);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, null);
  });
});
