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
    version: "2026.1",
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

describe("IDCC 1987 2026.1: prime de vacances", () => {
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
