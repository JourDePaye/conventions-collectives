/**
 * IDCC 2332, version 2026.2: the point value of every territory in 2026. Expected values come from
 * the territorial accords on Légifrance (the accord in force on 1 January 2026, then the accord for
 * 2026 from the first day of the month after its extension's publication) and from the CCN
 * (article V.1.10 for the coefficients, V.2.1 for the minimum, XV.5.1 for the territories),
 * independently of the YAML.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2332-entreprises-architecture";
const value = "entreprises d'architecture";
const namespace = `salarié . convention collective . ${value}`;

const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.2");
assert.ok(version);
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, await version.loadRules());
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

type Situation = { department: string; coefficient?: number; date?: string; toulouse?: boolean; quota?: string };

function evaluate(rule: string, { department, coefficient = 300, date = "15/10/2026", toulouse, quota = "100%" }: Situation) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . département`]: `'${department}'`,
    [`${namespace} . coefficient`]: coefficient,
    ...(toulouse === undefined ? {} : { [`${namespace} . Toulouse Métropole`]: toulouse ? "oui" : "non" }),
    "salarié . contrat . temps de travail . quotité": quota,
    date,
  });
  return engine.evaluate(`${namespace} . ${rule}`).nodeValue;
}

const minimum = (situation: Situation) => {
  const result = evaluate("salaire minimum conventionnel", situation);
  return typeof result === "number" ? Math.round(result * 100) / 100 : result;
};
const round = (amount: number) => Math.round(amount * 100) / 100;

/** Départements of each territorial commission, article XV.5.1 of the CCN. */
const TERRITORIES: Record<string, string[]> = {
  Alsace: ["67", "68"],
  Aquitaine: ["24", "33", "40", "47", "64"],
  Auvergne: ["03", "15", "43", "63"],
  "Basse-Normandie": ["14", "50", "61"],
  Bourgogne: ["21", "58", "71", "89"],
  Bretagne: ["22", "29", "35", "56"],
  "Centre-Val de Loire": ["18", "28", "36", "37", "41", "45"],
  "Champagne-Ardenne": ["08", "10", "51", "52"],
  Corse: ["20", "2A", "2B"],
  "Franche-Comté": ["25", "39", "70", "90"],
  Guadeloupe: ["971"],
  Guyane: ["973"],
  "Haute-Normandie": ["27", "76"],
  "Île-de-France": ["75", "77", "78", "91", "92", "93", "94", "95"],
  "Languedoc-Roussillon": ["11", "30", "34", "48", "66"],
  Limousin: ["19", "23", "87"],
  Lorraine: ["54", "55", "57", "88"],
  Martinique: ["972"],
  Mayotte: ["976"],
  "Midi-Pyrénées": ["09", "12", "31", "32", "46", "65", "81", "82"],
  "Nord-Pas-de-Calais": ["59", "62"],
  "Pays de la Loire": ["44", "49", "53", "72", "85"],
  Picardie: ["02", "60", "80"],
  "Poitou-Charentes": ["16", "17", "79", "86"],
  "Provence-Alpes-Côte d'Azur": ["04", "05", "06", "13", "83", "84"],
  "La Réunion": ["974"],
  "Rhône-Alpes": ["01", "07", "26", "38", "42", "69", "73", "74"],
};

/**
 * Point values for the coefficients 200, 300, 400 and 600, in January 2026 (accord in force on
 * 1 January 2026) and in October 2026 (accord for 2026), with the territory's monthly floor.
 */
