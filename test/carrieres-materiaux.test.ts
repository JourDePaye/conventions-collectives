import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const model = "3249-carrieres-materiaux";
const value = "carrières et matériaux de construction";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[model]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const releasedVersion = version;

const grid = {
  "1.1": 1840, "1.2": 1866, "1.3": 1874,
  "2.1": 1903, "2.2": 1957, "2.3": 1969,
  "3.1": 2000, "3.2": 2060, "3.3": 2069,
  "4.1": 2104, "4.2": 2178, "4.3": 2187,
  "5.1": 2252, "5.2": 2409, "5.3": 2451,
  "6.1": 2546, "6.2": 2748, "6.3": 2814,
  "7.1": 2975, "7.2": 3240,
};

async function makeEngine() {
  const extension = await releasedVersion.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...new Set([...choice["une possibilité"], value])],
  } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

describe("IDCC 3249 industries de carrières et matériaux", () => {
  it("evaluates every sourced Île-de-France minimum", async () => {
    assert.equal(releasedVersion.validFrom, "2026-01-01");
    const engine = await makeEngine();
    for (const [classification, minimum] of Object.entries(grid)) {
      engine.setSituation({
        "salarié . convention collective": `'${value}'`,
        [`${namespace} . région`]: "'Île-de-France'",
        [`${namespace} . niveau et échelon`]: `'${classification}'`,
      });
      assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, minimum);
    }
  });

  it("prorates the monthly minimum and blocks unsupported regions", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . région`]: "'Île-de-France'",
      [`${namespace} . niveau et échelon`]: "'5.2'",
      "salarié . contrat . temps de travail . quotité": "80%",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1927.2);
    engine.setSituation({ [`${namespace} . région`]: "'hors Île-de-France'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });

  it("flags classifications outside the sourced grid", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . région`]: "'Île-de-France'",
      [`${namespace} . niveau et échelon`]: "'7.3'",
    });
    assert.equal(engine.evaluate(`${namespace} . niveau et échelon hors grille`).nodeValue, true);
  });
});
