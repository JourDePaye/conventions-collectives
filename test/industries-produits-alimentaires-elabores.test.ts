import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1396-industries-produits-alimentaires-elabores";
const value = "industries de produits alimentaires élaborés";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === "2026.1");
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

const MONTHLY: Record<number, number> = {
  120: 1829.14, 125: 1836.72, 135: 1845.82, 145: 1856.44, 155: 1883.74, 165: 1906.49,
  175: 1938.34, 185: 1977.78, 195: 2030.86, 205: 2090.01, 215: 2137.03, 225: 2206.80,
  235: 2296.28, 245: 2382.74, 255: 2476.77, 265: 2572.32, 275: 2663.33, 285: 2754.33,
  295: 2842.30, 305: 2924.20, 315: 3000.03, 325: 3081.93, 335: 3160.80, 345: 3235.12,
};
const ANNUAL: Record<number, number> = {
  350: 39003.23, 355: 39386.19, 365: 40418.79, 375: 41512.14, 385: 42605.49, 395: 43658.38,
  405: 44834.68, 415: 45907.86, 425: 47021.35, 435: 48074.25, 445: 49127.14, 455: 50240.78,
  465: 51273.37, 475: 52346.57, 485: 53419.62, 495: 54492.81, 505: 55387.40, 515: 56440.29,
  525: 57513.49, 535: 58586.53, 545: 59619.13, 555: 60712.47, 565: 61765.36, 575: 62858.71,
  585: 63911.60, 595: 64964.49, 605: 66146.25, 615: 67178.85, 625: 68252.03, 635: 69325.09,
  645: 70377.98, 655: 71471.34, 665: 72504.06, 675: 73556.81, 685: 74690.74, 695: 75723.36,
  700: 76512.98,
};

function setSituation(coefficient: number | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(coefficient === undefined ? {} : { [`${namespace} . coefficient`]: coefficient }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function evaluate(rule: string) {
  const result = engine.evaluate(`${namespace} . ${rule}`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

const outOfGrid = () => engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue;

describe("IDCC 1396 — 2026.1 minimum salaries", () => {
  it("is in force from 1 February 2026 and cites the agreement and extension order", () => {
    assert.equal(version.validFrom, "2026-02-01");
    assert.ok(version.sources.some((source: string) => source.includes("Accord n° 123 du 30 janvier 2026")));
    assert.ok(version.sources.some((source: string) => source.includes("Arrêté du 8 avril 2026")));
    assert.ok(version.sources.some((source: string) => source.includes("TRST2609125A")));
  });

  it("has 24 monthly and 37 annual coefficients", () => {
    assert.equal(Object.keys(MONTHLY).length, 24);
    assert.equal(Object.keys(ANNUAL).length, 37);
  });

  for (const [coefficient, expected] of Object.entries(MONTHLY)) {
    it(`gives ${expected} € a month for coefficient ${coefficient}`, () => {
      setSituation(Number(coefficient));
      assert.equal(evaluate("salaire minimum conventionnel"), expected);
      assert.equal(evaluate("minimum mensuel"), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  for (const [coefficient, expected] of Object.entries(ANNUAL)) {
    it(`gives ${expected} € a year for cadre coefficient ${coefficient}`, () => {
      setSituation(Number(coefficient));
      assert.ok(Math.abs(evaluate("salaire minimum conventionnel") - expected / 12) < 0.011);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates monthly and annual minimums once for part-time work", () => {
    setSituation(225, "50%");
    assert.equal(evaluate("salaire minimum conventionnel"), 1103.4);
    setSituation(350, "80%");
    assert.equal(evaluate("salaire minimum conventionnel"), 2600.22);
  });

  it("rejects coefficients outside the published grid", () => {
    for (const coefficient of [0, 121, 130, 340, 351, 360, 710]) {
      setSituation(coefficient);
      assert.equal(outOfGrid(), true, String(coefficient));
      assert.equal(evaluate("salaire minimum conventionnel"), 0, String(coefficient));
    }
  });

  it("reports a missing coefficient as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(evaluate("salaire minimum conventionnel"), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation(225);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, null);
  });
});
