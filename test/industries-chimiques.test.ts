import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0044-industries-chimiques";
const value = "industries chimiques";
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

/** Monthly minimum salaries for 35 hours, accord of 3 December 2025. */
const GRID: Record<number, number> = {
  130: 1877.13,
  140: 1898.37,
  150: 1924.18,
  160: 1941.34,
  175: 1984.24,
  190: 2020.24,
  205: 2049.34,
  225: 2061.68,
  235: 2132.51,
  250: 2244.51,
  275: 2438.11,
  300: 2658.27,
  325: 2878.27,
  350: 3096.78,
  360: 3184.97,
  400: 3537.54,
  460: 4065.12,
  480: 4244.43,
  510: 4504.35,
  550: 4859.46,
  660: 5826.82,
  770: 6800.05,
  880: 7764.57,
};

/** Calculation coefficients of the accord: the minimum is (reference salary + (K - 100) points) × it. */
const CALCULATION: Record<number, number> = {
  130: 0.888, 140: 0.862, 150: 0.84, 160: 0.816, 175: 0.79, 190: 0.764, 205: 0.738, 225: 0.698,
  235: 0.701, 250: 0.707, 275: 0.718, 300: 0.735, 325: 0.75, 350: 0.763, 360: 0.768, 400: 0.786,
  460: 0.808, 480: 0.815, 510: 0.823, 550: 0.834, 660: 0.857, 770: 0.875, 880: 0.888,
};

function setSituation(coefficient: number | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(coefficient === undefined ? {} : { [`${namespace} . coefficient`]: coefficient }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

const outOfGrid = () => engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue;

describe("IDCC 44 — 2026.1 minimum salaries", () => {
  it("is in force from 1 January 2026 and cites the accord and its extension order", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 3 décembre 2025")));
    assert.ok(version.sources.some((source) => source.includes("arrêté du 16 février 2026")));
  });

  it("has 23 coefficients", () => {
    assert.equal(Object.keys(GRID).length, 23);
  });

  it("is consistent with the reference salary and value of the accord", () => {
    for (const [coefficient, expected] of Object.entries(GRID)) {
      const formula = (1848.69 + (Number(coefficient) - 100) * 8.84) * CALCULATION[Number(coefficient)]!;
      assert.equal(Math.round(formula * 100) / 100, expected, coefficient);
    }
  });

  for (const [coefficient, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for coefficient ${coefficient}`, () => {
      setSituation(Number(coefficient));
      assert.equal(minimum(), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setSituation(250, "50%");
    assert.equal(minimum(), 1122.26);
    setSituation(400, "80%");
    assert.equal(minimum(), 2830.03);
  });

  it("rejects coefficients outside the grid", () => {
    for (const coefficient of [0, 100, 120, 135, 170, 230, 500, 881, 1000]) {
      setSituation(coefficient);
      assert.equal(outOfGrid(), true, `${coefficient}`);
      assert.equal(minimum(), 0, `${coefficient}`);
    }
  });

  it("reports a missing coefficient as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(minimum(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation(250);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, null);
  });
});
