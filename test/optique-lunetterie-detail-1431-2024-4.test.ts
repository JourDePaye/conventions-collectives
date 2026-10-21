import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "1431-optique-lunetterie-detail";
const ns = "salarié . convention collective . optique-lunetterie de détail";

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((candidate) => candidate.version === "2024.4");
  assert.ok(version, "IDCC 1431 2024.4 must be exported");
  assert.equal(version.validFrom, "2024-01-01");
  assert.ok(version.sources.some((source) => source.includes("KALIARTI000039748563")));
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "optique-lunetterie de détail"] } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

type Options = { seniority?: number; quotité?: string; cadre?: boolean };

const situation = (coefficient: string, { seniority = 0, quotité = "100%", cadre = false }: Options = {}) => ({
  salarié: "oui",
  dirigeant: "non",
  "salarié . convention collective": "'optique-lunetterie de détail'",
  [`${ns} . coefficient`]: `'${coefficient}'`,
  [`${ns} . ancienneté entreprise`]: `${seniority} an`,
  "salarié . contrat . temps de travail . quotité": quotité,
  "salarié . contrat . statut cadre": cadre ? "oui" : "non",
});

describe("IDCC 1431 — 2024.4", () => {
  it("supersedes 2024.3 for the same validFrom", () => {
    const dates = (COMPILED_VERSIONS[id] ?? []).filter((v) => ["2024.3", "2024.4"].includes(v.version)).map((v) => v.validFrom);
    assert.deepEqual(dates, ["2024-01-01", "2024-01-01"]);
  });

  it("deduces the classification from the coefficient", async () => {
    const engine = await makeEngine();
    // Accord du 14 septembre 2023 (KALITEXT000048638289), article 2.
    for (const [coefficient, classification, expected] of [
      ["110", "ancienne", 1830],
      ["220", "ancienne", 2150],
      ["380", "ancienne", 3400],
      ["A", "nouvelle", 1935],
      ["K", "nouvelle", 3700],
      ["1.1", "nouvelle", 1830],
      ["2.2", "nouvelle", 2050],
      ["3.6", "nouvelle", 3400],
    ] as const) {
      engine.setSituation(situation(coefficient));
      assert.equal(engine.evaluate(`${ns} . classification`).nodeValue, classification, coefficient);
      assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, expected, coefficient);
      assert.equal(engine.evaluate(`${ns} . coefficient hors grille`).nodeValue, false, coefficient);
    }
  });

  it("flags a coefficient absent from both grids", async () => {
    const engine = await makeEngine();
    for (const coefficient of ["L", "3.7", "120", "non renseigné"]) {
      engine.setSituation(situation(coefficient, { seniority: 10 }));
      assert.equal(engine.evaluate(`${ns} . coefficient hors grille`).nodeValue, true, coefficient);
      assert.equal(engine.evaluate(`${ns} . prime d'ancienneté`).nodeValue, 0, coefficient);
    }
  });

  it("pays the non-cadres' seniority bonus on the minimum of the grid (article 32)", async () => {
    const engine = await makeEngine();
    // Level B: 2 010 €; 3 % from 3 years, then 6, 9, 12 and 15 % every 3 years.
    for (const [seniority, expected] of [[2, 0], [3, 60.3], [6, 120.6], [10, 180.9], [12, 241.2], [20, 301.5]] as const) {
      engine.setSituation(situation("B", { seniority }));
      assert.equal(engine.evaluate(`${ns} . prime d'ancienneté`).nodeValue, expected, String(seniority));
    }
  });

  it("prorates the seniority bonus by working time", async () => {
    const engine = await makeEngine();
    // Level 1.1 at half time: 3 % of 915 €.
    engine.setSituation(situation("1.1", { seniority: 3, quotité: "50%" }));
    assert.equal(engine.evaluate(`${ns} . prime d'ancienneté`).nodeValue, 27.45);
  });

  it("pays no seniority bonus to the cadres", async () => {
    const engine = await makeEngine();
    engine.setSituation(situation("K", { seniority: 20, cadre: true }));
    assert.equal(engine.evaluate(`${ns} . prime d'ancienneté`).nodeValue, 0);
    assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, 3700);
  });

  it("keeps the non-cadre pension plan", async () => {
    const engine = await makeEngine();
    engine.setSituation({ ...situation("1.1"), "salarié . contrat . salaire brut": "5000 €/mois" });
    assert.equal(engine.evaluate(`${ns} . prévoyance . employeur`).nodeValue, 16.8);
    assert.equal(engine.evaluate(`${ns} . prévoyance . salarié`).nodeValue, 11.2);
  });
});
