import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

describe("espaces de loisirs, d'attractions et culturels (IDCC 1790)", () => {
  it("evaluates the sourced minimum and prorates it", async () => {
    const version = COMPILED_VERSIONS["1790-espaces-loisirs"]?.find((v) => v.version === "2026.1");
    assert.ok(version);
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial };
    const namespace = "salarié . convention collective . espaces loisirs";
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
      assert.ok(!(name in rules), `Duplicate modele-social rule: ${name}`);
    }
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "espaces loisirs"] } as Rule;
    Object.assign(rules, extension);
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'espaces loisirs'",
      [`${namespace} . niveau`]: "'IV'",
      [`${namespace} . coefficient`]: 280,
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(engine.evaluate(`${namespace} . rémunération minimale`).nodeValue, 2441.10);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1220.55);
  });

  it("isolates an unknown classification", async () => {
    const version = COMPILED_VERSIONS["1790-espaces-loisirs"]?.find((v) => v.version === "2026.1");
    assert.ok(version);
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial };
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "espaces loisirs"] } as Rule;
    Object.assign(rules, extension);
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'espaces loisirs'",
      "salarié . convention collective . espaces loisirs . niveau": "'IX'",
      "salarié . convention collective . espaces loisirs . coefficient": 999,
    });
    assert.equal(engine.evaluate("salarié . convention collective . espaces loisirs . classification hors grille").nodeValue, true);
    assert.equal(engine.evaluate("salarié . convention collective . espaces loisirs . salaire minimum conventionnel").nodeValue, 0);
  });
});

// Avenant n° 76 du 13 mars 2026 (KALITEXT000054871990), grid at 1 April 2026, amounts hard-coded from article 1.
describe("espaces de loisirs (IDCC 1790), avenant n° 76 at 1 April 2026", () => {
  const namespace = "salarié . convention collective . espaces loisirs";
  const engineFor = async (version: string, niveau: string, coefficient: number, quotient = "100%") => {
    const found = COMPILED_VERSIONS["1790-espaces-loisirs"]?.find((v) => v.version === version);
    assert.ok(found, version);
    const extension = await found.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial };
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "espaces loisirs"] } as Rule;
    Object.assign(rules, extension);
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'espaces loisirs'",
      [`${namespace} . niveau`]: `'${niveau}'`,
      [`${namespace} . coefficient`]: coefficient,
      "salarié . contrat . temps de travail . quotité": quotient,
    });
    return engine;
  };
  const grid: Array<[string, number, number]> = [
    ["I", 150, 1851.85], ["I", 154, 1870.9], ["I", 158, 1875.13],
    ["II", 175, 1882.13], ["II", 181, 1900.08], ["II", 187, 1915.91],
    ["III", 200, 1932.26], ["III", 215, 1963.85],
    ["IV", 220, 1979.64], ["IV", 250, 2210.9], ["IV", 280, 2471.61], ["IV", 300, 2579.03],
    ["V", 300, 2579.03], ["VI", 360, 3026.42], ["VII", 430, 3653.19], ["VIII", 520, 4406.15],
  ];
  for (const version of ["2026.2", "2026.3"]) {
    it(`${version} gives the full grid`, async () => {
      for (const [niveau, coefficient, amount] of grid) {
        const engine = await engineFor(version, niveau, coefficient);
        assert.equal(engine.evaluate(`${namespace} . rémunération minimale`).nodeValue, amount, `${niveau} ${coefficient}`);
      }
    });
  }
  it("prorates part-time and flags an out-of-grid coefficient", async () => {
    const half = await engineFor("2026.3", "VIII", 520, "50%");
    assert.equal(half.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2203.075);
    const out = await engineFor("2026.3", "I", 151);
    assert.equal(out.evaluate(`${namespace} . classification hors grille`).nodeValue, true);
  });
});
