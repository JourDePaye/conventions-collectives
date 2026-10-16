import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

// Amounts read in article 3 of the Île-de-France accord of 19 March 2026
// (KALITEXT000054337807): level 1 has two échelons, levels 2 to 7 have three.
const model = "3249-carrieres-materiaux";
const value = "carrières et matériaux de construction";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[model]?.find((entry) => entry.version === "2026.2");
assert.ok(version);
const released = version;

const grid: Record<string, number> = {
  "1.1": 1840, "1.2": 1866,
  "2.1": 1874, "2.2": 1903, "2.3": 1957,
  "3.1": 1969, "3.2": 2000, "3.3": 2060,
  "4.1": 2069, "4.2": 2104, "4.3": 2178,
  "5.1": 2187, "5.2": 2252, "5.3": 2409,
  "6.1": 2451, "6.2": 2546, "6.3": 2748,
  "7.1": 2814, "7.2": 2975, "7.3": 3240,
};

async function makeEngine() {
  const extension = await released.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...new Set([...choice["une possibilité"], value])],
  } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

function situation(classification: string, extra: Record<string, unknown> = {}) {
  return {
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . région`]: "'Île-de-France'",
    [`${namespace} . niveau et échelon`]: `'${classification}'`,
    ...extra,
  } as Record<string, string>;
}

describe("IDCC 3249 revision 2026.2 (Île-de-France accord of 19 March 2026)", () => {
  it("applies from 1 January 2026, like the revision it supersedes", () => {
    assert.equal(released.validFrom, "2026-01-01");
  });

  it("evaluates all 20 sourced minimums", async () => {
    const engine = await makeEngine();
    for (const [classification, minimum] of Object.entries(grid)) {
      engine.setSituation(situation(classification));
      assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, minimum, classification);
      assert.equal(engine.evaluate(`${namespace} . niveau et échelon hors grille`).nodeValue, false, classification);
    }
  });

  it("no longer carries the invented échelon 1.3 and includes 7.3", async () => {
    const engine = await makeEngine();
    engine.setSituation(situation("1.3"));
    assert.equal(engine.evaluate(`${namespace} . niveau et échelon hors grille`).nodeValue, true);
    engine.setSituation(situation("7.3"));
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 3240);
  });

  it("flags classifications outside the grid", async () => {
    const engine = await makeEngine();
    for (const key of ["8.1", "0.1", "2.4", "non renseigné"]) {
      engine.setSituation(situation(key));
      assert.equal(engine.evaluate(`${namespace} . niveau et échelon hors grille`).nodeValue, true, key);
    }
  });

  it("prorates the minimum for part-time work", async () => {
    const engine = await makeEngine();
    engine.setSituation(situation("5.2", { "salarié . contrat . temps de travail . quotité": "80%" }));
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1801.6);
    engine.setSituation(situation("7.3", { "salarié . contrat . temps de travail . quotité": "50%" }));
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1620);
  });
});
