import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

/**
 * Grids of the revisions that bring an agreement up to date with a later salary text. The amounts
 * are those of the official Légifrance text named in each entry, not read from the YAML files.
 */
type Update = {
  model: string;
  version: string;
  validFrom: string;
  value: string;
  input: string;
  /** Rule evaluated for each entry of the grid, under the agreement's namespace. */
  rule: string;
  /** Text of the official source. */
  source: string;
  grid: Record<string, number>;
  /** True when the classification is a text such as "2.1" rather than a number. */
  text?: boolean;
  /** Other inputs of the situation, under the agreement's namespace. */
  situation?: Record<string, string>;
};

const UPDATES: Update[] = [
  {
    model: "0959-laboratoires-biologie-medicale",
    version: "2026.1",
    validFrom: "2026-06-01",
    value: "laboratoires biologie médicale",
    input: "coefficient",
    rule: "minimum mensuel de la grille",
    source: "KALITEXT000054951894",
    grid: {
      135: 1871.61, 150: 1873.12, 160: 1874.64, 170: 1876.16, 180: 1877.67, 200: 1879.19, 210: 1880.71,
      220: 1888.29, 230: 1903.46, 240: 1912.56, 250: 1971.71, 260: 2032.38, 270: 2090.01, 280: 2147.65,
      290: 2208.32, 300: 2232.58, 310: 2306.9, 350: 2599.62, 400: 2811.96, 500: 3517.22, 600: 4225.52,
      800: 5636.05,
    },
  },
  {
    model: "1659-rouissage-teillage-lin",
    version: "2025.1",
    validFrom: "2025-03-01",
    value: "rouissage teillage lin",
    input: "coefficient",
    rule: "salaire minimum conventionnel . grille",
    source: "KALITEXT000051664798",
    grid: {
      120: 1876.16, 125: 1914.08, 130: 1926.21, 140: 1936.83, 150: 2005.08, 160: 2039.96, 170: 2080.91,
      190: 2170.4, 240: 2239.37, 270: 2461.72, 300: 2616.89, 400: 3263.89, 500: 3999.03, 600: 4633.87,
    },
  },
  {
    model: "1987-pates-alimentaires-seches",
    version: "2026.3",
    validFrom: "2026-01-01",
    value: "pâtes alimentaires sèches et couscous non préparé",
    input: "coefficient",
    rule: "salaire minimum horaire",
    source: "KALITEXT000054337523",
    grid: {
      135: 12.08, 140: 12.17, 145: 12.2, 150: 12.22, 155: 12.29, 160: 12.33, 165: 12.38, 170: 12.5,
      175: 12.55, 180: 12.6, 185: 12.65, 190: 12.7, 195: 12.84, 200: 13.02, 210: 13.51, 220: 13.97,
      230: 14.45, 240: 14.91, 250: 15.38, 260: 15.8, 270: 16.26, 280: 16.7, 290: 17.16, 300: 17.61,
      310: 18.08, 320: 18.52, 330: 18.98, 340: 19.45, 350: 19.91, 400: 22.22, 500: 26.87, 600: 31.49,
    },
  },
  {
    // Signed copy published by the GASPE; the protocol is not on Légifrance nor in the BOCC.
    model: "3228-groupement-armateurs-passages-eau",
    version: "2023.1",
    validFrom: "2023-04-01",
    value: "groupement armateurs passages eau",
    input: "fonction",
    rule: "salaire minimum conventionnel",
    source: "Accord%20NAO%20branche%20CCN%203228%20-%202023.pdf",
    text: true,
    grid: {
      "capitaines et chefs mécaniciens 16e catégorie ENIM": 3292.45,
      "capitaines et chefs mécaniciens 15e catégorie ENIM": 2838.32,
      "capitaines et chefs mécaniciens 12e catégorie ENIM": 2533.48,
      "capitaines chefs mécaniciens moins de 200 ums 12e catégorie ENIM": 2446.05,
      "patrons de vedettes inférieures à 50 ums": 1935.08,
      "maîtres pont et machine": 1876.42,
      "mécaniciens ouvriers mécaniciens timoniers": 1802.99,
      "matelots qualifiés graisseurs": 1751.79,
      "matelots matelots légers": 1731.94,
    },
  },
  {
    // Signed copy published by the GASPE; the protocol is not on Légifrance nor in the BOCC.
    model: "3228-groupement-armateurs-passages-eau",
    version: "2024.1",
    validFrom: "2024-01-01",
    value: "groupement armateurs passages eau",
    input: "fonction",
    rule: "salaire minimum conventionnel",
    source: "Accord%20NAO%20branche%20CCN%203228%20-%202024.pdf",
    text: true,
    grid: {
      "capitaines et chefs mécaniciens 16e catégorie ENIM": 3424.15,
      "capitaines et chefs mécaniciens 15e catégorie ENIM": 2951.85,
      "capitaines et chefs mécaniciens 12e catégorie ENIM": 2634.82,
      "capitaines chefs mécaniciens moins de 200 ums 12e catégorie ENIM": 2543.9,
      "patrons de vedettes inférieures à 50 ums": 2012.48,
      "maîtres pont et machine": 1951.48,
      "mécaniciens ouvriers mécaniciens timoniers": 1875.11,
      "matelots qualifiés graisseurs": 1821.86,
      "matelots matelots légers": 1801.22,
    },
  },
  {
    model: "3228-groupement-armateurs-passages-eau",
    version: "2025.1",
    validFrom: "2025-01-01",
    value: "groupement armateurs passages eau",
    input: "fonction",
    rule: "salaire minimum conventionnel",
    source: "KALITEXT000052133151",
    text: true,
    grid: {
      "capitaines et chefs mécaniciens 16e catégorie ENIM": 3471.74,
      "capitaines et chefs mécaniciens 15e catégorie ENIM": 2992.88,
      "capitaines et chefs mécaniciens 12e catégorie ENIM": 2671.44,
      "capitaines chefs mécaniciens moins de 200 ums 12e catégorie ENIM": 2579.26,
      "patrons de vedettes inférieures à 50 ums": 2040.45,
      "maîtres pont et machine": 1978.6,
      "mécaniciens ouvriers mécaniciens timoniers": 1901.18,
      "matelots qualifiés graisseurs": 1847.19,
      "matelots matelots légers": 1826.25,
    },
  },
  {
    model: "3228-groupement-armateurs-passages-eau",
    version: "2026.1",
    validFrom: "2026-01-01",
    value: "groupement armateurs passages eau",
    input: "fonction",
    rule: "salaire minimum conventionnel",
    source: "KALITEXT000054872417",
    text: true,
    grid: {
      "capitaines et chefs mécaniciens 16e catégorie ENIM": 3512.71,
      "capitaines et chefs mécaniciens 15e catégorie ENIM": 3028.2,
      "capitaines et chefs mécaniciens 12e catégorie ENIM": 2702.96,
      "capitaines chefs mécaniciens moins de 200 ums 12e catégorie ENIM": 2609.69,
      "patrons de vedettes inférieures à 50 ums": 2064.53,
      "maîtres pont et machine": 2001.95,
      "mécaniciens ouvriers mécaniciens timoniers": 1923.61,
      "matelots qualifiés graisseurs": 1868.98,
      "matelots matelots légers": 1847.8,
    },
  },
  {
    model: "0468-commerce-succursaliste-chaussure",
    version: "2025.1",
    validFrom: "2025-01-01",
    value: "commerce succursaliste de la chaussure",
    input: "niveau et échelon",
    rule: "salaire minimum conventionnel . grille",
    source: "KALITEXT000051294879",
    text: true,
    grid: {
      "1": 1808.88, "2.1": 1811.49, "2.2": 1816.75, "3.1": 1820.97, "3.2": 1844.16, "4.1": 1865.24,
      "4.2": 1875.78, "5.1": 1908.44, "5.2": 1918.98, "6": 2068.64, "7": 2286.81,
    },
  },
  {
    model: "0468-commerce-succursaliste-chaussure",
    version: "2025.1",
    validFrom: "2025-01-01",
    value: "commerce succursaliste de la chaussure",
    input: "niveau et échelon",
    rule: "rémunération minimum annuelle conventionnelle . grille",
    source: "KALITEXT000051294879",
    text: true,
    grid: { "8": 29428, "8.2": 30755, "9": 32747, "9.2": 34740, "10": 37174, "11": 41601, "12": 47133 },
  },
  {
    model: "0468-commerce-succursaliste-chaussure",
    version: "2026.1",
    validFrom: "2026-08-01",
    value: "commerce succursaliste de la chaussure",
    input: "niveau et échelon",
    rule: "salaire minimum conventionnel . grille",
    source: "boc_20260030_0000_0003",
    text: true,
    grid: {
      "1": 1867.02, "2.1": 1869.63, "2.2": 1874.9, "3.1": 1879.11, "3.2": 1888.6, "4.1": 1910.19,
      "4.2": 1920.98, "5.1": 1954.43, "5.2": 1965.23, "6": 2118.5, "7": 2341.92,
    },
  },
  {
    model: "0468-commerce-succursaliste-chaussure",
    version: "2026.1",
    validFrom: "2026-08-01",
    value: "commerce succursaliste de la chaussure",
    input: "niveau et échelon",
    rule: "rémunération minimum annuelle conventionnelle . grille",
    source: "boc_20260030_0000_0003",
    text: true,
    grid: { "8": 30017, "8.2": 31370, "9": 33402, "9.2": 35435, "10": 37918, "11": 42433, "12": 48075 },
  },
  {
    // Avenant n° 45, column from 1 October 2024; replaces version 2024.1, whose grid was wrong.
    model: "1631-hotellerie-plein-air",
    version: "2024.2",
    validFrom: "2024-11-01",
    value: "hôtellerie de plein air",
    input: "coefficient",
    rule: "salaire minimum conventionnel . grille",
    source: "KALITEXT000049438808",
    grid: {
      100: 1800.86, 105: 1828.06, 110: 1855.26, 115: 1882.46, 120: 1909.66, 125: 1936.86, 130: 1964.06,
      135: 1991.26, 140: 2018.46, 145: 2045.66, 150: 2072.86, 155: 2100.06, 160: 2127.26, 165: 2154.46,
      170: 2181.66, 175: 2208.86, 180: 2236.06, 185: 2263.26, 190: 2290.46, 195: 2317.66, 200: 2344.86,
      205: 2372.06, 210: 2399.26, 215: 2426.46, 220: 2453.66, 225: 2480.86, 230: 2508.06, 235: 2535.26,
      240: 2562.46, 245: 2589.66, 250: 2616.86, 255: 2644.06, 260: 2671.26, 265: 2698.46, 270: 2725.66,
      275: 2752.86, 280: 2780.06, 285: 2807.26, 290: 2834.46, 295: 2861.66, 300: 2888.86,
    },
  },
  {
    // Avenant n° 46, first column.
    model: "1631-hotellerie-plein-air",
    version: "2025.1",
    validFrom: "2025-04-01",
    value: "hôtellerie de plein air",
    input: "coefficient",
    rule: "salaire minimum conventionnel . grille",
    source: "KALITEXT000051314765",
    grid: {
      100: 1836.88, 105: 1864.33, 110: 1891.78, 115: 1919.23, 120: 1946.68, 125: 1974.13, 130: 2001.58,
      135: 2029.03, 140: 2056.48, 145: 2083.93, 150: 2111.38, 155: 2138.83, 160: 2166.28, 165: 2193.73,
      170: 2221.18, 175: 2248.63, 180: 2276.08, 185: 2303.53, 190: 2330.98, 195: 2358.43, 200: 2385.88,
      205: 2413.33, 210: 2440.78, 215: 2468.23, 220: 2495.68, 225: 2523.13, 230: 2550.58, 235: 2578.03,
      240: 2605.48, 245: 2632.93, 250: 2660.38, 255: 2687.83, 260: 2715.28, 265: 2742.73, 270: 2770.18,
      275: 2797.63, 280: 2825.08, 285: 2852.53, 290: 2879.98, 295: 2907.43, 300: 2934.88,
    },
  },
  {
    // Avenant n° 46, column from 1 October 2025.
    model: "1631-hotellerie-plein-air",
    version: "2025.2",
    validFrom: "2025-10-01",
    value: "hôtellerie de plein air",
    input: "coefficient",
    rule: "salaire minimum conventionnel . grille",
    source: "KALITEXT000051314765",
    grid: {
      100: 1836.88, 105: 1864.73, 110: 1892.58, 115: 1920.43, 120: 1948.28, 125: 1976.13, 130: 2003.98,
      135: 2031.83, 140: 2059.68, 145: 2087.53, 150: 2115.38, 155: 2143.23, 160: 2171.08, 165: 2198.93,
      170: 2226.78, 175: 2254.63, 180: 2282.48, 185: 2310.33, 190: 2338.18, 195: 2366.03, 200: 2393.88,
      205: 2421.73, 210: 2449.58, 215: 2477.43, 220: 2505.28, 225: 2533.13, 230: 2560.98, 235: 2588.83,
      240: 2616.68, 245: 2644.53, 250: 2672.38, 255: 2700.23, 260: 2728.08, 265: 2755.93, 270: 2783.78,
      275: 2811.63, 280: 2839.48, 285: 2867.33, 290: 2895.18, 295: 2923.03, 300: 2950.88,
    },
  },
  {
    model: "1631-hotellerie-plein-air",
    version: "2026.1",
    validFrom: "2026-05-01",
    value: "hôtellerie de plein air",
    input: "coefficient",
    rule: "salaire minimum conventionnel . grille",
    source: "KALIARTI000054092148",
    grid: Object.fromEntries(
      Object.entries({
        100: 1858.92, 105: 1887.07, 110: 1915.22, 120: 1971.52, 130: 2027.82, 140: 2084.12, 150: 2140.42,
        160: 2196.72, 170: 2253.02, 180: 2309.32, 190: 2365.62, 200: 2421.92, 210: 2478.22, 220: 2534.52,
        230: 2590.82, 240: 2647.12, 250: 2703.42, 260: 2759.72, 270: 2816.02, 280: 2872.32, 290: 2928.62,
        300: 2984.92, 310: 3041.22, 320: 3097.52, 330: 3153.82, 340: 3210.12, 350: 3266.42, 360: 3322.72,
        370: 3379.02, 380: 3435.32, 390: 3491.62, 400: 3547.92, 410: 3604.22, 420: 3660.52, 430: 3716.82,
        440: 3773.12, 450: 3829.42, 460: 3885.72, 470: 3942.02, 480: 3998.32, 490: 4054.62, 500: 4110.92,
        510: 4167.22, 520: 4223.52, 530: 4279.82, 540: 4336.12, 550: 4392.42, 560: 4448.72, 570: 4505.02,
        580: 4561.32, 590: 4617.62, 600: 4673.92, 610: 4730.22, 620: 4786.52, 630: 4842.82, 640: 4899.12,
        650: 4955.42, 660: 5011.72, 670: 5068.02, 680: 5124.32, 690: 5180.62, 700: 5236.92,
      }).map(([key, amount]) => [key, amount]),
    ),
  },
  {
    // Rebuilt from the IDCC 1612 agreement (travail aérien, personnel navigant des essais et
    // réceptions); version 2024.1 described another agreement.
    model: "1612-transport-aerien-personnel-navigant",
    version: "2024.2",
    validFrom: "2024-01-01",
    value: "personnel navigant technique hélicoptères",
    input: "classification",
    rule: "salaire minimum conventionnel",
    source: "KALIARTI000050130292",
    text: true,
    grid: {
      "PEX 1": 5757, "PEX 2": 6334, "PEX 3": 7199, "PEX 4": 8060, "PEX 5": 8633,
      "INE-A 1": 5388, "INE-A 2": 6194, "INE-A 3": 7004, "INE-A 4": 7810, "INE-A 5": 8344,
      "ENA-A 1": 3648, "ENA-A 2": 4196, "ENA-A 3": 4742, "ENA-A 4": 5300, "ENA-A 5": 5648,
      "PE 1": 4612, "PE 2": 5076, "PE 3": 5717, "PE 4": 6454, "PE 5": 6914,
      "ENE-B 1": 3603, "ENE-B 2": 4143, "ENE-B 3": 4683, "ENE-B 4": 5221, "ENE-B 5": 5582,
    },
  },
  {
    model: "1679-inspection-assurance",
    version: "2026.1",
    validFrom: "2026-01-01",
    value: "inspection assurance",
    input: "classe",
    rule: "grille annuelle",
    source: "KALITEXT000054887714",
    text: true,
    grid: { "5": 35500, "6": 45030, "7": 62560 },
    situation: { "date de calcul": "01/10/2026" },
  },
];

