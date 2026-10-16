import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3252-entreprises-creation-evenement";
const value = "entreprises au service de la création et de l'événement";
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
const engines = {
  "2025.1": await engineOf("2025.1"),
  "2025.2": await engineOf("2025.2"),
  "2025.3": await engineOf("2025.3"),
  "2026.1": await engineOf("2026.1"),
};
type Revision = keyof typeof engines;

function evaluate(revision: Revision, rule: string, situation: Record<string, string | number> = {}) {
  const { engine } = engines[revision];
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    "salarié . contrat . temps de travail . quotité": "100%",
    ...Object.fromEntries(Object.entries(situation).map(([name, v]) => [`${namespace} . ${name}`, v])),
  });
  return engine.evaluate(`${namespace} . ${rule}`).nodeValue;
}
const round2 = (x: unknown) => Math.round((x as number) * 100) / 100;
function minimum(revision: Revision, level: string, seniority = 0, quota = "100%") {
  const { engine } = engines[revision];
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    "salarié . contrat . temps de travail . quotité": quota,
    [`${namespace} . classification`]: `'${level}'`,
    [`${namespace} . ancienneté cumulée sur le poste`]: `${seniority} an`,
  });
  return round2(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue);
}

// Amounts copied from the articles 7.3 (KALIARTI000050299456, KALIARTI000051948357) and annexe 1 of avenant n° 7.
const GRIDS: Record<Revision, Record<string, [number, number, number]>> = {
  "2025.1": { "1": [1801, 1855, 1945], "2": [1851, 1907, 1999], "3": [2007, 2067, 2168], "4": [2222, 2289, 2400], "5": [2420, 2492, 2613], "6": [2535, 2611, 2738], "7": [2712, 2794, 2929], "8": [2937, 3025, 3172], "9": [3163, 3258, 3416], "10": [3377, 3479, 3648] },
  "2025.2": { "1": [1802, 1855, 1945], "2": [1851, 1907, 1999], "3": [2007, 2067, 2168], "4": [2222, 2289, 2400], "5": [2420, 2492, 2613], "6": [2535, 2611, 2738], "7": [2712, 2794, 2929], "8": [2937, 3025, 3172], "9": [3163, 3258, 3416], "10": [3377, 3479, 3648] },
  "2025.3": { "1": [1802, 1855, 1945], "2": [1851, 1907, 1999], "3": [2007, 2067, 2168], "4": [2222, 2289, 2400], "5": [2420, 2492, 2613], "6": [2535, 2611, 2738], "7": [2712, 2794, 2929], "8": [2937, 3025, 3172], "9": [3163, 3258, 3416], "10": [3377, 3479, 3648] },
  "2026.1": { "2": [1874, 1930, 2024], "3": [2032, 2093, 2195], "4": [2245, 2312, 2425], "5": [2445, 2518, 2641], "6": [2556, 2633, 2761], "7": [2734, 2816, 2953], "8": [2961, 3050, 3198], "9": [3179, 3274, 3433], "10": [3394, 3496, 3666] },
};

describe("IDCC 3252, validFrom and sources", () => {
  it("selects each version at its legal date", () => {
    assert.equal(engines["2025.1"].version.validFrom, "2025-04-01");
    assert.equal(engines["2025.2"].version.validFrom, "2025-05-17");
    assert.equal(engines["2025.3"].version.validFrom, "2025-06-01");
    assert.equal(engines["2026.1"].version.validFrom, "2026-10-01");
    assert.ok(engines["2026.1"].version.sources.some((s) => s.includes("JORFTEXT000054794465")));
    assert.ok(engines["2025.3"].version.sources.some((s) => s.includes("KALITEXT000051447565")));
  });
});

