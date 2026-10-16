import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "0759-pompes-funebres";
const ns = "salarié . convention collective . pompes funèbres";

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((candidate) => candidate.version === "2020.4");
  assert.ok(version, "IDCC 759 must be exported");
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], "pompes funèbres"],
  } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    salarié: "oui",
    dirigeant: "non",
    "salarié . convention collective": "'pompes funèbres'",
    [`${ns} . niveau`]: "'II'",
    [`${ns} . position`]: 1,
    [`${ns} . ancienneté dans l'emploi`]: 5,
    "salarié . contrat . temps de travail . quotité": "100%",
  });
  return engine;
}

const get = (engine: Engine, rule: string) => engine.evaluate(`${ns} . ${rule}`);

describe("IDCC 759 — 2020 salary minima", () => {
  it("applies the sourced level/position and seniority grid", async () => {
    const engine = await makeEngine();
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 1639);
  });

  it("uses the 25-year seniority amount for employees", async () => {
    const engine = await makeEngine();
    engine.setSituation({ salarié: "oui", dirigeant: "non", "salarié . convention collective": "'pompes funèbres'", [`${ns} . niveau`]: "'III'", [`${ns} . position`]: 2, [`${ns} . ancienneté dans l'emploi`]: 25, "salarié . contrat . temps de travail . quotité": "100%" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 1877);
  });

  it("uses the cadre three-year step and prorates by working time", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      salarié: "oui",
      dirigeant: "non",
      "salarié . convention collective": "'pompes funèbres'",
      [`${ns} . niveau`]: "'VII'",
      [`${ns} . position`]: 1,
      [`${ns} . ancienneté dans l'emploi`]: 4,
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 1924.5);
  });

  it("is unavailable for missing or out-of-grid classifications and outside the convention", async () => {
    const engine = await makeEngine();
    engine.setSituation({ [`${ns} . niveau`]: "'VIII'" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, null);
    engine.setSituation({ "salarié . convention collective": "'télécommunications'" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, null);
  });
});

// Amounts below are typed from the annexes on Légifrance (embauche, 3, 5, 10, 15, 20, 25 ans; cadres: embauche, 3 ans).
const STEPS = [0, 3, 5, 10, 15, 20, 25];
const GRIDS: Record<string, Record<string, number[]>> = {
  "2020": {
    "I.1": [1550, 1593, 1613, 1655, 1704, 1747, 1800],
    "II.1": [1573, 1621, 1639, 1676, 1728, 1771, 1823],
    "II.2": [1589, 1645, 1655, 1698, 1750, 1795, 1848],
    "III.1": [1612, 1661, 1672, 1715, 1768, 1812, 1867],
    "III.2": [1628, 1670, 1681, 1724, 1777, 1821, 1877],
    "IV.1": [1703, 1729, 1754, 1785, 1848, 1894, 1951],
    "IV.2": [1759, 1787, 1812, 1844, 1908, 1956, 2015],
    "V.1": [2184, 2201],
    "V.2": [2340, 2359],
    "VI.1": [2600, 2621],
    "VI.2": [3078, 3103],
    "VII.1": [3819, 3849],
  },
  "2021": {
    "I.1": [1569, 1613, 1633, 1676, 1725, 1768, 1822],
    "II.1": [1592, 1641, 1659, 1696, 1749, 1793, 1845],
    "II.2": [1609, 1665, 1676, 1719, 1771, 1817, 1871],
    "III.1": [1632, 1682, 1692, 1736, 1790, 1834, 1889],
    "III.2": [1648, 1690, 1702, 1746, 1799, 1843, 1900],
    "IV.1": [1723, 1751, 1776, 1807, 1871, 1917, 1975],
    "IV.2": [1781, 1809, 1834, 1867, 1932, 1980, 2039],
    "V.1": [2211, 2228],
    "V.2": [2369, 2388],
    "VI.1": [2632, 2653],
    "VI.2": [3116, 3141],
    "VII.1": [3865, 3896],
  },
  "2023": {
    "I.1": [1714, 1746, 1764, 1800, 1836, 1873, 1911],
    "II.1": [1728, 1763, 1781, 1817, 1854, 1892, 1930],
    "II.2": [1746, 1781, 1799, 1835, 1872, 1910, 1949],
    "III.1": [1763, 1799, 1817, 1854, 1892, 1930, 1969],
    "III.2": [1780, 1816, 1835, 1872, 1910, 1949, 1988],
    "IV.1": [1853, 1863, 1882, 1920, 1959, 1999, 2039],
    "IV.2": [1906, 1916, 1936, 1975, 2015, 2056, 2098],
    "V.1": [2311, 2358],
    "V.2": [2464, 2514],
    "VI.1": [2725, 2780],
    "VI.2": [3210, 3275],
    "VII.1": [3962, 4042],
  },
  "2024": {
    "I.1": [1800, 1854, 1873, 1911, 1950, 1989, 2029],
    "II.1": [1806, 1861, 1880, 1918, 1957, 1997, 2037],
    "II.2": [1825, 1880, 1899, 1937, 1976, 2016, 2057],
    "III.1": [1843, 1899, 1918, 1957, 1997, 2037, 2078],
    "III.2": [1861, 1917, 1937, 1976, 2016, 2057, 2099],
    "IV.1": [1937, 1996, 2016, 2057, 2099, 2141, 2184],
    "IV.2": [1992, 2052, 2073, 2115, 2158, 2202, 2247],
    "V.1": [2415, 2488],
    "V.2": [2575, 2653],
    "VI.1": [2848, 2934],
    "VI.2": [3355, 3456],
    "VII.1": [4141, 4266],
  },
  "2025": {
    "I.1": [1836, 1892, 1911, 1950, 1989, 2029, 2070],
    "II.1": [1843, 1899, 1918, 1957, 1997, 2037, 2078],
    "II.2": [1862, 1918, 1937, 1976, 2016, 2057, 2099],
    "III.1": [1880, 1937, 1957, 1997, 2037, 2078, 2120],
    "III.2": [1899, 1956, 1976, 2016, 2057, 2099, 2141],
    "IV.1": [1976, 2036, 2057, 2099, 2141, 2184, 2228],
    "IV.2": [2032, 2094, 2115, 2158, 2202, 2247, 2292],
    "V.1": [2464, 2538],
    "V.2": [2627, 2707],
    "VI.1": [2905, 2993],
    "VI.2": [3423, 3526],
    "VII.1": [4224, 4352],
  },
  "2026": {
    "I.1": [1864, 1921, 1940, 1980, 2019, 2060, 2102],
    "II.1": [1871, 1928, 1947, 1987, 2027, 2068, 2110],
    "II.2": [1890, 1947, 1967, 2006, 2047, 2088, 2131],
    "III.1": [1909, 1967, 1987, 2027, 2068, 2110, 2152],
    "III.2": [1928, 1986, 2006, 2047, 2088, 2131, 2174],
    "IV.1": [2006, 2067, 2088, 2131, 2174, 2217, 2262],
    "IV.2": [2063, 2126, 2147, 2191, 2236, 2281, 2327],
    "V.1": [2501, 2577],
    "V.2": [2667, 2748],
    "VI.1": [2949, 3038],
    "VI.2": [3475, 3579],
    "VII.1": [4288, 4418],
  },
};
const VERSIONS: Record<string, { grid: string; validFrom: string }> = {
  "2020.5": { grid: "2020", validFrom: "2020-01-01" },
  "2021.1": { grid: "2021", validFrom: "2021-01-01" },
  "2023.1": { grid: "2023", validFrom: "2023-01-01" },
  "2024.1": { grid: "2024", validFrom: "2024-01-01" },
  "2025.1": { grid: "2025", validFrom: "2025-01-01" },
  "2026.1": { grid: "2026", validFrom: "2026-01-01" },
};

