import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "personnel navigant technique hélicoptères";
const namespace = `salarié . convention collective . ${value}`;

async function makeEngine() {
  const version = COMPILED_VERSIONS["1612-transport-aerien-personnel-navigant"]?.find((v) => v.version === "2024.1");
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

describe("IDCC 1612 personnel navigant technique hélicoptères", () => {
  it("calculates the sourced FTR minimum and prorates it", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . classification`]: "'FTR3-2'",
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2878.5);
  });

  it("exposes the explicit payroll audit without inventing contribution rates", async () => {
    const engine = await makeEngine();
    engine.setSituation({ "salarié . convention collective": `'${value}'` });
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, false);
  });

  it("keeps the namespace isolated and flags an unsupported classification", async () => {
    const engine = await makeEngine();
    engine.setSituation({ "salarié . convention collective": `'${value}'`, [`${namespace} . classification`]: "'FTR9-1'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel hors grille`).nodeValue, false);
    assert.equal(Object.keys(engine.getParsedRules()).some((name) => name.includes("personnel navigant technique hélicoptères .")), true);
  });
});