describe("IDCC 3252, monthly minimum by level and seniority", () => {
  for (const [revision, grid] of Object.entries(GRIDS) as [Revision, Record<string, [number, number, number]>][]) {
    for (const [level, [under3, from3, from8]] of Object.entries(grid)) {
      it(`${revision}: level ${level} gives ${under3}, ${from3} and ${from8} euros`, () => {
        assert.equal(minimum(revision, level, 0), under3);
        assert.equal(minimum(revision, level, 2.9), under3);
        assert.equal(minimum(revision, level, 3), from3);
        assert.equal(minimum(revision, level, 7.9), from3);
        assert.equal(minimum(revision, level, 8), from8);
        assert.equal(evaluate(revision, "classification hors grille", { classification: `'${level}'` }), false);
      });
    }
  }
  it("prorates once for part-time work", () => {
    assert.equal(minimum("2026.1", "5", 0, "50%"), 1222.5);
    assert.equal(minimum("2025.3", "7", 3, "80%"), 2235.2);
  });
  it("rejects levels outside the grid, including level 1 from October 2026", () => {
    for (const level of ["0", "11", "1.5", "non renseigné"]) {
      for (const revision of Object.keys(engines) as Revision[]) {
        assert.equal(evaluate(revision, "classification hors grille", { classification: `'${level}'` }), true, `${revision} ${level}`);
        assert.equal(minimum(revision, level), 0, `${revision} ${level}`);
      }
    }
    assert.equal(evaluate("2026.1", "classification hors grille", { classification: "'1'" }), true);
    assert.equal(minimum("2026.1", "1"), 0);
    assert.equal(evaluate("2025.3", "classification hors grille", { classification: "'1'" }), false);
  });
  it("has the audit flag off and is inapplicable for another agreement", () => {
    assert.equal(evaluate("2026.1", "audit paie"), false);
    const { engine } = engines["2026.1"];
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});

// Avenant n° 2 du 22 janvier 2025, article 1 (2024 grid corrected) and article 2 (+1,3 %, +2 %).
const MANNEQUIN: Record<"old" | "new", Record<string, [number, number, number, number]>> = {
  old: { "1": [110.3, 551.5, 2481.75, 2812.65], "2": [128.55, 642.75, 2892.35, 3278], "3": [169.3, 846.5, 3809.25, 4317.15], "4": [215.6, 1078, 4851, 5497.8] },
  new: { "1": [111.75, 558.75, 2514.4, 2849.6], "2": [130.2, 651, 2929.5, 3320.1], "3": [171.5, 857.5, 3858.75, 4373.25], "4": [218.4, 1092, 4914, 5569.2] },
};
const RULES = ["salaire minimum horaire", "salaire minimum journalier", "salaire minimum hebdomadaire 5 jours", "salaire minimum hebdomadaire 6 jours"];

describe("IDCC 3252, mannequins (annexe V)", () => {
  for (const [revision, set] of [["2025.1", "old"], ["2025.2", "old"], ["2025.3", "new"], ["2026.1", "new"]] as const) {
    for (const [category, amounts] of Object.entries(MANNEQUIN[set])) {
      it(`${revision}: category ${category} adult minima`, () => {
        RULES.forEach((rule, i) =>
          assert.equal(round2(evaluate(revision, `mannequin . ${rule}`, { "mannequin . catégorie de prestation": `'${category}'` })), amounts[i], `${rule}`));
      });
    }
  }
  it("rejects a category outside the grid", () => {
    assert.equal(evaluate("2025.3", "mannequin . catégorie hors grille", { "mannequin . catégorie de prestation": "'5'" }), true);
    assert.equal(evaluate("2025.3", "mannequin . salaire minimum horaire", { "mannequin . catégorie de prestation": "'5'" }), 0);
    assert.equal(evaluate("2025.3", "mannequin . catégorie hors grille", { "mannequin . catégorie de prestation": "'4'" }), false);
  });
  it("gives the technical fitting, press and child minima", () => {
    assert.equal(evaluate("2025.1", "mannequin . salaire minimum horaire d'essayage technique"), 80);
    assert.equal(evaluate("2025.1", "mannequin . salaire minimum hebdomadaire d'essayage technique 6 jours"), 2040);
    assert.equal(evaluate("2025.3", "mannequin . salaire minimum horaire d'essayage technique"), 81.05);
    assert.equal(evaluate("2025.3", "mannequin . salaire minimum journalier d'essayage technique"), 405.25);
    assert.equal(evaluate("2025.3", "mannequin . salaire minimum hebdomadaire d'essayage technique 5 jours"), 1823.6);
    assert.equal(evaluate("2025.3", "mannequin . salaire minimum hebdomadaire d'essayage technique 6 jours"), 2066.75);
    assert.equal(evaluate("2025.2", "mannequin . salaire minimum horaire de presse rédactionnelle", { "mannequin . catégorie de presse rédactionnelle": "'G'" }), 99.8);
    assert.equal(evaluate("2025.3", "mannequin . salaire minimum horaire de presse rédactionnelle", { "mannequin . catégorie de presse rédactionnelle": "'A'" }), 39.8);
    assert.equal(evaluate("2025.3", "mannequin . salaire minimum journalier de presse rédactionnelle", { "mannequin . catégorie de presse rédactionnelle": "'G'" }), 505.5);
    assert.equal(evaluate("2025.3", "mannequin . catégorie de presse hors grille", { "mannequin . catégorie de presse rédactionnelle": "'H'" }), true);
    assert.equal(evaluate("2025.1", "mannequin . salaire minimum horaire enfant", { "mannequin . prestation du mannequin enfant": "'tournage de film publicitaire'" }), 92.6);
    assert.equal(evaluate("2025.3", "mannequin . salaire minimum horaire enfant", { "mannequin . prestation du mannequin enfant": "'tournage de film publicitaire'" }), 94.45);
    assert.equal(evaluate("2025.3", "mannequin . salaire minimum horaire enfant", { "mannequin . prestation du mannequin enfant": "'catalogue VPC'" }), 66.1);
    assert.equal(evaluate("2025.3", "mannequin . prestation enfant hors grille", { "mannequin . prestation du mannequin enfant": "'autre'" }), true);
  });
});

describe("IDCC 3252, doublage (avenant n° 1 du 7 novembre 2022)", () => {
  it("keeps the half-day rates in force from 1 January 2023", () => {
    for (const revision of Object.keys(engines) as Revision[]) {
      assert.equal(evaluate(revision, "doublage . salaire minimum demi-journée cinéma un rôle"), 128.14);
      assert.equal(evaluate(revision, "doublage . salaire minimum demi-journée audiovisuel trois rôles"), 121.73);
    }
  });
});
