import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

describe("IDCC 3236 industrie et services nautiques", () => {
  it("evaluates the sourced minimum and prorates it", async () => {
    const version = COMPILED_VERSIONS["3236-industrie-services-nautiques"]?.find((v) => v.version === "2025.1");
    assert.ok(version);
    const rules: Record<string, Rule> = { ...modeleSocial, ...(await version.loadRules()) };
    const namespace = "salarié . convention collective . industrie services nautiques";
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'industrie services nautiques'",
      [`${namespace} . niveau et échelon`]: "'VI.2'",
      "salarié . contrat . statut cadre": "non",
      "salarié . contrat . temps de travail . quotité": "80 %",
    });
    assert.equal(Math.round((engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue as number) * 100) / 100, 1982.30);
  });

  it("returns zero for an unknown level and echelons", async () => {
    const version = COMPILED_VERSIONS["3236-industrie-services-nautiques"]?.find((v) => v.version === "2025.1");
    assert.ok(version);
    const rules: Record<string, Rule> = { ...modeleSocial, ...(await version.loadRules()) };
    const namespace = "salarié . convention collective . industrie services nautiques";
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'industrie services nautiques'",
      [`${namespace} . niveau et échelon`]: "'X.9'",
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0);
    assert.equal(engine.evaluate(`${namespace} . niveau et échelon hors grille`).nodeValue, true);
  });
});

describe("IDCC 3236 industrie et services nautiques — version 2025.2", () => {
  const namespace = "salarié . convention collective . industrie services nautiques";

  async function makeEngine() {
    const version = COMPILED_VERSIONS["3236-industrie-services-nautiques"]?.find((v) => v.version === "2025.2");
    assert.ok(version);
    const rules: Record<string, Rule> = { ...modeleSocial, ...(await version.loadRules()) };
    return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  }

  function minimum(engine: Engine, level: string, quotite?: string) {
    engine.setSituation({
      "salarié . convention collective": "'industrie services nautiques'",
      [`${namespace} . niveau et échelon`]: `'${level}'`,
      "salarié . contrat . statut cadre": "non",
      ...(quotite ? { "salarié . contrat . temps de travail . quotité": quotite } : {}),
    });
    return Math.round((engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue as number) * 100) / 100;
  }

  it("carries every row of the 16 April 2025 annex (amounts read in the text)", async () => {
    const engine = await makeEngine();
    const expected: Record<string, number> = {
      "I.1": 1801.8, "I.2": 1842.24, "II.1": 1852.62, "II.2": 1863.96, "II.3": 1888.21,
      "III.1": 1912.44, "III.2": 1940.71, "III.3": 1955.52, "IV.1": 1955.52, "IV.2": 1972.75,
      "V.1": 1993.31, "V.2": 2090.19, "VI.1": 2279.21, "VI.2": 2477.87,
      "VII.1": 2291.16, "VII.2": 2500.6, "VII.3": 3667.22, "VII.4": 5103.16,
    };
    for (const [level, amount] of Object.entries(expected)) {
      assert.equal(minimum(engine, level), amount, level);
    }
  });

  it("prorates part-time once", async () => {
    const engine = await makeEngine();
    assert.equal(minimum(engine, "III.2", "50 %"), 970.36);
  });

  it("reports an out-of-grid level", async () => {
    const engine = await makeEngine();
    assert.equal(minimum(engine, "VIII.1"), 0);
    assert.equal(engine.evaluate(`${namespace} . niveau et échelon hors grille`).nodeValue, true);
  });
});