type Points = { points: [number, number, number, number]; floor?: number };
const POINTS: Record<string, { department: string; toulouse?: boolean; january: Points; october: Points }> = {
  // Accords of 27 March 2025 and 24 November 2025.
  Alsace: { department: "67", january: { points: [9, 9, 9, 9], floor: 1850 }, october: { points: [9.09, 9.09, 9.09, 9.09], floor: 1890 } },
  // 16 January 2025 and 1 December 2025.
  Aquitaine: { department: "33", january: { points: [9.19, 9.19, 9.19, 9.19] }, october: { points: [9.28, 9.28, 9.28, 9.28] } },
  // 20 January 2025 and 10 December 2025.
  Auvergne: { department: "63", january: { points: [9.11, 9.11, 9.11, 9.11] }, october: { points: [9.2, 9.2, 9.2, 9.2] } },
  // 21 January 2025 and 2 December 2025: 200 to 300, then from 320.
  "Basse-Normandie": { department: "14", january: { points: [9.25, 9.25, 9.03, 9.03] }, october: { points: [9.34, 9.34, 9.14, 9.14] } },
  // 29 January 2025 and 8 December 2025.
  Bourgogne: { department: "21", january: { points: [9.12, 9.12, 9.12, 9.12] }, october: { points: [9.21, 9.21, 9.21, 9.21] } },
  // 27 March 2025 (200-280, 300-380, 400-600) and 10 February 2026 (200-380, 400-600).
  Bretagne: { department: "35", january: { points: [9.13, 9, 8.88, 8.88] }, october: { points: [9.18, 9.18, 8.95, 8.95] } },
  // 28 February 2025 and 16 December 2025.
  "Centre-Val de Loire": { department: "45", january: { points: [9.04, 9.04, 9.04, 9.04] }, october: { points: [9.13, 9.13, 9.13, 9.13] } },
  // 27 February 2025 (floor 1 900 €) and 28 November 2025 (floor 1 950 €).
  "Champagne-Ardenne": { department: "51", january: { points: [8.96, 8.96, 8.96, 8.96], floor: 1900 }, october: { points: [9.05, 9.05, 9.05, 9.05], floor: 1950 } },
  // 20 January 2025 and 14 November 2025.
  Corse: { department: "20", january: { points: [9.13, 9.13, 9.13, 9.13] }, october: { points: [9.21, 9.21, 9.21, 9.21] } },
  // 28 November 2023 and 9 December 2025.
  "Franche-Comté": { department: "25", january: { points: [9, 9, 9, 9] }, october: { points: [9.18, 9.18, 9.18, 9.18] } },
  // 2 January 2025 and 23 February 2026 (200-280, 300-380, 400-600).
  Guadeloupe: { department: "971", january: { points: [9.05, 8.94, 8.84, 8.84] }, october: { points: [9.14, 9.03, 8.93, 8.93] } },
  // 30 December 2024 and 19 February 2026.
  Guyane: { department: "973", january: { points: [9.02, 8.9, 8.8, 8.8] }, october: { points: [9.11, 8.99, 8.89, 8.89] } },
  // 21 January 2025 and 2 December 2025: 200 to 300, then 320 to 600.
  "Haute-Normandie": { department: "76", january: { points: [9.25, 9.25, 9.03, 9.03] }, october: { points: [9.34, 9.34, 9.14, 9.14] } },
  // 29 January 2025 and 26 November 2025, zone 1 (75, 92, 93, 94).
  "Île-de-France": { department: "75", january: { points: [9.82, 9.66, 9.5, 9.5] }, october: { points: [9.95, 9.77, 9.59, 9.59] } },
  // 10 February 2025 and 8 January 2026: 200 to 300, then from 320.
  "Languedoc-Roussillon": { department: "34", january: { points: [9.07, 9.07, 8.85, 8.85] }, october: { points: [9.18, 9.18, 8.94, 8.94] } },
  // 10 January 2025 and 3 December 2025.
  Limousin: { department: "87", january: { points: [9.39, 9.39, 9.39, 9.39] }, october: { points: [9.48, 9.48, 9.48, 9.48] } },
  // 7 February 2025 and 7 November 2025.
  Lorraine: { department: "57", january: { points: [9.05, 9.05, 9.05, 9.05] }, october: { points: [9.15, 9.15, 9.15, 9.15] } },
  // 31 December 2024 and 20 February 2026.
  Martinique: { department: "972", january: { points: [9.05, 8.94, 8.84, 8.84] }, october: { points: [9.14, 9.03, 8.93, 8.93] } },
  // 28 January 2025 and 25 November 2025, outside Toulouse Métropole: up to 320, then above.
  "Midi-Pyrénées": { department: "31", toulouse: false, january: { points: [9.1, 9.1, 8.86, 8.86] }, october: { points: [9.24, 9.24, 8.99, 8.99] } },
  // 27 March 2025 (floor 1 860 €) and 20 November 2025 (floor 1 880 €).
  "Nord-Pas-de-Calais": { department: "59", january: { points: [8.98, 8.98, 8.98, 8.98], floor: 1860 }, october: { points: [9.07, 9.07, 9.07, 9.07], floor: 1880 } },
  // 12 February 2025 and 12 December 2025: 200 to 380, then 400 to 600.
  "Pays de la Loire": { department: "44", january: { points: [9.19, 9.19, 8.96, 8.96] }, october: { points: [9.28, 9.28, 9.06, 9.06] } },
  // 21 February 2025 (floor 1 900 €) and 14 January 2026 (floor 1 923 €).
  Picardie: { department: "80", january: { points: [8.85, 8.85, 8.85, 8.85], floor: 1900 }, october: { points: [8.94, 8.94, 8.94, 8.94], floor: 1923 } },
  // 13 January 2025 (200-360, above) and 21 January 2026 (200-360, 380-600).
  "Poitou-Charentes": { department: "86", january: { points: [9.01, 9.01, 8.95, 8.95] }, october: { points: [9.12, 9.12, 9.1, 9.1] } },
  // 10 December 2024 and 7 January 2026.
  "Provence-Alpes-Côte d'Azur": { department: "13", january: { points: [9.1, 9.1, 9.1, 9.1] }, october: { points: [9.19, 9.19, 9.19, 9.19] } },
  // 14 March 2025 and 16 March 2026.
  "La Réunion": { department: "974", january: { points: [8.76, 8.76, 8.76, 8.76] }, october: { points: [8.84, 8.84, 8.84, 8.84] } },
  // 11 February 2025 (floor 1 945 € in zone 1) and 3 February 2026 (no floor), zone 1.
  "Rhône-Alpes": { department: "69", january: { points: [9.13, 9.13, 9.13, 9.13], floor: 1945 }, october: { points: [9.21, 9.21, 9.21, 9.21] } },
};

