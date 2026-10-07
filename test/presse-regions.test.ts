import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3242-presse-regions";
const value = "presse en régions";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2023.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = {
  ...choice,
  "une possibilité": [...choice["une possibilité"], value],
} as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

/** Monthly minimums of the accord of 30 June 2023, by position. */
const MONTHLY: Record<string, number> = {
  "O": 1782.18,
  "E1": 1782.18,
  "E2": 1782.18,
  "E3": 1796.48,
  "E4": 1821.6,
  "E5": 1878.55,
  "E6": 2003.2,
  "C1.1": 1866.87,
  "C1.2": 2053.56,
  "C2.1": 2240.24,
  "C2.2": 2520.28,
  "C3.1": 2800.3,
  "C3.2": 3080.33,
  "C4.1": 3360.36,
  "C4.2": 3640.4,
};

function setSituation(level: string | undefined, quota?: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    ...(quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": quota }),
  });
}

const amount = () => {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
};

const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 3242 — 2023.1 minimum salaries", () => {
  it("is in force from 1 July 2023 and cites the accord and its extension order", () => {
    assert.equal(version.validFrom, "2023-07-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 30 juin 2023")));
    assert.ok(version.sources.some((source) => source.includes("arrêté du 22 septembre 2025")));
  });

  it("has 15 positions", () => {
    assert.equal(Object.keys(MONTHLY).length, 15);
  });

  for (const [level, monthly] of Object.entries(MONTHLY)) {
    it(`${level}: ${monthly} € a month`, () => {
      setSituation(level);
      assert.equal(amount(), monthly);
      assert.equal(outOfGrid(), false);
    });
  }

  it("matches the executives' point of 18.6687 € per coefficient point, to a cent", () => {
    const coefficients: Record<string, number> = {
      "C1.1": 100, "C1.2": 110, "C2.1": 120, "C2.2": 135, "C3.1": 150, "C3.2": 165, "C4.1": 180, "C4.2": 195,
    };
    for (const [level, coefficient] of Object.entries(coefficients)) {
      assert.ok(Math.abs(MONTHLY[level]! - coefficient * 18.6687) <= 0.011, level);
    }
  });

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("E5", "50%");
    assert.equal(amount(), 939.28);
    setSituation("C2.1", "80%");
    assert.equal(amount(), 1792.19);
  });

  it("rejects positions outside the grid", () => {
    for (const level of ["E0", "E7", "O1", "C1", "C5.1", "C1.3", "e1", "A", "non renseigné"]) {
      setSituation(level);
      assert.equal(outOfGrid(), true, level);
      assert.equal(amount(), 0, level);
    }
  });

  it("reports a missing position as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(amount(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("E5");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "niveau hors grille"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
