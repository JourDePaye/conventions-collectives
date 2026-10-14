import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "branche ferroviaire";
const namespace = `salarié . convention collective . ${value}`;

async function makeEngine() {
  const version = COMPILED_VERSIONS["3217-branche-ferroviaire"]?.find((v) => v.version === "2025.1");
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

describe("IDCC 3217 branche ferroviaire — 2025.1", () => {
  it("calculates the annual guarantee at hiring", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . classe`]: 1,
      [`${namespace} . ancienneté`]: 0,
      "salarié . contrat . temps de travail . quotité": "100%",
    });
    assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, 22377);
  });

  it("uses the seniority threshold and prorates once", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . classe`]: 8,
      [`${namespace} . ancienneté`]: 12,
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, 26852);
  });

  it("rejects an unsupported class and exposes the payroll audit boundary", async () => {
    const engine = await makeEngine();
    engine.setSituation({ "salarié . convention collective": `'${value}'`, [`${namespace} . classe`]: 10 });
    assert.equal(get(engine, "classe hors grille").nodeValue, true);
    assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, 0);
    assert.equal(get(engine, "audit paie").nodeValue, true);
  });

  it("is isolated from another agreement", async () => {
    const engine = await makeEngine();
    engine.setSituation({ "salarié . convention collective": "'casinos'" });
    assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, null);
  });
});
