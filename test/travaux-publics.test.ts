/**
 * Public works agreements (IDCC 1702, 2614 and 3212), shared version 2026.4
 * (rules/commun/travaux-publics): modele-social's `BTP` rules corrected for public works, and the
 * regional annual minimums of 2026.
 *
 * Expected amounts come from the sources, independently of the YAML:
 * - CNETP paid leave contribution, 21 % from 1 January 2026 (CNETP letter n° 40, January 2026);
 * - bad weather contribution, 0,68 % of the salary capped at the ceiling (4 005 € in 2026, code du
 *   travail D. 5424-36 and D. 5424-37, CNETP);
 * - RNPC (PRO BTP notice 2026): 1,50 % of tranche A for the employer, 2,40 % of tranche B shared;
 * - the regional accords on the 2026 minimums listed in REGIONAL_GRIDS, read on Légifrance on
 *   20 October 2026, each from the publication of its extension order to 31 December 2026.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const AGREEMENTS = ["1702-travaux-publics-ouvriers", "2614-travaux-publics-etam", "3212-travaux-publics-cadres"];
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

describe("public works agreements — one shared version", () => {
  it("publishes the same version 2026.4 for the three agreements, their newest revision", () => {
    const revision = (v: { version: string }) => Number(v.version.split(".")[1]);
    const published = AGREEMENTS.map((name) => {
      const versions = COMPILED_VERSIONS[name]!;
      const found = versions.find((v) => v.version === VERSION);
      assert.ok(found, name);
      assert.ok(versions.every((v) => v === found || v.version.startsWith("2024.") || revision(v) < revision(found)), name);
      return found;
    });
    for (const found of published) {
      assert.equal(found.contentHash, published[0]!.contentHash);
      assert.equal(found.validFrom, "2026-01-01");
    }
  });
});

describe("public works agreements — contributions", () => {
  it("applies the CNETP paid leave rate of 21 %, whatever the CIBTP fund", () => {
    assert.equal(amount(`${BTP} . congés intempéries`), percentOf(2500, 21));
    assert.equal(
      amount(`${BTP} . congés intempéries`, { [`${BTP} . congés intempéries . caisse de rattachement`]: "'méditerranée'" }),
      percentOf(2500, 21),
    );
  });

  it("applies 0,68 % of the capped salary for bad weather, unless within the allowance", () => {
    assert.equal(amount(`${BTP} . chômage intempéries`), percentOf(2500, 0.68));
    assert.equal(amount(`${BTP} . chômage intempéries`, { "salarié . contrat . salaire brut": "6000 €/mois" }), percentOf(CEILING, 0.68));
    assert.equal(amount(`${BTP} . chômage intempéries`, { [`${BTP} . chômage intempéries . sous l'abattement`]: "oui" }), 0);
  });

  it("adds the bad weather contribution to the employer contributions", () => {
    const employer = (below: string) =>
      amount("salarié . cotisations . employeur", { [`${BTP} . chômage intempéries . sous l'abattement`]: below });
    assert.equal(Math.round((employer("non") - employer("oui")) * 100) / 100, percentOf(2500, 0.68));
  });

  it("keeps the PRO BTP prévoyance of the workers and ETAM, and counts the RNPC once", () => {
    const insurance = (category: string, gross: number, share: "employeur" | "salarié") =>
      amount(`salarié . cotisations . prévoyances . incapacité invalidité décès . ${share}`, {
        [`${BTP} . catégorie`]: `'${category}'`,
        "salarié . contrat . salaire brut": `${gross} €/mois`,
      });
    assert.equal(insurance("ouvrier", 2500, "employeur"), percentOf(2500, 1.72));
    assert.equal(insurance("etam", 2500, "employeur"), percentOf(2500, 1.25));
    assert.equal(insurance("cadre", 6000, "employeur"), Math.round(CEILING * 1.5 + (6000 - CEILING) * 1.2) / 100);
    assert.equal(insurance("cadre", 6000, "salarié"), Math.round((6000 - CEILING) * 1.2) / 100);
  });
});

const WORKER = ["100", "110", "125", "140", "150", "165", "180"];
const ETAM = ["A", "B", "C", "D", "E", "F", "G", "H"];

type Grid = {
  region: string;
  /** Publication of the extension orders. */
  from: string;
  workers: number[];
  etam: number[];
  /** ETAM of levels F to H with an annual days-based working time. */
  days: number[];
  texts: string;
};

