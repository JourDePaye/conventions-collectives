import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1586-industries-charcutieres";
const value = "industries charcutières";
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

/** Monthly minimum salaries for 35 hours, article 1 of the accord of 16 January 2026. */
const GRID: Record<number, number> = {
  125: 1835.6, 130: 1840.9, 135: 1846.3, 140: 1852.6,
  145: 1857.9, 150: 1863.3, 155: 1868.6, 160: 1880.3, 165: 1901.5,
  170: 1912.1, 175: 1945.8, 180: 1978.5, 185: 2012.2, 190: 2043.7, 195: 2078.5,
  200: 2130.2, 205: 2151.3, 210: 2173.5, 215: 2197.7, 220: 2228.2, 225: 2265.1,
  230: 2301.9, 235: 2338.9, 240: 2376.8, 245: 2412.6, 250: 2448.4, 255: 2486.4,
  260: 2525.4, 265: 2562.3, 270: 2601.3, 275: 2639.2, 280: 2677.2, 285: 2713.1, 290: 2753.1, 295: 2790.0,
  300: 2827.8, 305: 2864.8, 310: 2902.7, 315: 2941.8, 320: 2979.6, 325: 3017.6, 330: 3052.4, 335: 3092.4,
  340: 3129.3, 345: 3168.3,
  350: 3319.7, 400: 3580.1, 600: 5014.7, 700: 5763.4,
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

describe("IDCC 1586 — 2026.1 minimum salaries", () => {
  it("is in force from 1 February 2026 and cites the accord and its extension order", () => {
    assert.equal(version.validFrom, "2026-02-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 16 janvier 2026")));
    assert.ok(version.sources.some((source) => source.includes("arrêté du 14 avril 2026")));
    assert.ok(version.sources.some((source) => source.includes("TRST2609134A")));
  });

  it("has 49 coefficients: 45 from 125 to 345 in steps of 5, and 350, 400, 600, 700", () => {
    assert.equal(Object.keys(GRID).length, 49);
  });

  for (const [coefficient, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for coefficient ${coefficient}`, () => {
      setSituation(Number(coefficient));
      assert.equal(minimum(), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setSituation(200, "50%");
    assert.equal(minimum(), 1065.1);
    setSituation(350, "80%");
    assert.equal(minimum(), 2655.76);
  });

  it("rejects coefficients outside the grid", () => {
    for (const coefficient of [0, 100, 124, 126, 346, 351, 399, 500, 701, 800]) {
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
    setSituation(200);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, null);
  });
});