/** Yearly RMA texts of IDCC 1679 from 2008 to 2025 (Légifrance), classes 5, 6 and 7 in euros per year. */
const RMA_1679: [string, string, number, number, number][] = [
  ["2008", "KALITEXT000019652438", 27750, 36630, 51120],
  ["2009", "KALITEXT000021180854", 28370, 37440, 52250],
  ["2010", "KALITEXT000023175797", 28890, 38120, 53200],
  ["2011", "KALITEXT000024769836", 29470, 38890, 54270],
  ["2012", "KALITEXT000026383056", 30090, 39710, 55410],
  ["2013", "KALITEXT000028465771", 30400, 40110, 55970],
  ["2014", "KALITEXT000029361310", 30620, 40400, 56370],
  ["2015", "KALITEXT000031284455", 30780, 40610, 56660],
  ["2016", "KALITEXT000033196798", 30940, 40820, 56950],
  ["2017", "KALITEXT000035677627", 31190, 41150, 57410],
  ["2018", "KALITEXT000037651968", 31510, 41570, 57990],
  ["2019", "KALITEXT000039191674", 31890, 41870, 58400],
  ["2020", "KALITEXT000042312633", 32090, 42040, 58640],
  ["2021", "KALITEXT000044091288", 32290, 42210, 58880],
  ["2022", "KALITEXT000046478078", 33100, 42970, 59940],
  ["2023", "KALITEXT000048044307", 34100, 43830, 61140],
  ["2024", "KALITEXT000050140803", 34860, 44490, 62060],
  ["2025", "KALITEXT000052226917", 35210, 44670, 62310],
];
for (const [year, source, classe5, classe6, classe7] of RMA_1679) {
  UPDATES.push({
    model: "1679-inspection-assurance",
    version: `${year}.1`,
    validFrom: `${year}-01-01`,
    value: "inspection assurance",
    input: "classe",
    rule: "salaire minimum annuel conventionnel",
    source,
    text: true,
    grid: { "5": classe5, "6": classe6, "7": classe7 },
    situation: { "date de calcul": `01/06/${year}` },
  });
}