/** The extended regional accords on the 2026 minimums, as read on Légifrance (€ a year). */
const REGIONAL_GRIDS: Grid[] = [
  { region: "bourgogne franche comté", from: "05/03/2026", workers: [23287, 23785, 24764, 27420, 29345, 31733, 34182], etam: [23287, 24054, 26607, 29066, 31634, 35061, 38922, 39824], days: [40321, 44761, 45797], texts: "KALITEXT000053748293, KALITEXT000053748366" },
  { region: "bretagne", from: "24/02/2026", workers: [23863, 24133, 24621, 27126, 29020, 31711, 34529], etam: [23941, 25034, 26863, 29570, 32110, 35551, 39715, 41936], days: [40883, 45673, 48226], texts: "KALITEXT000054033905, KALITEXT000054034018" },
  { region: "centre val de loire", from: "20/03/2026", workers: [22893, 23337, 23931, 26783, 28683, 29490, 32166], etam: [22899, 23673, 25958, 28118, 31605, 35078, 37494, 38985], days: [40340, 43118, 44833], texts: "KALITEXT000054040344, KALITEXT000054040652" },
  { region: "grand est", from: "20/03/2026", workers: [23294, 23597, 24339, 26978, 28399, 31054, 33525], etam: [23340, 24135, 26050, 28884, 31136, 34612, 38830, 40644], days: [39804, 44655, 46741], texts: "KALITEXT000053973328, KALITEXT000053973475" },
  { region: "hauts de france", from: "20/03/2026", workers: [23305, 23607, 24287, 27148, 29005, 31697, 34577], etam: [23224, 24372, 26334, 28987, 32084, 36038, 39370, 41203], days: [41444, 45275, 47383], texts: "KALITEXT000053914180, KALITEXT000053914252" },
  { region: "île de france", from: "17/04/2026", workers: [23709, 23930, 24826, 27474, 28954, 31886, 34569], etam: [23545, 25372, 27185, 29847, 33260, 37255, 39628, 40624], days: [42843, 45572, 46718], texts: "KALITEXT000054161979, KALITEXT000054162121" },
  { region: "normandie", from: "24/02/2026", workers: [23462, 23552, 24691, 27202, 29145, 31746, 34634], etam: [23542, 23979, 25699, 29281, 31618, 34979, 38839, 40913], days: [40226, 44665, 47050], texts: "KALITEXT000054033890, KALITEXT000054034002" },
  { region: "nouvelle aquitaine", from: "17/04/2026", workers: [23242, 23751, 24210, 26969, 28883, 31214, 34040], etam: [23106, 23874, 26234, 28113, 30745, 34817, 38529, 40138], days: [40039, 44309, 46159], texts: "KALITEXT000054092149, KALITEXT000054092323" },
  { region: "occitanie", from: "20/03/2026", workers: [23160, 23518, 24606, 27301, 29105, 31550, 33928], etam: [23057, 24033, 26546, 28891, 32058, 35970, 39406, 41405], days: [41365, 45317, 47616], texts: "KALITEXT000054040329, KALITEXT000054040636" },
  // The table's header reads « Année 2025 », but the accords' title and article 1er are for 2026.
  { region: "pays de la loire", from: "04/09/2026", workers: [23537, 23733, 24749, 27334, 29301, 31743, 34619], etam: [23535, 24403, 26190, 29006, 31777, 35247, 39418, 42412], days: [40534, 45330, 48774], texts: "KALITEXT000054886381, KALITEXT000054886424" },
];

function dayBefore(date: string): string {
  const [day, month, year] = date.split("/").map(Number) as [number, number, number];
  const previous = new Date(Date.UTC(year, month - 1, day - 1));
  return [previous.getUTCDate(), previous.getUTCMonth() + 1, previous.getUTCFullYear()]
    .map((n, i) => String(n).padStart(i < 2 ? 2 : 4, "0"))
    .join("/");
}

describe("public works agreements — regional annual minimums", () => {
  const situation = (category: string, region: string, classification: string, date = "01/10/2026", days = false): Situation => ({
    date,
    [`${BTP} . catégorie`]: `'${category}'`,
    [`${BTP} . région`]: `'${region}'`,
    [`${BTP} . classification`]: `'${classification}'`,
    [`${BTP} . forfait jours`]: days ? "oui" : "non",
  });
  const minimum = (s: Situation) => {
    const value = evaluate(`${BTP} . salaire minimum conventionnel`, s);
    assert.equal(typeof value, "number");
    return Math.round(value as number);
  };
  const applies = (s: Situation) => evaluate(`${BTP} . grille applicable`, s);
  const outOfGrid = (s: Situation) => evaluate(`${BTP} . classification hors grille`, s);

  for (const grid of REGIONAL_GRIDS) {
    it(`${grid.region}, from ${grid.from} to 31/12/2026 (${grid.texts})`, () => {
      WORKER.forEach((code, i) => assert.equal(minimum(situation("ouvrier", grid.region, code, grid.from)), grid.workers[i], code));
      ETAM.forEach((code, i) => assert.equal(minimum(situation("etam", grid.region, code, grid.from)), grid.etam[i], code));
      ["F", "G", "H"].forEach((code, i) =>
        assert.equal(minimum(situation("etam", grid.region, code, grid.from, true)), grid.days[i], `${code} days`),
      );
      // Below level F, the days-based working time keeps the ETAM grid.
      assert.equal(minimum(situation("etam", grid.region, "E", grid.from, true)), grid.etam[4]);
      assert.equal(applies(situation("ouvrier", grid.region, "100", dayBefore(grid.from))), false);
      assert.equal(applies(situation("etam", grid.region, "A", "01/01/2027")), false);
    });
  }

  it("has no grid in Auvergne-Rhône-Alpes, PACA, Corse and overseas, nor for the executives", () => {
    for (const region of ["auvergne rhône alpes", "PACA", "corse", "non renseignée"]) {
      for (const s of [situation("ouvrier", region, "100"), situation("etam", region, "A")]) {
        assert.equal(applies(s), false, region);
        assert.equal(minimum(s), 0);
        assert.equal(outOfGrid(s), false);
      }
    }
    assert.equal(applies(situation("cadre", "île de france", "A1")), false);
  });

  it("prorates the minimum by working time", () => {
    assert.equal(
      minimum({
        ...situation("etam", "bretagne", "B"),
        "salarié . contrat . temps de travail . temps partiel": "oui",
        "salarié . contrat . temps de travail . temps partiel . heures par semaine": "17.5 heure/semaine",
      }),
      Math.round(25034 / 2),
    );
  });

  it("detects a classification absent from the grid that applies", () => {
    assert.equal(outOfGrid(situation("ouvrier", "bretagne", "160")), true);
    assert.equal(outOfGrid(situation("ouvrier", "bretagne", "non renseignée")), true);
    assert.equal(outOfGrid(situation("etam", "bretagne", "I")), true);
    assert.equal(outOfGrid(situation("ouvrier", "bretagne", "A")), true);
    assert.equal(outOfGrid(situation("etam", "bretagne", "H", "01/10/2026", true)), false);
  });
});
