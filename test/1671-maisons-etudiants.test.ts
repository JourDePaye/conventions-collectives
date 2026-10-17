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
    assert.ok(lock["1671-maisons-etudiants.2025.1"]);
    assert.ok(lock["1671-maisons-etudiants.2026.2"]);
    assert.ok(lock["1671-maisons-etudiants.2026.3"]);
  });
});

// Before avenant n° 76: coefficients of avenant n° 70 (unchanged by avenant n° 75), point at
// 67,78 € (avenant n° 73) and the employer health share at 60 % (avenant n° 71).
describe("IDCC 1671 — versions binding non-members before avenant n° 76", () => {
  for (const revision of ["2025.1", "2026.2"]) {
    it(`${revision}: classes 1, 10 and 20 at 333, 410 and 677 x 67,78 €`, async () => {
      const engine = await makeEngine(revision);
      for (const [classe, minimum] of [[1, 22570.74], [10, 27789.8], [20, 45887.06]]) {
        engine.setSituation({ "salarié . convention collective": `'${value}'`, [`${namespace} . classe`]: classe });
        assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, minimum);
      }
    });

    it(`${revision}: the employer pays 60 % of the health contribution`, async () => {
      const engine = await makeEngine(revision);
      engine.setSituation({
        "salarié . convention collective": `'${value}'`,
        [`${namespace} . cotisation santé mensuelle conventionnelle`]: "100 €/mois",
      });
      assert.equal(get(engine, "prise en charge employeur santé").nodeValue, 60);
      assert.equal(get(engine, "part salarié santé").nodeValue, 40);
    });
  }

  it("2025.1 has no thirteenth month (avenant n° 74 is in force from 2026)", async () => {
    const engine = await makeEngine("2025.1");
    assert.equal(Object.keys(engine.getParsedRules()).some((name) => name.includes("treizième mois")), false);
  });
});
