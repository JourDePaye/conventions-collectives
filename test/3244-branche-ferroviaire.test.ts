import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "branche ferroviaire";
const namespace = `salarié . convention collective . ${value}`;

async function makeEngine() {
  const version = COMPILED_VERSIONS["3244-branche-ferroviaire"]?.find((v) => v.version === "2023.1");
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

describe("IDCC 3244 branche ferroviaire", () => {
  it("calculates the sourced point minimum and prorates it", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . coefficient`]: 246,
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(engine.evaluate(`${namespace} . valeur du point`).nodeValue, 16.315);
    assert.equal(Math.round((engine.evaluate(`${namespace} . grille mensuelle`).nodeValue as number) * 100) / 100, 4013.49);
    assert.equal(Math.round((engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue as number) * 1000) / 1000, 2006.745);
  });

  it("exposes the explicit payroll audit without inventing contribution rates", async () => {
    const engine = await makeEngine();
    engine.setSituation({ "salarié . convention collective": `'${value}'` });
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, false);
  });

  it("flags unsupported coefficients and stays isolated from other agreements", async () => {
    const engine = await makeEngine();
    engine.setSituation({ "salarié . convention collective": `'${value}'`, [`${namespace} . coefficient`]: 300 });
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 4894.5);
    assert.equal(Object.keys(engine.getParsedRules()).some((name) => name.includes("branche ferroviaire .")), true);
  });
});
