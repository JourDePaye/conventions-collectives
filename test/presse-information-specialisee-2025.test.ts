import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "presse information spécialisée";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS["3230-presse-information-specialisee"]?.find((entry) => entry.version === "2025.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(level: number, seniority = "0 an", quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: level,
    [`${namespace} . ancienneté dans l'entreprise`]: seniority,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}


// Protocole d'accord du 6 novembre 2025, annexe (KALITEXT000053497591): base, 3 ans, 6 ans, 9 ans et plus.
const GRID: Record<number, number[]> = {
  1: [1827, 1863, 1900, 1937],
  2: [1875, 1912, 1950, 1988],
  3: [1974, 2014, 2052, 2093],
  4: [2102, 2144, 2186, 2229],
  5: [2347, 2393, 2440, 2486],
  6: [2528, 2579, 2628, 2678],
  7: [2889, 2949, 3006, 3063],
  8: [3285, 3352, 3417, 3482],
  9: [3529, 3600, 3670, 3742],
};
const SENIORITY = ["0 an", "3 an", "6 an", "9 an"];

describe("IDCC 3230 — presse d'information spécialisée 2025.1", () => {
  it("applies from 1 December 2025 and cites the protocol", () => {
    assert.equal(version.validFrom, "2025-12-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000053497591")));
  });

  for (const [level, amounts] of Object.entries(GRID)) {
    amounts.forEach((expected, index) => {
      it(`niveau ${level}, ${SENIORITY[index]}: ${expected} €`, () => {
        setSituation(Number(level), SENIORITY[index]);
        assert.equal(minimum(), expected);
      });
    });
  }

  it("keeps the step just below each threshold", () => {
    setSituation(9, "8 an");
    assert.equal(minimum(), 3670);
  });

  it("prorates the minimum once", () => {
    setSituation(5, "6 an", "50%");
    assert.equal(minimum(), 1220);
  });

  it("detects an unknown level and leaves another agreement untouched", () => {
    setSituation(10);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
    assert.equal(minimum(), 0);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
