import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1501-restauration-rapide";
const value = "restauration rapide";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2025.1");
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

/** Minimum gross hourly rates of levels I to IV, article 44 of avenant n° 72 of 5 June 2025. */
const HOURLY_RATES: Record<string, number> = {
  "I.A": 11.88, "I.B": 11.9,
  "II.A": 12.22, "II.B": 12.45,
  "III.A": 12.82, "III.B": 12.93, "III.C": 13.98,
  "IV.A": 15.01, "IV.B": 15.43, "IV.C": 16.05, "IV.D": 17.34,
};

/** Minimum annual gross remuneration of level V, all salary elements included. */
const ANNUAL_MINIMUMS: Record<string, number> = {
  "V.A": 44645.78, "V.B": 46032.71, "V.C": 72408.11,
};

/** Hours a month of a full-time contract, as modele-social counts them: 35 h × 52 / 12. */
const FULL_TIME_HOURS = (35 * 52) / 12;

function setSituation(level: string | undefined, weeklyHours?: number) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    ...(weeklyHours === undefined
      ? {}
      : {
          "salarié . contrat . temps de travail . temps partiel": "oui",
          "salarié . contrat . temps de travail . temps partiel . heures par semaine": `${weeklyHours} heure/semaine`,
        }),
  });
}

function minimum(): number {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return result as number;
}

const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 1501 — 2025.1 minimum salaries", () => {
  it("is in force from 1 June 2025 and cites the avenant and its extension order", () => {
    assert.equal(version.validFrom, "2025-06-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 72 du 5 juin 2025")));
    assert.ok(version.sources.some((source) => source.includes("TSST2520699A")));
  });

  it("has 14 positions: 11 hourly rates and 3 annual minimums", () => {
    assert.equal(Object.keys(HOURLY_RATES).length + Object.keys(ANNUAL_MINIMUMS).length, 14);
  });

  for (const [level, rate] of Object.entries(HOURLY_RATES)) {
    it(`${level}: ${rate} € an hour, applied to the hours of the contract`, () => {
      setSituation(level);
      assert.ok(Math.abs(minimum() - rate * FULL_TIME_HOURS) < 1e-9);
      assert.equal(outOfGrid(), false);
    });
  }

  for (const [level, annual] of Object.entries(ANNUAL_MINIMUMS)) {
    it(`${level}: ${annual} € a year, one twelfth a month`, () => {
      setSituation(level);
      assert.ok(Math.abs(minimum() - annual / 12) < 1e-9);
      assert.equal(outOfGrid(), false);
    });
  }

  it("follows the hours of a part-time contract for levels I to IV", () => {
    // III.B at 24 hours a week.
    setSituation("III.B", 24);
    assert.ok(Math.abs(minimum() - (12.93 * 24 * 52) / 12) < 1e-9);
  });

  it("prorates the level V minimum once for part-time work", () => {
    // V.A at half-time: 17.5 hours out of 35.
    setSituation("V.A", 17.5);
    assert.ok(Math.abs(minimum() - 44645.78 / 24) < 1e-9);
  });

  it("rejects steps and levels outside the grid", () => {
    // Levels I and II have steps A and B only, level III A to C, level IV A to D, level V A to C.
    for (const level of ["0", "I", "V", "I.C", "II.C", "III.D", "IV.E", "V.D", "VI.A", "i.a", "1A", "I.1", "non renseigné"]) {
      setSituation(level);
      assert.equal(outOfGrid(), true, level);
      assert.equal(minimum(), 0, level);
    }
  });

  it("reports a missing level as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(minimum(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("III.B");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, null);
  });
});
