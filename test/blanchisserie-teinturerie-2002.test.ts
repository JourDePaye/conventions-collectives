import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2002-blanchisserie-teinturerie";
const value = "blanchisserie teinturerie";
const namespace = `salarié . convention collective . ${value}`;

async function engineOf(revision: string) {
  const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === revision);
  assert.ok(version, revision);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  return { version, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
}

// Amounts copied from article 1er of each avenant (base 35 hours, euros per month).
const GRIDS: Record<string, { validFrom: string; kali: string; grid: Record<string, number> }> = {
  "2025.1": {
    validFrom: "2025-01-01",
    kali: "KALITEXT000051694901",
    grid: {
      "1-1": 1801.80, "2-1": 1817.62, "2-2": 1833.73, "2-3": 1858.93, "3-1": 1864.65, "3-2": 1890.40, "4-1": 1944.28,
      A1: 1801.80, A2: 1806.54, A3: 1817.19, B1: 1834.43, B2: 1843.81, B3: 1860.00, C1: 1876.23,
      "5-1": 1963.18, "5-2": 2067.84, "6-1": 2190.96, C2: 1866.77, C3: 1891.92, D1: 2133.98, D2: 2161.39,
      "7-1": 2583.79, "8-1": 3414.42, "9-1": 3793.09,
    },
  },
  "2026.1": {
    validFrom: "2026-01-01",
    kali: "KALITEXT000054303889",
    grid: {
      "1-1": 1823.03, "2-1": 1839.07, "2-2": 1855.37, "2-3": 1880.87, "3-1": 1886.65, "3-2": 1912.71, "4-1": 1967.22,
      A1: 1823.03, A2: 1827.86, A3: 1838.63, B1: 1856.08, B2: 1865.57, B3: 1881.95, C1: 1898.37,
      "5-1": 1986.35, "5-2": 2092.24, "6-1": 2216.81, C2: 1888.80, C3: 1914.24, D1: 2159.16, D2: 2186.89,
      "7-1": 2614.28, "8-1": 3454.71, "9-1": 3837.85,
    },
  },
};

describe("IDCC 2002 blanchisserie-teinturerie minimum salaries", () => {
  for (const [revision, { validFrom, kali, grid }] of Object.entries(GRIDS)) {
    describe(revision, async () => {
      const { version, engine } = await engineOf(revision);
      const minimum = (classification: string, quota = "100%") => {
        engine.setSituation({
          "salarié . convention collective": `'${value}'`,
          [`${namespace} . classification`]: `'${classification}'`,
          "salarié . contrat . temps de travail . quotité": quota,
        });
        const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
        assert.equal(typeof result, "number");
        return Math.round((result as number) * 100) / 100;
      };
      const outOfGrid = () => engine.evaluate(`${namespace} . classification hors grille`).nodeValue;

      it("has the legal effective date and sources", () => {
        assert.equal(version.validFrom, validFrom);
        assert.ok(version.sources.some((source) => source.includes(kali)));
      });
      for (const [classification, expected] of Object.entries(grid)) {
        it(`gives ${expected} for ${classification}`, () => {
          assert.equal(minimum(classification), expected);
          assert.equal(outOfGrid(), false);
        });
      }
      it("prorates once for part-time work", () => {
        assert.equal(minimum("5-1", "50%"), Math.round(grid["5-1"]! * 50) / 100);
      });
      it("flags classifications absent from the grid", () => {
        for (const classification of ["0-1", "10-1", "E1", "2-4", "non renseigné"]) {
          assert.equal(minimum(classification), 0);
          assert.equal(outOfGrid(), true, classification);
        }
      });
    });
  }

  it("has two consecutive versions, the 2026 one effective from 1 January 2026", () => {
    const versions = COMPILED_VERSIONS[agreement]?.map((entry) => entry.version);
    assert.deepEqual(versions, ["2025.1", "2026.1"]);
  });
  it("part-time 2026: 2-2 at 80 % gives 1484.30", async () => {
    const { engine } = await engineOf("2026.1");
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . classification`]: "'2-2'",
      "salarié . contrat . temps de travail . quotité": "80%",
    });
    const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue as number;
    assert.equal(Math.round(result * 100) / 100, 1484.30);
  });
});
