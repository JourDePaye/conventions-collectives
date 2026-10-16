import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1267-patisserie";
const value = "pâtisserie";
const namespace = `salarié . convention collective . ${value}`;

async function engineOf(revision: string) {
  const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === revision);
  assert.ok(version, revision);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  return { engine, version };
}

// Monthly minimums for 151.67 hours, copied from annex 1 of avenants n° 112 and n° 114.
const GRID_2025: Record<number, number> = {
  160: 1841.27, 165: 1851.89, 170: 1873.12, 175: 1885.26, 180: 1906.49, 185: 1965.64, 190: 2011.14, 200: 2096.08,
  210: 2203.77, 220: 2308.42, 250: 2620.86, 270: 2828.65, 290: 3040.98, 310: 3250.29, 330: 3461.11, 350: 3670.41,
};
const GRID_2026: Record<number, number> = {
  160: 1863.37, 165: 1874.11, 170: 1895.6, 175: 1907.88, 180: 1929.37, 185: 1989.23, 190: 2035.28, 200: 2121.23,
  210: 2230.21, 220: 2336.12, 250: 2652.31, 270: 2862.59, 290: 3077.48, 310: 3289.29, 330: 3502.64, 350: 3714.46,
};

for (const [revision, grid, validFrom, sourceIds] of [
  ["2025.1", GRID_2025, "2025-01-01", ["KALITEXT000051537691", "KALICONT000005635611"]],
  ["2026.1", GRID_2026, "2026-01-01", ["KALITEXT000054066586", "KALICONT000005635611"]],
] as const) {
  describe(`IDCC 1267 ${revision} minimum salaries`, async () => {
    const { engine, version } = await engineOf(revision);
    function setSituation(coefficient: number, quota = "100%") {
      engine.setSituation({
        "salarié . convention collective": `'${value}'`,
        [`${namespace} . coefficient`]: coefficient,
        "salarié . contrat . temps de travail . quotité": quota,
      });
    }
    function minimum() {
      const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
      assert.equal(typeof result, "number");
      return Math.round((result as number) * 100) / 100;
    }
    it("is effective on the date of the extended avenant", () => {
      assert.equal(version.validFrom, validFrom);
      for (const id of sourceIds) assert.ok(version.sources.some((source) => source.includes(id)), id);
    });
    for (const [coefficient, expected] of Object.entries(grid)) {
      it(`gives ${expected} € a month for coefficient ${coefficient}`, () => {
        setSituation(Number(coefficient));
        assert.equal(minimum(), expected);
        assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, false);
      });
    }
    it("prorates the monthly minimum once for part-time work", () => {
      setSituation(220, "50%");
      assert.equal(minimum(), Math.round(grid[220]! * 50) / 100);
    });
    it("rejects coefficients outside the grid", () => {
      for (const coefficient of [0, 100, 159, 161, 195, 351, 400]) {
        setSituation(coefficient);
        assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true, String(coefficient));
        assert.equal(minimum(), 0, String(coefficient));
      }
    });
    it("leaves the extension inapplicable for another agreement", () => {
      engine.setSituation({ "salarié . convention collective": "'non renseigné'", [`${namespace} . coefficient`]: 220 });
      assert.notEqual(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, grid[220]);
    });
  });
}

describe("IDCC 1267 version history", () => {
  it("publishes 2025.1 then 2026.1 with the +1.2 % revaluation", () => {
    const revisions = (COMPILED_VERSIONS[agreement] ?? []).map((entry) => entry.version);
    assert.deepEqual(revisions, ["2025.1", "2026.1"]);
    assert.equal(GRID_2026[160], 1863.37);
    assert.equal(GRID_2026[350], 3714.46);
  });
});
