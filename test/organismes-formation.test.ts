import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1516-organismes-formation";
const value = "organismes de formation";
const namespace = `salarié . convention collective . ${value}`;

/**
 * Minimum annual gross salaries by level (palier) and coefficient range, base annual full-time
 * working time: article 2 of the avenant of 18 November 2024 (2025) and article 2 of the
 * avenant of 17 April 2026 (2027). The monthly minimum is one twelfth of the annual one
 * (article 4 of the avenant of 4 February 2026).
 */
const GRID: readonly (readonly [palier: number, from: number, to: number | undefined, y2025: number, y2027: number])[] = [
  [1, 100, 109, 22090.38, 22532.19],
  [2, 110, 119, 22144.23, 22587.11],
  [3, 120, 132, 22249.43, 22694.42],
  [4, 133, 144, 22277.49, 22723.04],
  [5, 145, 157, 22356.12, 22803.24],
  [6, 158, 170, 22405.82, 22853.94],
  [7, 171, 185, 22561.42, 23012.65],
  [8, 186, 199, 23927.99, 24406.55],
  [9, 200, 206, 24703.1, 25197.16],
  [10, 207, 213, 25603.23, 26115.29],
  [11, 214, 219, 26443.55, 26972.42],
  [12, 220, 226, 27163.83, 27707.11],
  [13, 227, 233, 28004.14, 28564.22],
  [14, 234, 239, 28844.47, 29421.36],
  [15, 240, 245, 29564.74, 30156.03],
  [16, 246, 251, 30285.0, 30890.7],
  [17, 252, 257, 31005.28, 31625.39],
  [18, 258, 263, 31725.55, 32360.06],
  [19, 264, 269, 32445.82, 33094.74],
  [20, 270, 277, 33166.09, 33829.41],
  [21, 278, 285, 34126.45, 34808.98],
  [22, 286, 293, 34917.32, 35615.67],
  [23, 294, 301, 35611.83, 36324.07],
  [24, 302, 309, 36560.59, 37291.8],
  [25, 310, 349, 37094.03, 37650.44],
  [26, 350, 399, 41173.35, 41790.95],
  [27, 400, 449, 46727.08, 47427.99],
  [28, 450, 499, 52024.52, 52804.89],
  [29, 500, 549, 57551.01, 58414.28],
  [30, 550, 599, 63077.51, 64023.67],
  [31, 600, undefined, 68604.01, 69633.07],
];

const VERSIONS = [
  { number: "2025.1", validFrom: "2025-01-01", column: 3 as const },
  { number: "2027.1", validFrom: "2027-01-01", column: 4 as const },
];

async function engineOf(versionNumber: string) {
  const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === versionNumber);
  assert.ok(version, versionNumber);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], value],
  } as Rule;
  Object.assign(rules, extension);
  return { version, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
}

function setSituation(engine: Engine, coefficient: number, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . coefficient`]: coefficient,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum(engine: Engine): number {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return result as number;
}

const outOfGrid = (engine: Engine) => engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue;

describe("IDCC 1516 — the grid in this test", () => {
  it("has 31 levels with contiguous coefficient ranges starting at 100", () => {
    assert.equal(GRID.length, 31);
    let next = 100;
    for (const [palier, from, to] of GRID) {
      assert.equal(from, next, `level ${palier}`);
      next = (to ?? from) + 1;
    }
  });

  it("revalues the 2025 grid by 2 % up to level 24 and by 1.5 % above, for 2027", () => {
    // Guards the transcription of both grids against each other.
    for (const [palier, , , y2025, y2027] of GRID) {
      const expected = Math.round(y2025 * (palier <= 24 ? 1.02 : 1.015) * 100) / 100;
      assert.ok(Math.abs(expected - y2027) < 0.005, `level ${palier}`);
    }
  });
});

for (const { number, validFrom, column } of VERSIONS) {
  describe(`IDCC 1516 — ${number} minimum salaries`, async () => {
    const { version, engine } = await engineOf(number);

    it(`is in force from ${validFrom} and cites its avenant and extension order`, () => {
      assert.equal(version.validFrom, validFrom);
      assert.ok(version.sources.some((source) => source.includes("TRST2612715A")), "avenant of 4 February 2026");
      const order = number === "2025.1" ? "TSST2505903A" : "TRST2618256A";
      assert.ok(version.sources.some((source) => source.includes(order)), order);
    });

    for (const row of GRID) {
      const [palier, from, to] = row;
      const annual = row[column];
      const coefficients = to === undefined ? [600, 601, 850, 1000] : [from, to];
      it(`level ${palier}: ${annual} € a year for coefficients ${coefficients.join(", ")}`, () => {
        for (const coefficient of coefficients) {
          setSituation(engine, coefficient);
          assert.ok(Math.abs(minimum(engine) - annual / 12) < 1e-9, `coefficient ${coefficient}`);
          assert.equal(outOfGrid(engine), false, `coefficient ${coefficient}`);
        }
      });
    }

    it("rejects coefficients below 100", () => {
      for (const coefficient of [0, 1, 50, 99]) {
        setSituation(engine, coefficient);
        assert.equal(outOfGrid(engine), true, `coefficient ${coefficient}`);
        assert.equal(minimum(engine), 0, `coefficient ${coefficient}`);
      }
    });

    it("prorates the minimum once for part-time work", () => {
      // Level 15 (coefficient 240).
      const annual = GRID[14]![column];
      setSituation(engine, 240, "50%");
      assert.ok(Math.abs(minimum(engine) - annual / 24) < 1e-9);
      setSituation(engine, 240, "80%");
      assert.ok(Math.abs(minimum(engine) - (annual / 12) * 0.8) < 1e-9);
    });

    it("leaves the extension inapplicable for another agreement", () => {
      setSituation(engine, 240);
      engine.setSituation({ "salarié . convention collective": "'droit commun'" });
      assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
      assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, null);
    });
  });
}
