/**
 * IDCC 3242, versions 2023.3 and 2024.1: the grid of the regional daily press (accord of 30 June
 * 2023, KALITEXT000048558839) and the one of the regional weekly press, chosen by `forme de
 * presse`: accord of 2 June 2023 (KALITEXT000048052775), then, for the employees, avenant n° 1
 * of 15 November 2024 (KALITEXT000051352524, not extended), with its seniority increase.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3242-presse-regions";
const value = "presse en régions";
const namespace = `salarié . convention collective . ${value}`;
const WEEKLY = "hebdomadaire régionale";

async function engineOf(versionName: string) {
  const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === versionName);
  assert.ok(version, versionName);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], value],
  } as Rule;
  Object.assign(rules, await version.loadRules());
  return { version, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
}

function evaluate(
  engine: Engine,
  level: string | undefined,
  options: { form?: string; seniority?: number; quota?: string } = {},
) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    ...(options.form === undefined ? {} : { [`${namespace} . forme de presse`]: `'${options.form}'` }),
    ...(options.seniority === undefined ? {} : { [`${namespace} . ancienneté dans l'entreprise`]: `${options.seniority} an` }),
    ...(options.quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": options.quota }),
  });
  const amount = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof amount, "number");
  return {
    amount: Math.round((amount as number) * 100) / 100,
    outOfGrid: engine.evaluate(`${namespace} . niveau hors grille`).nodeValue,
  };
}

/** Accord of 30 June 2023, regional daily press. */
const DAILY: Record<string, number> = {
  "O": 1782.18, "E1": 1782.18, "E2": 1782.18, "E3": 1796.48, "E4": 1821.6, "E5": 1878.55,
  "E6": 2003.2, "C1.1": 1866.87, "C1.2": 2053.56, "C2.1": 2240.24, "C2.2": 2520.28,
  "C3.1": 2800.3, "C3.2": 3080.33, "C4.1": 3360.36, "C4.2": 3640.4,
};

/**
 * Accord of 2 June 2023, regional weekly press: the employees' coefficients 400 to 428 have the
 * SMPG of 1 834,60 € (note [1]) instead of 1 747,20 € (400 to 421) and 1 774,06 € (428).
 */
const WEEKLY_EMPLOYEES_2023: Record<string, number> = {
  "400": 1834.6, "407": 1834.6, "414": 1834.6, "421": 1834.6, "428": 1834.6, "435": 1803.08,
  "447": 1852.82, "462": 1914.99, "480": 1989.6, "500": 2072.5, "520": 2155.4,
};
const WEEKLY_EXECUTIVES: Record<string, number> = { "158": 2148.64, "170": 2311.83, "190": 2583.81, "210": 2855.79 };

/** Avenant n° 1 of 15 November 2024: groups of the employees, before the seniority increase. */
const WEEKLY_EMPLOYEES_2024: Record<string, number> = { G1: 1900, G2: 1940, G3: 1980, G4: 2020, G5: 2100, G6: 2250 };

describe("IDCC 3242 — 2023.3, both forms of press of 2023", async () => {
  const { version, engine } = await engineOf("2023.3");

  it("is in force from 1 July 2023, binds non-members from 1 November 2025 and cites both accords", () => {
    assert.equal(version.validFrom, "2023-07-01");
    assert.equal(version.extension, "2025-11-01");
    for (const id of ["KALITEXT000048558839", "KALITEXT000048052775", "JORFTEXT000052353580"]) {
      assert.ok(version.sources.some((source) => source.includes(id)), id);
    }
  });

  it("applies the daily press grid by default and when chosen", () => {
    for (const [level, monthly] of Object.entries(DAILY)) {
      assert.deepEqual(evaluate(engine, level), { amount: monthly, outOfGrid: false }, level);
      assert.deepEqual(evaluate(engine, level, { form: "quotidienne régionale" }), { amount: monthly, outOfGrid: false }, level);
    }
  });

  it("applies the weekly press grid of 2 June 2023", () => {
    for (const [level, monthly] of Object.entries({ ...WEEKLY_EMPLOYEES_2023, ...WEEKLY_EXECUTIVES })) {
      assert.deepEqual(evaluate(engine, level, { form: WEEKLY }), { amount: monthly, outOfGrid: false }, level);
    }
  });

  it("keeps each classification to the grid of its form of press", () => {
    assert.deepEqual(evaluate(engine, "E5", { form: WEEKLY }), { amount: 0, outOfGrid: true });
    assert.deepEqual(evaluate(engine, "447"), { amount: 0, outOfGrid: true });
    for (const level of ["G1", "401", "150", "non renseigné"]) {
      assert.equal(evaluate(engine, level, { form: WEEKLY }).outOfGrid, true, level);
    }
  });
});

describe("IDCC 3242 — 2024.1, employees of the weekly press from 1 December 2024", async () => {
  const { version, engine } = await engineOf("2024.1");

  it("is in force from 1 December 2024, without an extension, and cites the avenant", () => {
    assert.equal(version.validFrom, "2024-12-01");
    assert.equal(version.extension, undefined);
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000051352524")));
  });

  it("gives the minimum of each group, increased by 5 % from 5 years and 10 % from 10 years", () => {
    for (const [group, monthly] of Object.entries(WEEKLY_EMPLOYEES_2024)) {
      assert.deepEqual(evaluate(engine, group, { form: WEEKLY }), { amount: monthly, outOfGrid: false }, group);
      assert.equal(evaluate(engine, group, { form: WEEKLY, seniority: 4 }).amount, monthly, group);
      assert.equal(evaluate(engine, group, { form: WEEKLY, seniority: 5 }).amount, Math.round(monthly * 105) / 100, group);
      assert.equal(evaluate(engine, group, { form: WEEKLY, seniority: 10 }).amount, Math.round(monthly * 110) / 100, group);
    }
    assert.equal(evaluate(engine, "G3", { form: WEEKLY, seniority: 7 }).amount, 2079);
    assert.equal(evaluate(engine, "G6", { form: WEEKLY, seniority: 12 }).amount, 2475);
  });

  it("keeps the executives' grid of 2023 without seniority increase, and drops the employees' coefficients", () => {
    for (const [level, monthly] of Object.entries(WEEKLY_EXECUTIVES)) {
      assert.deepEqual(evaluate(engine, level, { form: WEEKLY, seniority: 12 }), { amount: monthly, outOfGrid: false }, level);
    }
    for (const level of Object.keys(WEEKLY_EMPLOYEES_2023)) {
      assert.equal(evaluate(engine, level, { form: WEEKLY }).outOfGrid, true, level);
    }
  });

  it("leaves the daily press unchanged, whatever the seniority", () => {
    for (const [level, monthly] of Object.entries(DAILY)) {
      assert.deepEqual(evaluate(engine, level, { seniority: 12 }), { amount: monthly, outOfGrid: false }, level);
    }
    assert.equal(evaluate(engine, "G1").outOfGrid, true);
  });

  it("prorates the minimum once for part-time work", () => {
    assert.equal(evaluate(engine, "G4", { form: WEEKLY, seniority: 10, quota: "50%" }).amount, 1111);
  });

  it("leaves the rules inapplicable for another agreement", () => {
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "niveau hors grille", "forme de presse", "ancienneté dans l'entreprise"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
