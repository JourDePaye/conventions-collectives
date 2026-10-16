import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3205-cooperatives-consommateurs";
const value = "coopératives de consommateurs";
const namespace = `salarié . convention collective . ${value}`;

// Avenants n° 932 (KALITEXT000054303994), 933 (KALITEXT000054872346) and 934 (KALITEXT000054982101),
// article 2, 151,67 h a month; amounts hard-coded from the texts on Légifrance.
const GRIDS: Record<string, { validFrom: string; grid: Record<string, number> }> = {
  "2026.1": {
    validFrom: "2026-02-01",
    grid: { "1": 1823.5, "2": 1874.69, "3": 1897.4, "4": 1913.76, "5": 1943.37, "6": 2017.88, "7": 2162.02, "8a": 2511.04, "8b": 2658.6, "9a": 2779.33, "9b": 3634.24 },
  },
  "2026.2": {
    validFrom: "2026-05-01",
    grid: { "1": 1824, "2": 1880.31, "3": 1903.09, "4": 1919.5, "5": 1949.2, "6": 2023.93, "7": 2168.51, "8a": 2518.57, "8b": 2666.58, "9a": 2787.67, "9b": 3645.14 },
  },
  "2026.3": {
    validFrom: "2026-07-01",
    grid: { "1": 1867.5, "2": 1889.71, "3": 1912.61, "4": 1929.1, "5": 1958.95, "6": 2034.05, "7": 2179.35, "8a": 2531.16, "8b": 2679.91, "9a": 2801.61, "9b": 3663.37 },
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
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  return { engine, version };
}

function situation(engine: Engine, groupe: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(groupe === undefined ? {} : { [`${namespace} . groupe`]: `'${groupe}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}
function minimum(engine: Engine) {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 3205 coopératives de consommateurs", () => {
  it("has one version per salary step, with its own effective date", () => {
    const versions = COMPILED_VERSIONS[agreement];
    assert.deepEqual(versions?.map((v) => [v.version, v.validFrom]), [["2026.1", "2026-02-01"], ["2026.2", "2026-05-01"], ["2026.3", "2026-07-01"]]);
  });

  for (const [revision, { validFrom, grid }] of Object.entries(GRIDS)) {
    describe(`version ${revision}`, () => {
      it("cites the extended avenant and applies from its effective date", async () => {
        const { version } = await engineOf(revision);
        assert.equal(version.validFrom, validFrom);
        assert.ok(version.sources.some((source) => source.includes("KALITEXT0000")));
      });
      for (const [groupe, expected] of Object.entries(grid)) {
        it(`gives ${expected} € a month for group ${groupe}`, async () => {
          const { engine } = await engineOf(revision);
          situation(engine, groupe);
          assert.equal(minimum(engine), expected);
          assert.equal(engine.evaluate(`${namespace} . groupe hors grille`).nodeValue, false);
        });
      }
      it("covers the 11 groups 1 to 9b", () => {
        assert.deepEqual(Object.keys(grid), ["1", "2", "3", "4", "5", "6", "7", "8a", "8b", "9a", "9b"]);
      });
    });
  }

  it("prorates the monthly minimum once for part-time work", async () => {
    const { engine } = await engineOf("2026.3");
    situation(engine, "5", "50%");
    assert.equal(minimum(engine), 979.48);
    situation(engine, "9b", "80%");
    assert.equal(minimum(engine), 2930.7);
  });

  it("rejects groups outside the grid", async () => {
    const { engine } = await engineOf("2026.3");
    for (const key of ["0", "10", "8", "9", "8c", "12", "non renseigné"]) {
      situation(engine, key);
      assert.equal(engine.evaluate(`${namespace} . groupe hors grille`).nodeValue, true, key);
      assert.equal(minimum(engine), 0, key);
    }
    situation(engine, undefined);
    assert.equal(engine.evaluate(`${namespace} . groupe hors grille`).nodeValue, true);
  });

  it("leaves the extension inapplicable for another agreement", async () => {
    const { engine } = await engineOf("2026.3");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
