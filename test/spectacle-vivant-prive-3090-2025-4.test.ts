import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "3090-spectacle-vivant-prive";
const ns = "salarié . convention collective . spectacle vivant privé";
const employerProvident = "salarié . cotisations . prévoyances . conventionnelle . employeur";

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((candidate) => candidate.version === "2025.4");
  assert.ok(version, "IDCC 3090 2025.4 must be exported");
  assert.equal(version.validFrom, "2025-09-01");
  assert.equal(version.extension, "2026-02-24");
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "spectacle vivant privé"] } as Rule;
  Object.assign(rules, await version.loadRules());
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

const situation = (extra: Record<string, string> = {}) => ({
  salarié: "oui",
  dirigeant: "non",
  "salarié . convention collective": "'spectacle vivant privé'",
  "salarié . contrat . salaire brut": "2200 €/mois",
  "salarié . contrat . statut cadre": "non",
  "entreprise . salariés . effectif": "10 employé",
  [`${ns} . filière`]: "'technique'",
  [`${ns} . catégorie`]: "'employés qualifiés groupe 1'",
  [`${ns} . ancienneté dans la branche`]: "2 an",
  ...extra,
});

const round = (value: unknown) => Math.round((value as number) * 100) / 100;

describe("IDCC 3090 — 2025.4", () => {
  // Avenant du 21 juillet 2025 (KALITEXT000053721738), for 151,67 hours a month.
  it("values the technical grid, without échelon", async () => {
    const engine = await makeEngine();
    for (const [category, expected] of [
      ["cadres groupe 2", 2658.78],
      ["cadres groupe 3", 2361.5],
      ["agents de maîtrise", 2115.8],
      ["employés qualifiés groupe 1", 1906.49],
      ["employés qualifiés groupe 2", 1821.56],
      ["employés", 1801.8],
    ] as const) {
      engine.setSituation(situation({ [`${ns} . catégorie`]: `'${category}'`, [`${ns} . échelon`]: "3" }));
      assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, expected, category);
    }
  });

  it("values the administrative and commercial grid by échelon", async () => {
    const engine = await makeEngine();
    for (const [category, échelon, expected] of [
      ["cadres groupe 1", 1, 3578.18],
      ["cadres groupe 1", 4, 3578.18],
      ["cadres groupe 2", 5, 3300.81],
      ["cadres groupe 3", 1, 2485.24],
      ["agents de maîtrise", 3, 2256.89],
      ["employés qualifiés groupe 1", 4, 2059.12],
      ["employés qualifiés groupe 2", 2, 1834.57],
      ["employés", 5, 1822.9],
    ] as const) {
      engine.setSituation(
        situation({ [`${ns} . filière`]: "'administrative et commerciale'", [`${ns} . catégorie`]: `'${category}'`, [`${ns} . échelon`]: `${échelon}` }),
      );
      assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, expected, `${category} ${échelon}`);
    }
    engine.setSituation(situation({ "salarié . contrat . temps de travail . quotité": "50%" }));
    assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, 953.25);
  });

  it("flags a classification out of the grid", async () => {
    const engine = await makeEngine();
    const cases: Record<string, string>[] = [
      { [`${ns} . catégorie`]: "'cadres groupe 1'" }, // no technical cadres groupe 1
      { [`${ns} . filière`]: "'administrative et commerciale'", [`${ns} . échelon`]: "6" },
      { [`${ns} . filière`]: "'administrative et commerciale'", [`${ns} . échelon`]: "0" },
      { [`${ns} . filière`]: "'non renseignée'" },
    ];
    for (const extra of cases) {
      engine.setSituation(situation(extra));
      assert.equal(engine.evaluate(`${ns} . classification hors grille`).nodeValue, true, JSON.stringify(extra));
      assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, null);
    }
  });

  it("adds the FCAP-SVP, 0.1 % of tranche A, to the employer contributions (article 5.1)", async () => {
    const engine = await makeEngine();
    engine.setSituation(situation());
    assert.equal(round(engine.evaluate(`${ns} . FCAP`).nodeValue), 2.2);
    const total = engine.evaluate("salarié . cotisations . employeur").nodeValue as number;
    engine.setSituation(situation({ "salarié . convention collective": "'droit commun'" }));
    const general = engine.evaluate("salarié . cotisations . employeur").nodeValue as number;
    // The difference also holds the provident contribution: 1.20 % of 2 200 €.
    assert.equal(round(total - general), round(2.2 + 26.4));
  });

  it("spreads the 80 € floor and the 300 € ceiling of the company over its employees and months", async () => {
    const engine = await makeEngine();
    // 0.1 % of 1 000 € is 1 € a month, below 80 € / 12 months / 5 employees.
    engine.setSituation(situation({ "salarié . contrat . salaire brut": "1000 €/mois", "entreprise . salariés . effectif": "5 employé" }));
    assert.equal(round(engine.evaluate(`${ns} . FCAP`).nodeValue), round(80 / 12 / 5));
    // 0.1 % of the tranche A (the monthly ceiling) is above 300 € / 12 months / 100 employees.
    engine.setSituation(situation({ "salarié . contrat . salaire brut": "6000 €/mois", "entreprise . salariés . effectif": "100 employé" }));
    assert.equal(round(engine.evaluate(`${ns} . FCAP`).nodeValue), round(300 / 12 / 100));
  });

  it("charges the provident contribution of 1.20 % of tranche A to the employer of a non-cadre (article 12.6)", async () => {
    const engine = await makeEngine();
    engine.setSituation(situation());
    assert.equal(round(engine.evaluate(employerProvident).nodeValue), 26.4);
    engine.setSituation(situation({ "salarié . contrat . salaire brut": "6000 €/mois" }));
    const ceiling = engine.evaluate("salarié . temps de travail . plafond sécurité sociale").nodeValue as number;
    assert.equal(round(engine.evaluate(employerProvident).nodeValue), round(ceiling * 0.012));
  });

  it("leaves out a non-cadre with less than a year in the branch, and the cadres (article 12.3)", async () => {
    const engine = await makeEngine();
    engine.setSituation(situation({ [`${ns} . ancienneté dans la branche`]: "11 mois" }));
    assert.equal(engine.evaluate(`${ns} . prévoyance`).nodeValue, null);
    engine.setSituation(situation({ "salarié . contrat . statut cadre": "oui" }));
    assert.equal(engine.evaluate(`${ns} . prévoyance`).nodeValue, null);
    assert.equal(round(engine.evaluate(`${ns} . FCAP`).nodeValue), 2.2);
  });

  it("is inactive outside the selected convention", async () => {
    const engine = await makeEngine();
    engine.setSituation(situation({ "salarié . convention collective": "'droit commun'" }));
    assert.equal(engine.evaluate(`${ns} . FCAP`).nodeValue, null);
    assert.equal(engine.evaluate(`${ns} . prévoyance`).nodeValue, null);
  });
});
