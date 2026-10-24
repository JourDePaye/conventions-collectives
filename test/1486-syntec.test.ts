import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";
import { maintenanceOf, type Motive } from "./salary-maintenance.ts";

const model = "1486-syntec";
const value = "syntec";
const namespace = `salarié . convention collective . ${value}`;

async function engineOf(revision: string) {
  const version = COMPILED_VERSIONS[model]?.find((entry) => entry.version === revision);
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  for (const name of Object.keys(extension)) {
    assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
    assert.ok(!(name in rules), `Duplicate modele-social rule: ${name}`);
  }
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...new Set([...choice["une possibilité"], value])],
  } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  const setSituation = (context: Record<string, string | number> = {}) => {
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      "salarié . contrat . statut cadre": "non",
      [`${namespace} . coefficient`]: 355,
      "salarié . contrat . salaire brut": "3000 €/mois",
      "entreprise . salariés . effectif": 20,
      ...context,
    });
  };
  return { version, engine, setSituation };
}

const formation = "salarié . cotisations . formation professionnelle";

describe("IDCC 1486 — 2026.1", async () => {
  const { version, engine, setSituation } = await engineOf("2026.1");

  it("keeps the 2025 salary grid and exposes the legal sources", () => {
    assert.equal(version.validFrom, "2026-01-01");
    setSituation();
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2045);
    assert.ok(version.sources.some((source) => source.includes("formation professionnelle")));
    assert.ok(version.sources.some((source) => source.includes("prévoyance lourde")));
  });

  it("replaces the legal formation rate below and at the 50-employee threshold", () => {
    setSituation({ "entreprise . salariés . effectif": 20 });
    assert.equal(engine.evaluate(formation).nodeValue, 1.5);
    setSituation({ "entreprise . salariés . effectif": 50 });
    assert.equal(engine.evaluate(formation).nodeValue, 3);
  });

  it("does not alter the standard formation endpoint for another agreement", () => {
    setSituation({ "salarié . convention collective": "'droit commun'", "entreprise . salariés . effectif": 50 });
    assert.equal(engine.evaluate(formation).nodeValue, 30);
  });
});

// 2026.1 replaced the legal contribution with the agreement's own rate, which the agreement adds
// to it: 2026.2 adds the 0.05 % (0.10 % from 50 employees) to the legal 0.55 % (1 % from 11).
describe("IDCC 1486 — 2026.2", async () => {
  const { version, engine, setSituation } = await engineOf("2026.2");

  it("keeps the 2026.1 grid, effective date and sources", () => {
    assert.equal(version.validFrom, "2026-01-01");
    setSituation();
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2045);
    assert.ok(version.sources.some((source) => source.includes("formation professionnelle")));
  });

  it("adds the agreement contribution to the legal formation contribution", () => {
    // 3 000 € × (0.55 % + 0.05 %), 3 000 € × (1 % + 0.05 %), 3 000 € × (1 % + 0.10 %).
    for (const [effectif, expected] of [[5, 18], [20, 31.5], [50, 33]] as const) {
      setSituation({ "entreprise . salariés . effectif": effectif });
      const amount = engine.evaluate(formation).nodeValue as number;
      assert.equal(Math.round(amount * 100) / 100, expected, `effectif ${effectif}`);
    }
  });

  it("does not alter the standard formation endpoint for another agreement", () => {
    setSituation({ "salarié . convention collective": "'droit commun'", "entreprise . salariés . effectif": 50 });
    assert.equal(engine.evaluate(formation).nodeValue, 30);
  });
});

// Articles 9.2 and 9.3 (KALIARTI000047513889 and KALIARTI000053769476).
describe("IDCC 1486 — 2026.4, salary maintenance", async () => {
  const { version, engine, setSituation } = await engineOf("2026.4");
  const maintenance = (motive: Motive, months: number, context: Record<string, string | number> = {}) =>
    maintenanceOf(engine, setSituation, namespace, motive, months, {}, context);
  const cadre = { "salarié . contrat . statut cadre": "oui" };

  it("keeps the 2026.3 date and cites the articles", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source) => source.includes("KALIARTI000047513889")));
  });

  it("pays sickness after a year, from the first day, 90 days over 12 months", () => {
    assert.equal(maintenance("maladie", 11).eligible, false);
    assert.deepEqual(maintenance("maladie", 12), {
      eligible: true,
      waitingDays: 0,
      periods: [[30, 100], [60, 80]],
      window: "douze mois",
      base: "salaire de base",
      netCap: true,
      seniorityDuringAbsence: true,
      separateWorkAccidents: false,
    });
    // ETAM beyond 5 years: 60 days at 100 % then 30 at 80 %.
    assert.deepEqual(maintenance("maladie", 61).periods, [[60, 100], [30, 80]]);
    assert.deepEqual(maintenance("accident de trajet", 30, cadre).periods, [[90, 100]]);
  });

  it("pays a work accident from the hiring", () => {
    assert.equal(maintenance("accident du travail", 0).eligible, true);
  });

  it("maintains the salary for the whole maternity, adoption and paternity leaves", () => {
    for (const motive of ["maternité", "adoption"] as const) {
      const leave = maintenance(motive, 12);
      assert.equal(leave.eligible, true, motive);
      assert.deepEqual(leave.periods, [[365, 100]], motive);
      assert.equal(leave.base, "brut", motive);
      assert.equal(leave.netCap, false, motive);
      assert.equal(leave.window, "arrêt", motive);
    }
    assert.equal(maintenance("maternité", 11).eligible, false);
    const paternity = maintenance("paternité", 12);
    assert.equal(paternity.base, "salaire de base");
    assert.equal(paternity.netCap, true);
  });
});
