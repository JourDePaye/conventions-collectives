import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

// Hard-coded from article 2 of avenant n° 100 du 3 mars 2026 (KALITEXT000054337506):
// coefficient -> minimum for 0-3, 3-6, 6-9, 9-12, 12-15, over 15 years of seniority (151,67 h).
const GRID: Record<number, number[]> = {
  115: [1841, 1864, 1887, 1911, 1934, 1957],
  118: [1852, 1875, 1899, 1922, 1945, 1969],
  123: [1863, 1887, 1911, 1935, 1959, 1983],
  130: [1911, 1936, 1961, 1986, 2011, 2036],
  138: [1921, 1947, 1973, 1999, 2025, 2052],
  143: [1929, 1956, 1983, 2010, 2037, 2064],
  155: [1942, 1971, 1999, 2028, 2056, 2085],
  170: [1986, 2017, 2048, 2078, 2109, 2139],
  180: [2045, 2077, 2109, 2141, 2173, 2205],
  190: [2092, 2125, 2158, 2192, 2225, 2258],
  200: [2154, 2189, 2223, 2258, 2293, 2328],
  212: [2240, 2276, 2313, 2349, 2386, 2422],
  220: [2285, 2322, 2360, 2398, 2435, 2473],
  255: [2532, 2574, 2617, 2659, 2702, 2744],
  290: [2783, 2830, 2878, 2925, 2972, 3019],
  310: [2923, 2973, 3023, 3073, 3123, 3173],
  330: [3054, 3106, 3159, 3212, 3265, 3317],
  370: [3564, 3622, 3681, 3739, 3797, 3856],
  440: [3633, 3701, 3769, 3837, 3905, 3973],
  480: [3899, 3973, 4046, 4120, 4194, 4267],
  520: [4170, 4249, 4328, 4407, 4486, 4566],
  560: [4441, 4526, 4611, 4695, 4780, 4865],
};
const COLUMN_YEARS = [0, 3, 6, 9, 12, 15];

const agreement = "1607-jeux-jouets";
const value = "jeux jouets articles fêtes ornements noël puériculture voitures enfants modélisme";
const namespace = `salarié . convention collective . ${value}`;

async function engineOf(revision: string) {
  const version = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === revision);
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  return { version, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
}

function minimum(engine: Engine, coefficient: number, years?: number, quota = "100%"): number {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . coefficient`]: coefficient,
    ...(years === undefined ? {} : { [`${namespace} . ancienneté en années`]: `${years} an` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

for (const [revision, validFrom] of [["2026.3", "2026-04-01"], ["2026.4", "2026-07-01"]] as const) {
  describe(`IDCC 1607 — ${revision} full seniority grid`, async () => {
    const { version, engine } = await engineOf(revision);

    it(`has validFrom ${validFrom}, same as the revision it supersedes, and cites avenant n° 100`, () => {
      assert.equal(version.validFrom, validFrom);
      assert.ok(version.sources.some((source: string) => source.includes("KALITEXT000054337506")));
      assert.ok(version.sources.some((source: string) => source.includes("Arrêté du 20 mai 2026")));
    });

    it("gives the 0-3 years column when seniority is not provided", () => {
      assert.equal(minimum(engine, 560), 4441);
      assert.equal(minimum(engine, 115), 1841);
    });

    for (const [coefficient, amounts] of Object.entries(GRID)) {
      amounts.forEach((expected, column) => {
        it(`coefficient ${coefficient}, seniority column ${column}: ${expected} €`, () => {
          assert.equal(minimum(engine, Number(coefficient), (COLUMN_YEARS[column] ?? 0) + (column === 0 ? 1 : 0)), expected);
        });
      });
    }

    it("switches column at each seniority threshold (coefficient 560)", () => {
      const expected: Array<[number, number]> = [
        [2.9, 4441], [3, 4526], [5.9, 4526], [6, 4611], [9, 4695], [12, 4780], [14.9, 4780], [15, 4865], [30, 4865],
      ];
      for (const [years, amount] of expected) assert.equal(minimum(engine, 560, years), amount, `${years} years`);
    });

    it("prorates the minimum once for part-time work", () => {
      assert.equal(minimum(engine, 200, 4, "50%"), 1094.5);
      assert.equal(minimum(engine, 200, 0, "80%"), 1723.2);
    });

    it("reports coefficients outside the grid", () => {
      for (const coefficient of [114, 561, 0]) {
        assert.equal(minimum(engine, coefficient, 10), 0);
        assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true, String(coefficient));
      }
      assert.equal(minimum(engine, 200, 10) > 0, true);
      assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, false);
    });
  });
}

describe("IDCC 1607 — 2026.4 keeps the training contribution of 2026.2", async () => {
  const { engine } = await engineOf("2026.4");
  it("applies the contribution by workforce band", () => {
    for (const [effectif, expected] of [[9, 18], [10, 33], [299, 33], [300, 36]] as const) {
      engine.setSituation({
        "salarié . convention collective": `'${value}'`,
        [`${namespace} . coefficient`]: 200,
        "salarié . cotisations . assiette": "3000 €/mois",
        "entreprise . salariés . effectif": effectif,
      });
      assert.equal(Math.round((engine.evaluate("salarié . cotisations . formation professionnelle").nodeValue as number) * 100) / 100, expected, String(effectif));
    }
  });
});
