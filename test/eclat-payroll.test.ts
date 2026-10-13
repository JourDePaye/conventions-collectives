import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const name = "1518-eclat";
const value = "éclat";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[name]?.find((candidate) => candidate.version === "2026.2");
assert.ok(version);
const releasedVersion = version;

function engineFor(agreement = value) {
  const extension = releasedVersion.loadRules();
  return extension.then((loaded) => {
    const rules: Record<string, Rule> = { ...modeleSocial };
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = {
      ...choice,
      "une possibilité": [...choice["une possibilité"], value],
    } as Rule;
    for (const key of Object.keys(loaded)) {
      assert.ok(key === namespace || key.startsWith(`${namespace} . `), key);
      assert.equal(key in rules, false, `Duplicate modele-social rule: ${key}`);
    }
    Object.assign(rules, loaded);
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": `'${agreement}'`,
      [`${namespace} . groupe`]: "'B'",
      "salarié . rémunération . brut": "3000 €/mois",
      "entreprise . salariés . effectif": 20,
    });
    return engine;
  });
}

describe("IDCC 1518 — audit paie formation 2026.2", () => {
  it("overrides the standard formation contribution with the sourced 2.10% total", async () => {
    const engine = await engineFor();
    assert.equal(engine.evaluate(`${namespace} . cotisations . formation professionnelle`).nodeValue, 63);
  });

  it("exposes the separate 0.05% volunteer-leader training contribution", async () => {
    const engine = await engineFor();
    assert.equal(engine.evaluate(`${namespace} . cotisations . formation dirigeants bénévoles`).nodeValue, 1.5);
  });

  it("keeps the extension isolated outside ÉCLAT", async () => {
    const engine = await engineFor("droit commun");
    assert.equal(engine.evaluate(`${namespace} . cotisations . formation professionnelle`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . cotisations . formation dirigeants bénévoles`).nodeValue, null);
  });
});
