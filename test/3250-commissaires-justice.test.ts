import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const modelName = "3250-commissaires-justice";
const value = "commissaires de justice et sociétés de ventes volontaires";
const namespace = `salarié . convention collective . ${value}`;

async function makeEngine() {
  const version = COMPILED_VERSIONS[modelName]?.find((candidate) => candidate.version === "2026.1");
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], value],
  } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  return { engine, extension };
}

describe("IDCC 3250 commissaires de justice", () => {
  it("calculates the sourced minimum and prorates it once", async () => {
    const { engine } = await makeEngine();
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . champ juridique`]: "'employeur signataire ou adhérent'",
      [`${namespace} . catégorie et coefficient`]: "'II.2-283'",
      "salarié . contrat . temps de travail . quotité": "80 %",
    });
    const amount = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
    assert.equal(Math.round((amount as number) * 100) / 100, 1970.63);
  });

  it("rejects an unknown classification through the explicit out-of-grid endpoint", async () => {
    const { engine } = await makeEngine();
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . champ juridique`]: "'employeur signataire ou adhérent'",
      [`${namespace} . catégorie et coefficient`]: "'II.2-999'",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel . grille`).nodeValue, 0);
  });

  it("keeps the extension namespaced and does not redefine payroll-wide rules", async () => {
    const { extension } = await makeEngine();
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
      assert.equal(name in modeleSocial, false, name);
    }
  });
});
