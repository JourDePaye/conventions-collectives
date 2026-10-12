import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1747-boulangerie-industrielle";
const value = "boulangerie industrielle 1747";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2025.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const GRID: Record<string, number> = {
  A1: 1804.8, A2: 1814.33,
  B1: 1825.01, B2: 1839.61,
  C1: 1855.52, C2: 1872.23, C3: 1892.82,
  D1: 1917.72, D2: 1933.07, D3: 1954.33,
  E1: 1988.82, E2: 2020.64, E3: 2074.18,
  F1: 2201.48, F2: 2222.39, F3: 2253.51,
  G1: 2299.58, G2: 2342.12, G3: 2412.38,
  H1: 2544.01, H2: 2610.15, H3: 2718.47,
  I: 2891.3,
  J1: 3070.81, J2: 3175.22, J3: 3280,
  K1: 3461.53, K2: 3648.45, K3: 3834.52,
  L1: 4019.73, L2: 4276.99, L3: 4578.52,
  M: 5161.52,
};

function setSituation(level: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 1747 — 2025.1 minimum salaries", () => {
  it("is effective from 1 February 2025 and cites the extended salary amendment", () => {
    assert.equal(version.validFrom, "2025-02-01");
    assert.ok(version.sources.some((source) => source.includes("KALIARTI000051537779")));
    assert.ok(version.sources.some((source) => source.includes("JORFTEXT000051508529")));
  });

  it("has the 33 positions of the extended salary grid", () => {
    assert.equal(Object.keys(GRID).length, 33);
  });

  for (const [level, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for ${level}`, () => {
      setSituation(level);
      assert.equal(minimum(), expected);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, false);
    });
  }

  it("prorates the minimum for part-time work", () => {
    setSituation("L3", "50%");
    assert.equal(minimum(), 2289.26);
  });

  it("rejects classifications outside the sourced grid", () => {
    for (const level of ["Z1", "Z2", "Z3", "non renseigné"]) {
      setSituation(level);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true, level);
      assert.equal(minimum(), 0, level);
    }
  });

  it("is inapplicable for another collective agreement", () => {
    setSituation("A1");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