const COEFFICIENTS = [200, 300, 400, 600] as const;

describe("IDCC 2332 — 2026.2, every territory", () => {
  it("applies from 1 January 2026 to every employer", () => {
    assert.equal(version.validFrom, "2026-01-01");
    for (const id of ["KALICONT000005635365", "KALITEXT000054040505", "KALITEXT000048994203", "KALITEXT000054872039"]) {
      assert.ok(version.sources.some((s) => s.includes(id)), id);
    }
  });

  it("finds the territory of every département", () => {
    for (const [territory, departments] of Object.entries(TERRITORIES)) {
      for (const department of departments) assert.equal(evaluate("territoire", { department }), territory, department);
    }
    assert.equal(evaluate("territoire", { department: "non renseigné" }), "hors territoire");
  });

  for (const [territory, { department, toulouse, january, october }] of Object.entries(POINTS)) {
    it(`${territory}: the accord in force in January, then the accord for 2026`, () => {
      for (const [date, { points, floor = 0 }] of [["15/01/2026", january], ["15/10/2026", october]] as const) {
        COEFFICIENTS.forEach((coefficient, i) => {
          const expected = Math.max(round(coefficient * points[i]!), floor);
          assert.equal(minimum({ department, coefficient, date, ...(toulouse === undefined ? {} : { toulouse }) }), expected, `${date} ${coefficient}`);
        });
      }
    });
  }

  it("changes the point value on the first day of the month after the extension's publication", () => {
    // JORF of 28 March 2026, 17 April 2026, 29 May 2026 and 9 July 2026.
    for (const [department, before, after, beforePoint, afterPoint] of [
      ["75", "31/03/2026", "01/04/2026", 9.66, 9.77],
      ["13", "30/04/2026", "01/05/2026", 9.1, 9.19],
      ["35", "31/05/2026", "01/06/2026", 9, 9.18],
      ["974", "31/07/2026", "01/08/2026", 8.76, 8.84],
    ] as const) {
      assert.equal(minimum({ department, date: before }), round(300 * beforePoint), department);
      assert.equal(minimum({ department, date: after }), round(300 * afterPoint), department);
    }
  });

  it("applies the zones of Île-de-France, Rhône-Alpes and Midi-Pyrénées", () => {
    // Île-de-France zone 2 (77, 78, 91, 95): 9,85, 9,68 and 9,49 from 1 April 2026.
    for (const department of ["77", "78", "91", "95"]) {
      assert.equal(minimum({ department, coefficient: 200 }), 1970, department);
      assert.equal(minimum({ department, coefficient: 300 }), 2904, department);
      assert.equal(minimum({ department, coefficient: 400 }), 3796, department);
    }
    for (const department of ["92", "93", "94"]) assert.equal(minimum({ department, coefficient: 200 }), 1990, department);
    // Rhône-Alpes zone 2 (07, 26, 42): 9,02 with a floor of 1 892 € in January, 9,10 from 1 June.
    for (const department of ["07", "26", "42"]) {
      assert.equal(minimum({ department, coefficient: 200, date: "15/01/2026" }), 1892, department);
      assert.equal(minimum({ department, coefficient: 300, date: "15/01/2026" }), 2706, department);
      assert.equal(minimum({ department, coefficient: 200 }), 1820, department);
    }
    for (const department of ["01", "38", "73", "74"]) assert.equal(minimum({ department, coefficient: 200 }), 1842, department);
    // Toulouse Métropole (CUTM): 9,20 and 8,97 in January, 9,27 and 9,04 from 1 April.
    assert.equal(minimum({ department: "31", toulouse: true, coefficient: 320, date: "15/01/2026" }), 2944);
    assert.equal(minimum({ department: "31", toulouse: true, coefficient: 340, date: "15/01/2026" }), 3049.8);
    assert.equal(minimum({ department: "31", toulouse: true, coefficient: 320 }), 2966.4);
    assert.equal(minimum({ department: "31", toulouse: true, coefficient: 340 }), 3073.6);
    assert.equal(minimum({ department: "31", coefficient: 320 }), 2956.8);
  });

  it("prorates the minimum by the working time", () => {
    assert.equal(minimum({ department: "75", coefficient: 300, quota: "50%" }), 1465.5);
    assert.equal(minimum({ department: "59", coefficient: 200, quota: "50%" }), 940);
  });

  it("has no minimum in Mayotte, nor without a département", () => {
    for (const department of ["976", "non renseigné"]) {
      assert.equal(minimum({ department }), 0, department);
      assert.equal(evaluate("zone hors accord", { department }), true, department);
      assert.equal(evaluate("coefficient hors grille", { department, coefficient: 210 }), false, department);
    }
    assert.equal(evaluate("zone hors accord", { department: "75" }), false);
  });

  it("accepts the coefficients of the grid only", () => {
    for (let coefficient = 200; coefficient <= 600; coefficient += 20) {
      assert.equal(evaluate("coefficient hors grille", { department: "75", coefficient }), false, String(coefficient));
    }
    for (const coefficient of [0, 190, 210, 250, 620, 1000]) {
      assert.equal(evaluate("coefficient hors grille", { department: "75", coefficient }), true, String(coefficient));
    }
  });
});
