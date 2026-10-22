import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "1979-hotels-cafes-restaurants";
const ns = "salarié . convention collective . hôtels cafés restaurants";
const conventional = "salarié . cotisations . prévoyances . conventionnelle";

async function makeEngine(revision = "2024.2") {
  const version = COMPILED_VERSIONS[id]?.find((candidate) => candidate.version === revision);
  assert.ok(version, `IDCC 1979 ${revision} must be exported`);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "hôtels cafés restaurants"] } as Rule;
  Object.assign(rules, await version.loadRules());
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

const situation = (extra: Record<string, string> = {}) => ({
  salarié: "oui",
  dirigeant: "non",
  "salarié . convention collective": "'hôtels cafés restaurants'",
  "salarié . contrat . salaire brut": "2200 €/mois",
  "salarié . contrat . statut cadre": "non",
  [`${ns} . niveau`]: "'II.3'",
  ...extra,
});

const round = (value: unknown) => Math.round((value as number) * 100) / 100;

describe("IDCC 1979 — 2024.2", () => {
  it("is in force from 1 December 2024, extended on 9 November 2024", () => {
    const version = COMPILED_VERSIONS[id]?.find((candidate) => candidate.version === "2024.2");
    assert.equal(version?.validFrom, "2024-12-01");
    assert.equal(version?.extension, "2024-11-09");
  });

  // Avenant n° 33 du 19 juin 2024 (KALITEXT000050394790), article 2.
  it("values the hourly minimums of the grid on the contract's hours (35 × 52 / 12 a month)", async () => {
    const engine = await makeEngine();
    for (const [level, hourly] of [["I.1", 12], ["II.3", 13.17], ["IV.2", 14.77], ["V.3", 28.12]] as const) {
      engine.setSituation(situation({ [`${ns} . niveau`]: `'${level}'` }));
      assert.equal(engine.evaluate(`${ns} . taux horaire minimum`).nodeValue, hourly, level);
      assert.equal(round(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue), round((hourly * 35 * 52) / 12), level);
      assert.equal(engine.evaluate(`${ns} . niveau hors grille`).nodeValue, false, level);
    }
    engine.setSituation(situation({ [`${ns} . niveau`]: "'VI.1'" }));
    assert.equal(engine.evaluate(`${ns} . niveau hors grille`).nodeValue, true);
  });

  it("raises the overtime by 10 %, 20 %, then 50 % (avenant n° 2 du 5 février 2007, article 4)", async () => {
    const weeksPerMonth = 52 / 12;
    const majoration = "salarié . temps de travail . heures supplémentaires . majoration";
    // 10 overtime hours a week: 4 at 10 %, 4 at 20 %, 2 at 50 %.
    const overtime = { "salarié . temps de travail . heures supplémentaires": `${10 * weeksPerMonth} heure/mois` };
    const engine = await makeEngine();
    engine.setSituation(situation(overtime));
    assert.equal(round(engine.evaluate(majoration).nodeValue), round(2.2 * weeksPerMonth));
    // The general rates elsewhere: 8 hours at 25 %, 2 at 50 %.
    engine.setSituation(situation({ ...overtime, "salarié . convention collective": "'droit commun'" }));
    assert.equal(round(engine.evaluate(majoration).nodeValue), round(3 * weeksPerMonth));
  });

  it("shares the prévoyance of 0.86 % of tranche A by half (article 18.5)", async () => {
    const engine = await makeEngine();
    engine.setSituation(situation());
    assert.equal(round(engine.evaluate(`${conventional} . employeur`).nodeValue), 9.46);
    assert.equal(round(engine.evaluate(`${conventional} . salarié`).nodeValue), 9.46);
    // Capped at the monthly social security ceiling.
    engine.setSituation(situation({ "salarié . contrat . salaire brut": "6000 €/mois" }));
    const ceiling = engine.evaluate("salarié . temps de travail . plafond sécurité sociale").nodeValue as number;
    assert.equal(round(engine.evaluate(`${conventional} . salarié`).nodeValue), round(ceiling * 0.0043));
  });

  it("leaves the cadres' employer share to their statutory 1.50 % of tranche A", async () => {
    const engine = await makeEngine();
    engine.setSituation(situation({ "salarié . contrat . statut cadre": "oui", [`${ns} . niveau`]: "'V.1'", "salarié . contrat . salaire brut": "3000 €/mois" }));
    assert.equal(engine.evaluate(`${ns} . prévoyance . employeur`).nodeValue, null);
    assert.equal(round(engine.evaluate(`${conventional} . salarié`).nodeValue), 12.9);
  });

  it("is inactive outside the selected convention", async () => {
    const engine = await makeEngine();
    engine.setSituation(situation({ "salarié . convention collective": "'droit commun'" }));
    assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${ns} . prévoyance`).nodeValue, null);
  });
});

describe("IDCC 1979 — 2026.1", () => {
  it("is in force from 1 November 2026, the month after the extension of avenant n° 36", () => {
    const version = COMPILED_VERSIONS[id]?.find((candidate) => candidate.version === "2026.1");
    assert.equal(version?.validFrom, "2026-11-01");
    assert.equal(version?.extension, "2026-10-15");
    assert.ok(version?.sources.some((source) => source.includes("JORFTEXT000054983870")));
  });

  // Avenant n° 36 du 4 juin 2026, minimums of the table published by the GHR (signatory), not yet
  // checked against the BOCC.
  it("values the hourly minimums of avenant n° 36", async () => {
    const engine = await makeEngine("2026.1");
    const grid = {
      "I.1": 12.31, "I.2": 12.37, "I.3": 12.47,
      "II.1": 12.58, "II.2": 12.8, "II.3": 13.43,
      "III.1": 13.59, "III.2": 13.81, "III.3": 14.28,
      "IV.1": 14.69, "IV.2": 15.07, "IV.3": 15.71,
      "V.1": 18.8, "V.2": 22.22, "V.3": 28.68,
    };
    for (const [level, hourly] of Object.entries(grid)) {
      engine.setSituation(situation({ [`${ns} . niveau`]: `'${level}'` }));
      assert.equal(engine.evaluate(`${ns} . taux horaire minimum`).nodeValue, hourly, level);
    }
    engine.setSituation(situation());
    assert.equal(round(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue), round((13.43 * 35 * 52) / 12));
  });
});
