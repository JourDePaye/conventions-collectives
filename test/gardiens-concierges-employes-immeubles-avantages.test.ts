import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "1043-gardiens-concierges-employes-immeubles";
const value = "gardiens concierges et employés d'immeubles";
const ns = `salarié . convention collective . ${value}`;

async function engineOf(revision: string) {
  const version = COMPILED_VERSIONS[id]?.find((entry: { version: string }) => entry.version === revision);
  assert.ok(version, `IDCC 1043 ${revision} must be exported`);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, await version.loadRules());
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  const evaluate = (rule: string, situation: Record<string, string | number> = {}) => {
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${ns} . coefficient hiérarchique`]: 600,
      [`${ns} . heures contractuelles`]: "151.67 heures/mois",
      ...Object.fromEntries(Object.entries(situation).map(([name, v]) => [`${ns} . ${name}`, v])),
    });
    const v = engine.evaluate(`${ns} . ${rule}`).nodeValue;
    return typeof v === "number" ? Math.round(v * 10000) / 10000 : v;
  };
  return { version, evaluate };
}

const ALL_SUPPLIED = {
  "salaire en nature complémentaire . électricité fournie": "oui",
  "salaire en nature complémentaire . gaz fourni": "oui",
  "salaire en nature complémentaire . chauffage fourni": "oui",
  "salaire en nature complémentaire . eau chaude fournie": "oui",
};

describe("IDCC 1043 — revision 2026.0 (avenant n° 110, housing values of 1 January 2026)", async () => {
  const { version, evaluate } = await engineOf("2026.0");

  it("is effective on 1 January 2026", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source: string) => source.includes("KALITEXT000051447059")));
  });

  it("keeps the salary values of avenant n° 110", () => {
    // 600 × 1,62 + 915 = 1 887 €.
    assert.equal(evaluate("salaire minimum conventionnel"), 1887);
    assert.equal(evaluate("valeur électricité"), 0.2516);
  });

  it("values the housing at the prices of 1 January 2026", () => {
    // Category 2, 80 m² capped at 60 m²: 2,837 × 60 = 170,22 €.
    assert.equal(evaluate("avantage en nature logement", { "catégorie logement": "'2'", "surface logement": "80 m²" }), 170.22);
  });

  it("values the complementary benefits at 0,2516 € the kWh", () => {
    // (55 + 92 + 120 + 98) kWh × 0,2516 = 91,834 €.
    assert.equal(evaluate("salaire en nature complémentaire", ALL_SUPPLIED), 91.834);
  });
});

describe("IDCC 1043 — revision 2026.2 (avenant n° 115, corrected)", async () => {
  const { version, evaluate } = await engineOf("2026.2");

  it("is effective on 1 May 2026, like 2026.1", () => {
    assert.equal(version.validFrom, "2026-05-01");
    assert.ok(version.sources.some((source: string) => source.includes("KALITEXT000054091896")));
    assert.ok(version.sources.some((source: string) => source.includes("KALITEXT000042111124")));
  });

  it("keeps the minimum of avenant n° 115", () => {
    assert.equal(evaluate("salaire minimum conventionnel"), 1910);
  });

  it("pays the selective sorting bonus to category B caretakers with lots only", () => {
    assert.equal(evaluate("prime de tri sélectif", { catégorie: "'A'", "lots principaux": "20 lot" }), null);
    assert.equal(evaluate("prime de tri sélectif", { catégorie: "'B'" }), null);
    assert.equal(evaluate("prime de tri sélectif", { catégorie: "'B'", "lots principaux": "10 lot" }), 28);
    assert.equal(evaluate("prime de tri sélectif", { catégorie: "'B'", "lots principaux": "100 lot" }), 140);
    assert.equal(evaluate("prime de tri sélectif", { catégorie: "'B'", "lots principaux": "200 lot" }), 224);
  });

  it("values the housing with its minimum of 79,70 €", () => {
    // Category 1, 50 m²: 3,593 × 50 = 179,65 €; category 3, 20 m²: 2,095 × 20 = 41,90 €, raised to 79,70 €.
    assert.equal(evaluate("avantage en nature logement", { "catégorie logement": "'1'", "surface logement": "50 m²" }), 179.65);
    assert.equal(evaluate("avantage en nature logement", { "catégorie logement": "'3'", "surface logement": "20 m²" }), 79.7);
    assert.equal(evaluate("avantage en nature logement"), null);
  });

  it("values each complementary benefit in kWh at 0,1952 €", () => {
    // Electricity: 55 kWh × 0,1952 = 10,736 €; all four: 365 kWh × 0,1952 = 71,248 €.
    assert.equal(evaluate("salaire en nature complémentaire", { "salaire en nature complémentaire . électricité fournie": "oui" }), 10.736);
    assert.equal(evaluate("salaire en nature complémentaire", ALL_SUPPLIED), 71.248);
    assert.equal(evaluate("salaire en nature complémentaire"), 0);
  });

  it("adds the housing and the complementary benefits", () => {
    // 179,65 € + 10,736 € = 190,386 €.
    assert.equal(
      evaluate("avantages en nature", {
        "catégorie logement": "'1'",
        "surface logement": "50 m²",
        "salaire en nature complémentaire . électricité fournie": "oui",
      }),
      190.386,
    );
  });
});
