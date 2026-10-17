import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

// Amounts read in article 3 of each regional accord of early 2026, all in force on 1 January 2026
// (BFC and Grand Est: first column, values at 1 January 2026; Sud PACA et Corse: second column,
// accord of 11 March 2026). Level 1 has two échelons, levels 2 to 7 have three.
const model = "3249-carrieres-materiaux";
const value = "carrières et matériaux de construction";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[model]?.find((entry) => entry.version === "2026.3");
assert.ok(version);
const released = version;

const KEYS = ["1.1", "1.2", "2.1", "2.2", "2.3", "3.1", "3.2", "3.3", "4.1", "4.2", "4.3", "5.1", "5.2", "5.3", "6.1", "6.2", "6.3", "7.1", "7.2", "7.3"];

const GRIDS: Record<string, number[]> = {
  // KALITEXT000054825928
  "Auvergne-Rhône-Alpes": [1876, 1885, 1896, 1918, 1971, 1982, 2014, 2071, 2081, 2114, 2186, 2188, 2254, 2405, 2447, 2536, 2733, 2784, 2948, 3207],
  // KALITEXT000054454616
  "Bourgogne-Franche-Comté": [1836, 1879, 1897, 1930, 1974, 1986, 2025, 2067, 2081, 2122, 2178, 2188, 2262, 2394, 2435, 2536, 2711, 2766, 2940, 3169],
  // KALITEXT000054802237
  "Bretagne": [1852, 1861, 1865, 1893, 1943, 1963, 1983, 2039, 2048, 2082, 2148, 2159, 2222, 2371, 2409, 2500, 2691, 2744, 2905, 3157],
  // KALITEXT000054371003
  "Centre-Val de Loire": [1825, 1867, 1874, 1896, 1949, 1963, 1988, 2043, 2059, 2088, 2157, 2170, 2231, 2377, 2423, 2511, 2701, 2761, 2920, 3168],
  // KALITEXT000054262441
  "Grand Est": [1839, 1877, 1884, 1913, 1955, 1963, 2006, 2047, 2058, 2108, 2164, 2171, 2254, 2387, 2431, 2539, 2718, 2770, 2955, 3191],
  // KALITEXT000054337826
  "Hauts-de-France": [1856, 1872, 1874, 1915, 1951, 1960, 1991, 2046, 2056, 2092, 2159, 2165, 2236, 2380, 2422, 2517, 2708, 2761, 2929, 3179],
  // KALITEXT000054337807
  "Île-de-France": [1840, 1866, 1874, 1903, 1957, 1969, 2000, 2060, 2069, 2104, 2178, 2187, 2252, 2409, 2451, 2546, 2748, 2814, 2975, 3240],
  // KALITEXT000054304128
  "Normandie": [1828, 1843, 1862, 1879, 1918, 1928, 1949, 1995, 2020, 2059, 2118, 2133, 2207, 2342, 2355, 2485, 2666, 2695, 2903, 3142],
  // KALITEXT000054337788
  "Nouvelle-Aquitaine": [1832, 1850, 1864, 1886, 1936, 1950, 1980, 2030, 2044, 2077, 2143, 2158, 2223, 2370, 2418, 2512, 2699, 2767, 2932, 3191],
  // KALITEXT000054454633
  "Occitanie": [1862, 1886, 1894, 1923, 1980, 1989, 2020, 2080, 2090, 2127, 2201, 2206, 2274, 2399, 2439, 2533, 2735, 2791, 2959, 3223],
  // KALITEXT000054304146
  "Pays de la Loire": [1855, 1861, 1878, 1900, 1951, 1967, 1994, 2048, 2063, 2093, 2164, 2174, 2237, 2385, 2431, 2516, 2710, 2769, 3043, 3169],
  // KALITEXT000054802256
  "Sud PACA et Corse": [1863, 1926, 1933, 1962, 2018, 2027, 2058, 2116, 2128, 2160, 2234, 2241, 2308, 2465, 2501, 2597, 2797, 2851, 3021, 3283],
};

async function makeEngine() {
  const extension = await released.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...new Set([...choice["une possibilité"], value])],
  } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

function situation(region: string, classification: string, extra: Record<string, unknown> = {}) {
  return {
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . région`]: `'${region}'`,
    [`${namespace} . niveau et échelon`]: `'${classification}'`,
    ...extra,
  } as Record<string, string>;
}

describe("IDCC 3249 revision 2026.3 (twelve regional accords of 2026)", () => {
  it("applies from 1 January 2026, like the revisions it supersedes", () => {
    assert.equal(released.validFrom, "2026-01-01");
  });

  for (const [region, amounts] of Object.entries(GRIDS)) {
    it(`${region}: evaluates the 20 sourced minimums`, async () => {
      const engine = await makeEngine();
      assert.equal(amounts.length, KEYS.length);
      KEYS.forEach((classification, index) => {
        engine.setSituation(situation(region, classification));
        assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, amounts[index], classification);
        assert.equal(engine.evaluate(`${namespace} . niveau et échelon hors grille`).nodeValue, false, classification);
      });
    });
  }

  it("keeps the Île-de-France grid of revision 2026.2", async () => {
    const engine = await makeEngine();
    engine.setSituation(situation("Île-de-France", "7.2"));
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2975);
  });

  it("flags classifications outside the grid of a covered region", async () => {
    const engine = await makeEngine();
    for (const key of ["1.3", "8.1", "0.1", "non renseigné"]) {
      engine.setSituation(situation("Bretagne", key));
      assert.equal(engine.evaluate(`${namespace} . niveau et échelon hors grille`).nodeValue, true, key);
    }
  });

  it("has no minimum and no out-of-grid check outside the regional accords", async () => {
    const engine = await makeEngine();
    for (const region of ["hors champ", "non renseigné"]) {
      engine.setSituation(situation(region, "5.2"));
      assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null, region);
      assert.equal(engine.evaluate(`${namespace} . niveau et échelon hors grille`).nodeValue, null, region);
    }
  });

  it("prorates the minimum for part-time work", async () => {
    const engine = await makeEngine();
    engine.setSituation(situation("Occitanie", "5.2", { "salarié . contrat . temps de travail . quotité": "80%" }));
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1819.2);
  });
});
