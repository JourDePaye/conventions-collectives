/**
 * Building agreements (IDCC 1596, 1597, 2609 and 2420), shared version 2026.4
 * (rules/commun/batiment): modele-social's `BTP` rules corrected, and the regional grids.
 *
 * Expected amounts come from the sources, independently of the YAML:
 * - CIBTP paid leave rates, read on the funds' sites (October 2026);
 * - bad weather contribution, 0,68 % or 0,13 % of the salary capped at the ceiling (4 005 € in
 *   2026, code du travail D. 5424-36 to D. 5424-40, campaign 2026-2027);
 * - RNPC (PRO BTP notice 2026): 1,50 % of tranche A for the employer, 2,40 % of tranche B shared;
 * - Centre-Val de Loire, workers up to 10 employees: avenant du 10 avril 2026 (KALITEXT000054936694),
 *   extended in the JORF of 4 August 2026;
 * - Nouvelle-Aquitaine, workers above 10 employees: accord du 22 octobre 2025
 *   (KALITEXT000053497377), extended in the JORF of 17 January 2026;
 * - ETAM of Corse: accord du 15 décembre 2025 (KALITEXT000054092314), extended in the JORF of
 *   6 June 2026; ETAM of Occitanie: accord du 13 février 2026 (KALITEXT000054337649), extended in
 *   the JORF of 29 May 2026.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const AGREEMENTS = [
  "1596-batiment-ouvriers-petites-entreprises",
  "1597-batiment-ouvriers-plus-de-10",
  "2609-batiment-etam",
  "2420-batiment-cadres",
];
const VERSION = "2026.4";
const BTP = "salarié . convention collective . BTP";
const CEILING = 4005;

const version = COMPILED_VERSIONS[AGREEMENTS[0]!]!.find((v) => v.version === VERSION);
assert.ok(version);
const rules: Record<string, Rule> = { ...modeleSocial, ...(await version.loadRules()) };
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

type Situation = Record<string, string>;

function evaluate(rule: string, situation: Situation): number | boolean | string | null | undefined {
  engine.setSituation({
    date: "01/10/2026",
    "salarié . convention collective": "'BTP'",
    "salarié . contrat . salaire brut": "2500 €/mois",
    ...situation,
  });
  return engine.evaluate(rule).nodeValue as number | boolean | string | null | undefined;
}

const amount = (rule: string, situation: Situation = {}) => {
  const value = evaluate(rule, situation);
  assert.equal(typeof value, "number", rule);
  return Math.round((value as number) * 100) / 100;
};

const percentOf = (base: number, rate: number) => Math.round(base * rate) / 100;

describe("building agreements — one shared version", () => {
  it("publishes the same version 2026.4 for the four agreements, their newest revision", () => {
    // Sorted by effective date, it comes first (2020): a consumer selects it as the first version
    // to use, and leaves the older revisions of each agreement aside.
    const revision = (v: { version: string }) => Number(v.version.split(".")[1]);
    const published = AGREEMENTS.map((name) => {
      const versions = COMPILED_VERSIONS[name]!;
      const found = versions.find((v) => v.version === VERSION);
      assert.ok(found, name);
      assert.ok(versions.every((v) => v === found || revision(v) < revision(found)), name);
      return found;
    });
    for (const found of published) {
      assert.equal(found.contentHash, published[0]!.contentHash);
      assert.equal(found.validFrom, "2020-01-01");
      assert.deepEqual(found.sources, published[0]!.sources);
    }
  });
});

describe("building agreements — CIBTP paid leave", () => {
  const paidLeave = (fund: string, date: string) =>
    amount(`${BTP} . congés intempéries`, { date, [`${BTP} . congés intempéries . caisse de rattachement`]: `'${fund}'` });

  it("applies the rate of each fund in October 2026", () => {
    const rates: Record<string, number> = {
      idf: 20.2,
      "nord ouest": 20.7,
      "grand ouest": 20.7,
      centre: 20.7,
      "centre ouest": 20.7,
      "grand est": 20.35,
      "rhône alpes auvergne": 20.3,
      méditerranée: 19.6,
      "sud ouest": 20.2,
    };
    for (const [fund, rate] of Object.entries(rates)) {
      assert.equal(paidLeave(fund, "01/10/2026"), percentOf(2500, rate), fund);
    }
  });

  it("applies the rate on the date of the period", () => {
    assert.equal(paidLeave("nord ouest", "01/11/2026"), percentOf(2500, 22.85));
    assert.equal(paidLeave("grand ouest", "01/11/2026"), percentOf(2500, 21.95));
    assert.equal(paidLeave("idf", "01/03/2026"), percentOf(2500, 19.7));
    assert.equal(paidLeave("sud ouest", "01/03/2026"), percentOf(2500, 19.7));
    assert.equal(paidLeave("grand ouest", "01/12/2025"), percentOf(2500, 19.7));
    assert.equal(paidLeave("grand ouest", "01/03/2023"), percentOf(2500, 19.95));
  });
});

describe("building agreements — bad weather contribution", () => {
  const badWeather = (category: string, situation: Situation = {}) =>
    amount(`${BTP} . chômage intempéries`, { [`${BTP} . chômage intempéries . catégorie`]: `'${category}'`, ...situation });

  it("applies 0,68 % or 0,13 % of the capped salary", () => {
    assert.equal(badWeather("gros œuvre et travaux publics"), percentOf(2500, 0.68));
    assert.equal(badWeather("second œuvre"), percentOf(2500, 0.13));
    assert.equal(badWeather("non assujettie"), 0);
    assert.equal(
      badWeather("gros œuvre et travaux publics", { "salarié . contrat . salaire brut": "6000 €/mois" }),
      percentOf(CEILING, 0.68),
    );
  });

  it("is not called below the annual allowance", () => {
    assert.equal(badWeather("gros œuvre et travaux publics", { [`${BTP} . chômage intempéries . sous l'abattement`]: "oui" }), 0);
  });

  it("is added to the employer contributions", () => {
    const employer = (category: string) =>
      amount("salarié . cotisations . employeur", { [`${BTP} . chômage intempéries . catégorie`]: `'${category}'` });
    assert.equal(
      Math.round((employer("gros œuvre et travaux publics") - employer("non assujettie")) * 100) / 100,
      percentOf(2500, 0.68),
    );
  });
});

describe("building agreements — executives' prévoyance (RNPC)", () => {
  it("counts 1,50 % of tranche A once, and no tranche C", () => {
    const executive = (gross: number) => ({
      [`${BTP} . catégorie`]: "'cadre'",
      "salarié . contrat . salaire brut": `${gross} €/mois`,
    });
    const employer = "salarié . cotisations . prévoyances . incapacité invalidité décès . employeur";
    const employee = "salarié . cotisations . prévoyances . incapacité invalidité décès . salarié";
    assert.equal(amount(employer, executive(6000)), Math.round((CEILING * 1.5 + (6000 - CEILING) * 1.2)) / 100);
    assert.equal(amount(employee, executive(6000)), Math.round((6000 - CEILING) * 1.2) / 100);
    // Above 4 ceilings, nothing more.
    assert.equal(amount(employer, executive(20000)), Math.round((CEILING * 1.5 + 3 * CEILING * 1.2)) / 100);
  });
});

describe("building agreements — regional grids", () => {
  const worker = (region: string, headcount: number, classification: string, date = "01/10/2026"): Situation => ({
    date,
    [`${BTP} . catégorie`]: "'ouvrier'",
    "entreprise . salariés . effectif": `${headcount} employé`,
    [`${BTP} . région`]: `'${region}'`,
    [`${BTP} . classification`]: `'${classification}'`,
  });
  const etam = (region: string, classification: string, date = "01/10/2026"): Situation => ({
    date,
    [`${BTP} . catégorie`]: "'etam'",
    [`${BTP} . région`]: `'${region}'`,
    [`${BTP} . classification`]: `'${classification}'`,
  });
  const minimum = (situation: Situation) => amount(`${BTP} . salaire minimum conventionnel`, situation);
  const applies = (situation: Situation) => evaluate(`${BTP} . grille applicable`, situation);
  const outOfGrid = (situation: Situation) => evaluate(`${BTP} . classification hors grille`, situation);

  it("Centre-Val de Loire, workers up to 10 employees, from 4 August 2026", () => {
    const expected = { "150": 1823, "170": 1863, "185": 1907, "210": 2056, "230": 2175, "250": 2293, "270": 2412 };
    for (const [coefficient, value] of Object.entries(expected)) {
      assert.equal(minimum(worker("centre val de loire", 10, coefficient)), value, coefficient);
    }
    assert.equal(applies(worker("centre val de loire", 10, "150", "01/08/2026")), false);
    assert.equal(applies(worker("centre val de loire", 10, "150", "04/08/2026")), true);
    // Above 10 employees, the workers are in 1597, whose Centre-Val de Loire grid is not modelled.
    assert.equal(applies(worker("centre val de loire", 11, "150")), false);
  });

  it("Nouvelle-Aquitaine, workers above 10 employees, from 17 January 2026", () => {
    const expected = { "150": 1838.24, "170": 1862.51, "185": 1912.56, "210": 2073.33, "230": 2229.55, "250": 2399.42, "270": 2560.19 };
    for (const [coefficient, value] of Object.entries(expected)) {
      assert.equal(minimum(worker("nouvelle aquitaine", 11, coefficient)), value, coefficient);
    }
    assert.equal(applies(worker("nouvelle aquitaine", 11, "150", "16/01/2026")), false);
    assert.equal(applies(worker("nouvelle aquitaine", 10, "150")), false);
  });

  it("ETAM of Corse from 6 June 2026, and of Occitanie from 29 May 2026", () => {
    const corse = { A: 1827.1, B: 1870.6, C: 1957.61, D: 2117.12, E: 2328.77, F: 2655.83, G: 2959.16, H: 3231.05 };
    const occitanie = { A: 1847.16, B: 1936.54, C: 2061.72, D: 2256.45, E: 2462.01, F: 2902.48, G: 3176.04, H: 3497.5 };
    for (const [level, value] of Object.entries(corse)) assert.equal(minimum(etam("corse", level)), value, level);
    for (const [level, value] of Object.entries(occitanie)) assert.equal(minimum(etam("occitanie", level)), value, level);
    assert.equal(applies(etam("corse", "A", "01/06/2026")), false);
    assert.equal(applies(etam("occitanie", "A", "28/05/2026")), false);
  });

  it("prorates the minimum by working time", () => {
    assert.equal(
      minimum({
        ...etam("occitanie", "B"),
        "salarié . contrat . temps de travail . temps partiel": "oui",
        "salarié . contrat . temps de travail . temps partiel . heures par semaine": "17.5 heure/semaine",
      }),
      Math.round(1936.54 * 50) / 100,
    );
  });

  it("has no minimum and checks no classification without a grid", () => {
    for (const situation of [
      worker("île de france", 50, "150"),
      worker("non renseignée", 50, "150"),
      etam("bretagne", "A"),
      { [`${BTP} . catégorie`]: "'cadre'", [`${BTP} . région`]: "'occitanie'" },
    ]) {
      assert.equal(applies(situation), false);
      assert.equal(minimum(situation), 0);
      assert.equal(outOfGrid(situation), false);
    }
  });

  it("detects a classification absent from the grid that applies", () => {
    assert.equal(outOfGrid(worker("nouvelle aquitaine", 11, "160")), true);
    assert.equal(outOfGrid(worker("nouvelle aquitaine", 11, "non renseignée")), true);
    assert.equal(outOfGrid(etam("occitanie", "I")), true);
    // An ETAM level is not a worker's coefficient.
    assert.equal(outOfGrid(worker("nouvelle aquitaine", 11, "A")), true);
    assert.equal(outOfGrid(etam("occitanie", "H")), false);
  });
});
