/**
 * IDCC 18, versions 2026.2 and 2026.3: the grid of the textile industry and the grid of the
 * artificial and synthetic textiles sector, chosen by `secteur`. Amounts read on Légifrance:
 * accord of 15 January 2026 (KALITEXT000054161832) and accord of 12 January 2026 for the
 * artificial sector (KALITEXT000053973002). The grid of 1 June 2026 is the one of 2026.1.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0018-industries-textiles";
const value = "industries textiles";
const namespace = `salarié . convention collective . ${value}`;

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

/** Accord of 15 January 2026: textile industry, from 1 January 2026. */
const INDUSTRY_JANUARY: Record<string, number> = {
  "1": 1853, "2.1": 1856, "2.2": 1861, "2.3": 1869, "3.1": 1870, "3.2": 1874, "3.3": 1885,
  "4.1": 1887, "4.2": 1949, "4.3": 2031, "5.1": 2038, "5.2": 2092, "5.3": 2239, "6.1": 2250,
  "6.2": 2363, "6.3": 2553, "I.1": 2558, "I.2": 2854, "II": 3444, "III": 4179, "IV": 4911,
};

/** Accord of 12 January 2026: artificial and synthetic textiles, by coefficient. */
const ARTIFICIAL: Record<string, number> = {
  "210": 1857, "225": 1863, "240": 1868, "255": 1878, "270": 1888, "285": 1900, "300": 1912,
  "315": 1922, "330": 1932, "345": 2034, "360": 2170, "375": 2305, "390": 2437, "405": 2626,
  "420": 2765, "435": 2955, "450": 3145, "500": 3522, "600": 4390, "700": 5475, "800": 6780,
};

const ARTIFICIAL_SECTOR = "textiles artificiels et synthétiques";

function evaluate(engine: Engine, level: string | undefined, sector?: string, quota?: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    ...(sector === undefined ? {} : { [`${namespace} . secteur`]: `'${sector}'` }),
    ...(quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": quota }),
  });
  const amount = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof amount, "number");
  return {
    amount: Math.round((amount as number) * 100) / 100,
    outOfGrid: engine.evaluate(`${namespace} . niveau hors grille`).nodeValue,
  };
}

describe("IDCC 18 — 2026.2, grids of January 2026", async () => {
  const { version, engine } = await engineOf("2026.2");

  it("is in force from 1 January 2026, binds non-members from 17 April 2026 and cites both accords", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.equal(version.extension, "2026-04-17");
    for (const id of ["KALITEXT000054161832", "KALITEXT000053973002", "JORFTEXT000053907664", "JORFTEXT000053701332"]) {
      assert.ok(version.sources.some((source) => source.includes(id)), id);
    }
  });

  it("has 21 positions in each grid", () => {
    assert.equal(Object.keys(INDUSTRY_JANUARY).length, 21);
    assert.equal(Object.keys(ARTIFICIAL).length, 21);
  });

  for (const [level, monthly] of Object.entries(INDUSTRY_JANUARY)) {
    it(`textile industry, ${level}: ${monthly} € a month, the default sector`, () => {
      assert.deepEqual(evaluate(engine, level), { amount: monthly, outOfGrid: false });
      assert.deepEqual(evaluate(engine, level, "industrie textile"), { amount: monthly, outOfGrid: false });
    });
  }

  for (const [coefficient, monthly] of Object.entries(ARTIFICIAL)) {
    it(`artificial textiles, coefficient ${coefficient}: ${monthly} € a month`, () => {
      assert.deepEqual(evaluate(engine, coefficient, ARTIFICIAL_SECTOR), { amount: monthly, outOfGrid: false });
    });
  }

  it("keeps each classification to the grid of its sector", () => {
    assert.deepEqual(evaluate(engine, "4.2", ARTIFICIAL_SECTOR), { amount: 0, outOfGrid: true });
    assert.deepEqual(evaluate(engine, "300"), { amount: 0, outOfGrid: true });
    for (const coefficient of ["200", "460", "900", "non renseigné"]) {
      assert.equal(evaluate(engine, coefficient, ARTIFICIAL_SECTOR).outOfGrid, true, coefficient);
    }
    assert.equal(evaluate(engine, undefined, ARTIFICIAL_SECTOR).outOfGrid, true);
  });

  it("prorates the minimum once for part-time work", () => {
    assert.equal(evaluate(engine, "500", ARTIFICIAL_SECTOR, "50%").amount, 1761);
    assert.equal(evaluate(engine, "4.2", undefined, "50%").amount, 974.5);
  });
});

describe("IDCC 18 — 2026.3, grid of June 2026", async () => {
  const { version, engine } = await engineOf("2026.3");

  it("is in force from 1 June 2026, binds non-members from 4 September 2026 and flags its unverified grid", () => {
    assert.equal(version.validFrom, "2026-06-01");
    assert.equal(version.extension, "2026-09-04");
    assert.ok(version.sources.some((source) => source.includes("JORFTEXT000054794573")));
    assert.ok(version.sources.some((source) => source.includes("à vérifier")));
  });

  it("keeps the textile industry grid of 2026.1 and the artificial grid of January 2026", () => {
    assert.deepEqual(evaluate(engine, "1"), { amount: 1898, outOfGrid: false });
    assert.deepEqual(evaluate(engine, "4.2"), { amount: 1996, outOfGrid: false });
    assert.deepEqual(evaluate(engine, "IV"), { amount: 5029, outOfGrid: false });
    for (const [coefficient, monthly] of Object.entries(ARTIFICIAL)) {
      assert.deepEqual(evaluate(engine, coefficient, ARTIFICIAL_SECTOR), { amount: monthly, outOfGrid: false }, coefficient);
    }
  });

  it("leaves the rules inapplicable for another agreement", () => {
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "niveau hors grille", "secteur"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
