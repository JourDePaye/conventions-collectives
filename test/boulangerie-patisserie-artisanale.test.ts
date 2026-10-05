import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0843-boulangerie-patisserie-artisanale";
const value = "boulangerie-pâtisserie artisanale";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
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

const COEFFICIENTS = [155, 160, 165, 170, 175, 180, 185, 190, 195, 240];

/** National hourly minimums, article 2 of avenant n° 139 of 14 January 2026. */
const NATIONAL: number[] = [12.41, 12.53, 12.66, 12.78, 12.91, 13.03, 13.31, 13.43, 13.54, 14.59];
/** Île-de-France hourly minimums, article 2 of accord n° 61 of 22 January 2026. */
const ILE_DE_FRANCE: number[] = [12.57, 12.86, 13.14, 13.43, 13.71, 14.0, 14.28, 14.57, 14.85, 17.42];
/** Bouches-du-Rhône hourly minimums, article 3 of avenant n° 20 of 21 January 2026. */
const BOUCHES_DU_RHONE: number[] = [12.57, 12.68, 12.8, 12.95, 13.05, 13.15, 13.76, 13.97, 14.1, 15.13];

const ZONES: Record<string, number[]> = {
  national: NATIONAL,
  "Île-de-France": ILE_DE_FRANCE,
  "Bouches-du-Rhône": BOUCHES_DU_RHONE,
};

/** Annual remuneration of cadres 1 and 2 for 218 days, by zone (Bouches-du-Rhône: national). */
const EXECUTIVES: Record<string, Record<string, number>> = {
  national: { C1: 39871, C2: 57206 },
  "Île-de-France": { C1: 39955, C2: 57328 },
  "Bouches-du-Rhône": { C1: 39871, C2: 57206 },
};

/** Hours a month of a full-time contract, as modele-social counts them: 35 h × 52 / 12. */
const FULL_TIME_HOURS = (35 * 52) / 12;

function setSituation(level: string | undefined, zone?: string, weeklyHours?: number) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    ...(zone === undefined ? {} : { [`${namespace} . zone`]: `'${zone}'` }),
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

describe("IDCC 843 — 2026.1 minimum salaries", () => {
  it("is in force from 1 February 2026 and cites the three texts and their extension orders", () => {
    assert.equal(version.validFrom, "2026-02-01");
    for (const reference of [
      "Avenant n° 139 du 14 janvier 2026",
      "TRST2608824A",
      "Accord Île-de-France n° 61 du 22 janvier 2026",
      "JORFTEXT 000053907805",
      "Avenant n° 20 du 21 janvier 2026",
      "JORFTEXT 000053907594",
    ]) {
      assert.ok(version.sources.some((source) => source.includes(reference)), reference);
    }
  });

  for (const [zone, rates] of Object.entries(ZONES)) {
    COEFFICIENTS.forEach((coefficient, index) => {
      const rate = rates[index]!;
      it(`${zone}, coefficient ${coefficient}: ${rate} € an hour, applied to the hours of the contract`, () => {
        setSituation(`${coefficient}`, zone);
        assert.ok(Math.abs(minimum() - rate * FULL_TIME_HOURS) < 1e-9);
        assert.equal(outOfGrid(), false);
      });
    });

    for (const [level, annual] of Object.entries(EXECUTIVES[zone]!)) {
      it(`${zone}, ${level}: ${annual} € a year, one twelfth a month`, () => {
        setSituation(level, zone);
        assert.ok(Math.abs(minimum() - annual / 12) < 1e-9);
        assert.equal(outOfGrid(), false);
      });
    }
  }

  it("applies the national grid when no zone is given", () => {
    setSituation("170");
    assert.ok(Math.abs(minimum() - 12.78 * FULL_TIME_HOURS) < 1e-9);
  });

  it("follows the hours of a part-time contract", () => {
    // Coefficient 170 in Île-de-France at 24 hours a week.
    setSituation("170", "Île-de-France", 24);
    assert.ok(Math.abs(minimum() - (13.43 * 24 * 52) / 12) < 1e-9);
  });

  it("prorates the cadre minimum once for part-time work", () => {
    setSituation("C1", "national", 17.5);
    assert.ok(Math.abs(minimum() - 39871 / 24) < 1e-9);
  });

  it("matches the point value formulas of the national avenant", () => {
    // salaire horaire = point × coefficient + constante, rounded to the cent.
    const national = (coefficient: number) =>
      coefficient <= 180 ? 0.0248 * coefficient + 8.566 : 0.023273 * coefficient + 9.00448;
    COEFFICIENTS.forEach((coefficient, index) => {
      assert.equal(Math.round(national(coefficient) * 100) / 100, NATIONAL[index], `${coefficient}`);
    });
  });

  it("rejects coefficients and statuses outside the grid", () => {
    for (const level of ["0", "150", "200", "241", "C3", "c1", "1", "A", "non renseigné"]) {
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
    setSituation("170");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, null);
  });
});