async function engineFor(revision: string, niveau: string, position: number, anciennete: number, quotite = "100%") {
  const version = COMPILED_VERSIONS[id]?.find((candidate) => candidate.version === revision);
  assert.ok(version, revision);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "pompes funèbres"] } as Rule;
  Object.assign(rules, await version.loadRules());
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    salarié: "oui",
    dirigeant: "non",
    "salarié . convention collective": "'pompes funèbres'",
    [`${ns} . niveau`]: `'${niveau}'`,
    [`${ns} . position`]: position,
    [`${ns} . ancienneté dans l'emploi`]: anciennete,
    "salarié . contrat . temps de travail . quotité": quotite,
  });
  return engine;
}

describe("IDCC 759 — grids from 2020 to 2026", () => {
  it("has the effective dates of the texts", () => {
    for (const [revision, { validFrom }] of Object.entries(VERSIONS)) {
      assert.equal(COMPILED_VERSIONS[id]?.find((c) => c.version === revision)?.validFrom, validFrom, revision);
    }
  });

  for (const [revision, { grid }] of Object.entries(VERSIONS)) {
    it(`gives every cell of the ${grid} annex (${revision})`, async () => {
      for (const [key, values] of Object.entries(GRIDS[grid]!)) {
        const [niveau, position] = key.split(".") as [string, string];
        for (const [index, expected] of values.entries()) {
          const years = STEPS[index]!;
          const engine = await engineFor(revision, niveau, Number(position), years);
          assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, expected, `${revision} ${key} ${years} ans`);
        }
      }
    });
  }

  it("keeps the step values between two seniority thresholds", async () => {
    const engine = await engineFor("2026.1", "I", 1, 4);
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 1921);
    const cadre = await engineFor("2026.1", "VII", 1, 2);
    assert.equal(get(cadre, "salaire minimum conventionnel").nodeValue, 4288);
  });

  it("2020.5 gives level I.1 its seniority steps (2020.4 was flat at 1 550)", async () => {
    const engine = await engineFor("2020.5", "I", 1, 25);
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 1800);
  });

  it("prorates part time", async () => {
    const engine = await engineFor("2026.1", "VII", 1, 4, "50%");
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 2209);
    const other = await engineFor("2026.1", "IV", 2, 25, "80%");
    assert.equal(get(other, "salaire minimum conventionnel").nodeValue, 1861.6);
  });

  it("is unavailable out of the grid", async () => {
    for (const revision of Object.keys(VERSIONS)) {
      const engine = await engineFor(revision, "VIII", 1, 0);
      assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, null, revision);
      const noPosition = await engineFor(revision, "II", 3, 0);
      assert.equal(get(noPosition, "salaire minimum conventionnel").nodeValue, null, revision);
    }
  });
});