async function engineOf(update: Update) {
  const version = COMPILED_VERSIONS[update.model]?.find((entry) => entry.version === update.version);
  assert.ok(version, `${update.model}.${update.version}`);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...new Set([...choice["une possibilité"], update.value])],
  } as Rule;
  Object.assign(rules, await version.loadRules());
  return { version, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
}

for (const update of UPDATES) {
  describe(`${update.model} ${update.version}: grid of ${update.source}`, () => {
    const namespace = `salarié . convention collective . ${update.value}`;

    it("takes effect on its sourced date and cites its official text", async () => {
      const { version } = await engineOf(update);
      assert.equal(version.validFrom, update.validFrom);
      assert.ok(version.sources.some((source) => source.includes(update.source)));
    });

    it("gives the amount of every classification of the official grid", async () => {
      const { engine } = await engineOf(update);
      for (const [key, amount] of Object.entries(update.grid)) {
        engine.setSituation({
          "salarié . convention collective": `'${update.value}'`,
          [`${namespace} . ${update.input}`]: update.text ? `'${key}'` : Number(key),
          ...Object.fromEntries(Object.entries(update.situation ?? {}).map(([name, v]) => [`${namespace} . ${name}`, v])),
          "salarié . contrat . statut cadre": "non",
        });
        const value = engine.evaluate(`${namespace} . ${update.rule}`).nodeValue as number;
        assert.equal(Math.round(value * 100) / 100, amount, `${update.input} ${key}`);
      }
    });
  });
}

