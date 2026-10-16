import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

// Jeux traditionnels grids read in Légifrance, independently of the YAML:
// avenant n° 24 (KALITEXT000051447213) second column, avenant n° 25 (KALITEXT000054040443).
const agreement = "2257-casinos";
const value = "casinos";
const namespace = `salarié . convention collective . ${value}`;

const STEPS: Record<string, { validFrom: string; source: string; grid: Record<number, number> }> = {
  "2025.2": {
    validFrom: "2025-07-01",
    source: "KALITEXT000051447213",
    grid: { 100: 1827, 105: 1838, 110: 1848, 120: 1873, 130: 1888, 140: 2001, 150: 2144, 160: 2287, 170: 2430, 175: 2529, 180: 2591, 190: 2727, 200: 2892 },
  },
  "2026.1": {
    validFrom: "2026-04-01",
    source: "KALITEXT000054040443",
    grid: { 100: 1850, 105: 1860, 110: 1870, 120: 1896, 130: 1916, 140: 2031, 150: 2176, 160: 2321, 170: 2467, 175: 2567, 180: 2630, 190: 2768, 200: 2935 },
  },
};

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

function minimum(engine: Engine, indice: number | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(indice === undefined ? {} : { [`${namespace} . indice`]: indice }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 2257 — jeux traditionnels steps after avenant n° 24 first column", () => {
  for (const [revision, step] of Object.entries(STEPS)) {
    describe(revision, async () => {
      const { version, engine } = await engineOf(revision);

      it("records the effective date and source", () => {
        assert.equal(version.validFrom, step.validFrom);
        assert.ok(version.sources.some((source) => source.includes(step.source)));
      });

      for (const [indice, expected] of Object.entries(step.grid)) {
        it(`gives ${expected} € a month for index ${indice}`, () => {
          assert.equal(minimum(engine, Number(indice)), expected);
          assert.equal(engine.evaluate(`${namespace} . indice hors grille`).nodeValue, false);
        });
      }

      it("prorates once for part-time work", () => {
        assert.equal(minimum(engine, 140, "50%"), step.grid[140]! / 2);
        assert.equal(minimum(engine, 200, "80%"), Math.round(step.grid[200]! * 0.8 * 100) / 100);
      });

      it("rejects missing and unknown indices", () => {
        for (const indice of [115, 201]) {
          assert.equal(minimum(engine, indice), 0);
          assert.equal(engine.evaluate(`${namespace} . indice hors grille`).nodeValue, true);
        }
        assert.equal(minimum(engine, undefined), 0);
        assert.equal(engine.evaluate(`${namespace} . indice hors grille`).nodeValue, true);
      });
    });
  }

  it("keeps hard-coded boundary amounts of the legal texts", async () => {
    assert.equal(minimum((await engineOf("2025.2")).engine, 100), 1827);
    assert.equal(minimum((await engineOf("2025.2")).engine, 200), 2892);
    assert.equal(minimum((await engineOf("2026.1")).engine, 100), 1850);
    assert.equal(minimum((await engineOf("2026.1")).engine, 200), 2935);
  });

  it("orders the versions by effective date", () => {
    const versions = COMPILED_VERSIONS[agreement]!.map((entry) => `${entry.validFrom} ${entry.version}`).sort();
    assert.deepEqual(versions, ["2025-05-01 2025.1", "2025-07-01 2025.2", "2026-04-01 2026.1"]);
  });
});
