import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { readFileSync } from "node:fs";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "maisons d'étudiants";
const namespace = `salarié . convention collective . ${value}`;

async function makeEngine(revision = "2026.3") {
  const version = COMPILED_VERSIONS["1671-maisons-etudiants"]?.find((v) => v.version === revision);
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

describe("IDCC 1671 maisons d'étudiants", () => {
  it("calculates the sourced annual minimum and indicative monthly equivalent", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . classe`]: 10,
      "salarié . contrat . temps de travail . quotité": "100%",
    });
    assert.equal(get(engine, "coefficient conventionnel").nodeValue, 410);
    assert.equal(get(engine, "valeur annuelle du point").nodeValue, 68.8);
    assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, 28208);
    assert.equal(get(engine, "salaire minimum mensuel indicatif").nodeValue, 2350.67);
  });

  it("applies thirteenth-month ramp-up and health split", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . classe`]: 10,
      [`${namespace} . année du treizième mois`]: 2026,
      [`${namespace} . salaire brut annuel éligible au treizième mois`]: "28208 €/an",
      [`${namespace} . cotisation santé mensuelle conventionnelle`]: "100 €/mois",
    });
    assert.equal(get(engine, "treizième mois annuel").nodeValue, 9402.67);
    assert.equal(get(engine, "prise en charge employeur santé").nodeValue, 65);
    assert.equal(get(engine, "part salarié santé").nodeValue, 35);
  });

  it("rejects an unsupported class without leaking rules into unrelated agreements", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . classe`]: 21,
    });
    assert.equal(get(engine, "classe hors grille").nodeValue, true);
    assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, null);
    assert.equal(Object.keys(engine.getParsedRules()).some((name) => name.includes("maisons d'étudiants . cotisations")).valueOf(), false);
  });

  it("keeps the generated lock entry for this single model version", () => {
    const lock = JSON.parse(readFileSync(new URL("../rules/versions.lock.json", import.meta.url), "utf8")) as Record<string, string>;
    assert.ok(lock["1671-maisons-etudiants.2026.2"]);
    assert.ok(lock["1671-maisons-etudiants.2026.3"]);
  });
});
