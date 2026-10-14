import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "expertises automobile";
const namespace = `salarié . convention collective . ${value}`;

async function makeEngine() {
  const version = COMPILED_VERSIONS["1951-expertises-automobile"]?.find((v) => v.version === "2025.1");
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  for (const name of Object.keys(extension)) {
    assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
    assert.ok(!(name in rules), `Duplicate modele-social rule: ${name}`);
  }
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

function get(engine: Engine, rule: string) {
  return engine.evaluate(`${namespace} . ${rule}`);
}

describe("IDCC 1951 expertises en automobile", () => {
  it("calculates the sourced annual minimum and indicative monthly equivalent", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . niveau`]: "'5'",
      "salarié . contrat . temps de travail . quotité": "100%",
    });
    assert.equal(get(engine, "grille annuelle").nodeValue, 34776);
    assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, 34776);
    assert.equal(get(engine, "salaire minimum mensuel indicatif").nodeValue, 2898);
  });

  it("prorates the annual minimum and keeps payroll rubrics external", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . niveau`]: "'10'",
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, 26035.5);
    assert.equal(get(engine, "salaire minimum mensuel indicatif").nodeValue, 2169.63);
    assert.equal(get(engine, "audit paie").nodeValue, false);
  });

  it("rejects an unsupported level without leaking rules into unrelated agreements", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . niveau`]: "'11'",
    });
    assert.equal(get(engine, "niveau hors grille").nodeValue, true);
    assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, 0);
    assert.equal(Object.keys(engine.getParsedRules()).some((name) => name.includes("expertises automobile . cotisations")), false);
  });
});
