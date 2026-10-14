import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "inspection assurance";
const namespace = `salarié . convention collective . ${value}`;

async function makeEngine() {
  const version = COMPILED_VERSIONS["1679-inspection-assurance"]?.find((v) => v.version === "2007.2");
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

describe("IDCC 1679 inspection d'assurance", () => {
  it("calculates the sourced annual RMA and indicative monthly equivalent", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . classe`]: "'6'",
      [`${namespace} . date de calcul`]: "01/01/2007",
      "salarié . contrat . temps de travail . quotité": "100%",
    });
    assert.equal(get(engine, "grille annuelle").nodeValue, 35800);
    assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, 35800);
    assert.equal(get(engine, "salaire minimum mensuel indicatif").nodeValue, 2983.33);
  });

  it("prorates the annual RMA and keeps the audit external", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . classe`]: "'7'",
      [`${namespace} . date de calcul`]: "01/06/2007",
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, 24985);
    assert.equal(get(engine, "audit paie").nodeValue, false);
  });

  it("rejects an unsupported class without leaking rules into unrelated agreements", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . classe`]: "'4'",
      [`${namespace} . date de calcul`]: "01/01/2007",
    });
    assert.equal(get(engine, "classe hors grille").nodeValue, true);
    assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, null);
    assert.equal(Object.keys(engine.getParsedRules()).some((name) => name.includes("inspection assurance . cotisations")), false);
  });
});
