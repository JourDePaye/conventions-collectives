import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3109-industries-alimentaires-diverses";
const value = "industries alimentaires diverses";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version, "IDCC 3109 must be exported");
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = {
  ...choice,
  "une possibilité": [...choice["une possibilité"], value],
} as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const GRID: Record<string, number> = {
  "N1-E1": 1841.03, "N1-E2": 1859.03, "N1-E3": 1877.03,
  "N2-E1": 1899.03, "N2-E2": 1928.03, "N2-E3": 1967.03,
  "N3-E1": 2013.03, "N3-E2": 2054.03, "N3-E3": 2100.03,
  "N4-E1": 2165.03, "N4-E2": 2233.03,
  "N5-E1": 2324.03, "N5-E2": 2464.03,
  "N6-E1": 2610.03, "N6-E2": 2870.03,
  "N7-E1": 2974.03, "N7-E2": 3078.03,
  "N8-E1": 3202.03, "N8-E2": 4248.03,
  "N9-E1": 5294.03,
};

function setSituation(position: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(position === undefined ? {} : { [`${namespace} . position`]: `'${position}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 3109 — 2026.1 minimum salaries", () => {
  it("is in force from 1 January 2026 and cites the extended amendment", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source) => source.includes("article 1er et annexe")));
    assert.ok(version.sources.some((source) => source.includes("KALIARTI000054162160")));
    assert.ok(version.sources.some((source) => source.includes("Arrêté du 2 avril 2026")));
    assert.ok(version.sources.some((source) => source.includes("JORFTEXT000053907584")));
  });

  it("has all sourced classification positions", () => {
    assert.equal(Object.keys(GRID).length, 20);
  });

  for (const [position, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for ${position}`, () => {
      setSituation(position);
      assert.equal(minimum(), expected);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setSituation("N8-E2", "50%");
    assert.equal(minimum(), 2124.02);
  });

  it("rejects positions outside the sourced grid", () => {
    for (const position of ["N1-E4", "N10-E1", "non renseigné"]) {
      setSituation(position);
      assert.equal(minimum(), 0, position);
    }
  });

  it("leaves the model inapplicable for another agreement", () => {
    setSituation("N1-E1");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