describe("IDCC 1987 2026.3: prime de vacances", () => {
  it("is 600 € per year from the accord of 5 March 2026", async () => {
    const { engine } = await engineOf(UPDATES[2]!);
    const namespace = "salarié . convention collective . pâtes alimentaires sèches et couscous non préparé";
    engine.setSituation({ "salarié . convention collective": `'${UPDATES[2]!.value}'`, [`${namespace} . coefficient`]: 135 });
    assert.equal(engine.evaluate(`${namespace} . prime vacances`).nodeValue, 600);
    assert.equal(engine.evaluate(`${namespace} . indemnité journalière de poste`).nodeValue, 5.2);
    assert.equal(engine.evaluate(`${namespace} . panier de nuit`).nodeValue, 11);
  });
});

describe("IDCC 1612 2024.2: classifications outside the annex", () => {
  it("rejects the codes of the former version and unknown echelons", async () => {
    const update = UPDATES.find((entry) => entry.model === "1612-transport-aerien-personnel-navigant")!;
    const { engine } = await engineOf(update);
    const namespace = `salarié . convention collective . ${update.value}`;
    for (const classification of ["FTR1-1", "PEX 6", "PEX", "non renseigné"]) {
      engine.setSituation({
        "salarié . convention collective": `'${update.value}'`,
        [`${namespace} . classification`]: `'${classification}'`,
      });
      assert.equal(engine.evaluate(`${namespace} . classification hors grille`).nodeValue, true, classification);
      assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0, classification);
    }
  });
});

describe("IDCC 3228 2022.2: source of the protocol of 14 March 2022", () => {
  it("cites the protocol of the agreement and keeps the grid of 2022.1", async () => {
    const versions = COMPILED_VERSIONS["3228-groupement-armateurs-passages-eau"]!;
    const fixed = versions.find((entry) => entry.version === "2022.2")!;
    const former = versions.find((entry) => entry.version === "2022.1")!;
    assert.equal(fixed.validFrom, "2022-01-01");
    assert.ok(fixed.sources.some((source) => source.includes("KALITEXT000045976880")));
    assert.ok(!fixed.sources.some((source) => source.includes("KALITEXT000046565704")));
    assert.deepEqual(await fixed.loadRules(), await former.loadRules());
  });
});
