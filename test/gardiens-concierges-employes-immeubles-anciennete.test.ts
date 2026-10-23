import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

// Article 24 of the agreement (KALITEXT000021180979): 3 % of the minimum of article 22.2 a after
// 3 years with the same employer, 3 points more every 3 years, 18 % after 18 years. The minimum
// of avenant n° 110 (1 May 2025, and until 30 April 2026): coefficient × 1.62 (A) or 1.76 (B) +
// 915 €; of avenant n° 115 (from 1 May 2026): × 1.65 (A) or 1.79 (B) + 920 €.
const id = "1043-gardiens-concierges-employes-immeubles";
const value = "gardiens concierges et employés d'immeubles";
const ns = `salarié . convention collective . ${value}`;

async function engineOf(revision: string) {
  const version = COMPILED_VERSIONS[id]?.find((entry) => entry.version === revision);
  assert.ok(version, revision);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, await version.loadRules());
  return { version, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
}

function bonus(engine: Engine, years: number, situation: Record<string, string | number>) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${ns} . catégorie`]: "'A'",
    [`${ns} . heures contractuelles`]: "151.67 heure/mois",
    [`${ns} . ancienneté employeur`]: `${years} an`,
    ...situation,
  });
  return engine.evaluate(`${ns} . prime d'ancienneté`).nodeValue;
}

describe("IDCC 1043 — seniority bonus of article 24", () => {
  it("replaces each version at its effective date", async () => {
    for (const [revision, validFrom] of [["2025.2", "2025-05-01"], ["2026.3", "2026-01-01"], ["2026.4", "2026-05-01"]] as const) {
      const { version } = await engineOf(revision);
      assert.equal(version.validFrom, validFrom);
      assert.ok(version.sources.some((source) => source.includes("article 24")));
    }
  });

  it("rises by 3 points every 3 years up to 18 %", async () => {
    const { engine } = await engineOf("2026.4");
    // 600 × 1.65 + 920 = 1 910 €.
    const coefficient = { [`${ns} . coefficient hiérarchique`]: 600 };
    for (const [years, amount] of [[2, 0], [3, 57.3], [7, 114.6], [12, 229.2], [20, 343.8]] as const) {
      assert.equal(bonus(engine, years, coefficient), amount, `${years} years`);
    }
  });

  it("is computed on the minimum times the employment rate", async () => {
    const { engine } = await engineOf("2026.4");
    // Half-time category A: 1 910 € / 2 × 6 % = 57.30 €.
    assert.equal(bonus(engine, 6, { [`${ns} . coefficient hiérarchique`]: 600, [`${ns} . heures contractuelles`]: "75.835 heure/mois" }), 57.3);
    // Category B, 600 × 1.79 + 920 = 1 994 €: 6 % of it for 10 000 UV, of 1.25 times it for 12 500.
    const categoryB = { [`${ns} . coefficient hiérarchique`]: 600, [`${ns} . catégorie`]: "'B'" };
    assert.equal(bonus(engine, 6, { ...categoryB, [`${ns} . unités de valeur`]: "10000 unité" }), 119.64);
    assert.equal(bonus(engine, 6, { ...categoryB, [`${ns} . unités de valeur`]: "12500 unité" }), 149.55);
  });

  it("uses the minimum of avenant n° 110 before May 2026", async () => {
    // 1 000 × 1.62 + 915 = 2 535 €: 3 % = 76.05 €.
    for (const revision of ["2025.2", "2026.3"]) {
      const { engine } = await engineOf(revision);
      assert.equal(bonus(engine, 3, { [`${ns} . coefficient hiérarchique`]: 1000 }), 76.05, revision);
    }
  });

  it("marks the 13th month of article 22.4, whose amount the consumer computes", async () => {
    for (const revision of ["2025.2", "2026.3", "2026.4"]) {
      const { engine } = await engineOf(revision);
      engine.setSituation({ "salarié . convention collective": `'${value}'` });
      assert.equal(engine.evaluate(`${ns} . treizième mois`).nodeValue, true, revision);
    }
  });

  it("is nil without a coefficient", async () => {
    const { engine } = await engineOf("2026.4");
    assert.equal(bonus(engine, 20, {}), 0);
  });
});
