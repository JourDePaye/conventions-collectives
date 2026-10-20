/**
 * Building agreements (IDCC 1596, 1597, 2609 and 2420), shared versions 2026.4 and 2026.5
 * (rules/commun/batiment): modele-social's `BTP` rules corrected, and the regional grids (four in
 * 2026.4, every region in 2026.5).
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
 * - 2026.5: the regional accords listed in REGIONAL_GRIDS below, read on Légifrance on
 *   20 October 2026, each from the publication of its extension order.
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
const VERSION = "2026.5";
const BTP = "salarié . convention collective . BTP";
const CEILING = 4005;

async function engineOf(versionName: string) {
  const found = COMPILED_VERSIONS[AGREEMENTS[0]!]!.find((v) => v.version === versionName);
  assert.ok(found, versionName);
  const rules: Record<string, Rule> = { ...modeleSocial, ...(await found.loadRules()) };
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}
const engine = await engineOf(VERSION);
const previous = await engineOf("2026.4");

type Situation = Record<string, string>;

function evaluate(rule: string, situation: Situation, on = engine): number | boolean | string | null | undefined {
  on.setSituation({
    date: "01/10/2026",
    "salarié . convention collective": "'BTP'",
    "salarié . contrat . salaire brut": "2500 €/mois",
    ...situation,
  });
  return on.evaluate(rule).nodeValue as number | boolean | string | null | undefined;
}

const amount = (rule: string, situation: Situation = {}) => {
  const value = evaluate(rule, situation);
  assert.equal(typeof value, "number", rule);
  return Math.round((value as number) * 100) / 100;
};

const percentOf = (base: number, rate: number) => Math.round(base * rate) / 100;

describe("building agreements — one shared version", () => {
  it("publishes the same versions 2026.4 and 2026.5 for the four agreements, 2026.5 their newest", () => {
    // Sorted by effective date, they come first (2020): a consumer selects 2026.4 as the first
    // version to use, and leaves the older revisions of each agreement aside.
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
    for (const name of AGREEMENTS) {
      assert.ok(COMPILED_VERSIONS[name]!.some((v) => v.version === "2026.4"), name);
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

const WORKER = ["150", "170", "185", "210", "230", "250", "270"];
const ETAM = ["A", "B", "C", "D", "E", "F", "G", "H"];

type Grid = {
  category: "ouvrier" | "etam";
  region: string;
  /** For the workers' grids of a single size: up to 10 employees (IDCC 1596) or more (1597). */
  small?: boolean;
  /** Publication of the extension order (or the later effective date), and the end if replaced. */
  from: string;
  until?: string;
  /** Monthly minimums for 35 hours, by coefficient 150 to 270 or level A to H. */
  amounts: number[];
  text: string;
};

/** The extended regional accords, as read on Légifrance (amounts of their tables). */
const REGIONAL_GRIDS: Grid[] = [
  { category: "ouvrier", region: "auvergne rhône alpes", from: "17/04/2026", amounts: [1824, 1864, 1909, 2099.14, 2277.47, 2449.27, 2597.13], text: "KALITEXT000054066628" },
  { category: "ouvrier", region: "bourgogne franche comté", from: "04/09/2026", until: "01/01/2027", amounts: [1850, 1868, 1898, 2080, 2226, 2372, 2518], text: "KALITEXT000054887678" },
  { category: "ouvrier", region: "bourgogne franche comté", from: "01/01/2027", amounts: [1859, 1877, 1907, 2091, 2237, 2384, 2531], text: "KALITEXT000054887678" },
  { category: "ouvrier", region: "bretagne", from: "05/02/2026", amounts: [1863.43, 1868.17, 1917.7, 2064.78, 2234.67, 2404.54, 2574.41], text: "KALITEXT000053715857" },
  { category: "ouvrier", region: "centre val de loire", small: true, from: "04/08/2026", amounts: [1823, 1863, 1907, 2056, 2175, 2293, 2412], text: "KALITEXT000054936694" },
  { category: "ouvrier", region: "centre val de loire", small: false, from: "10/07/2026", amounts: [1823, 1853, 1898, 2045, 2165, 2283, 2400], text: "KALITEXT000054434535" },
  { category: "ouvrier", region: "corse", from: "06/06/2026", amounts: [1827.1, 1870.6, 1932.59, 2100.92, 2274.76, 2448.6, 2622.44], text: "KALITEXT000054092025" },
  { category: "ouvrier", region: "grand est", from: "03/05/2025", amounts: [1802.8, 1864.76, 1896.79, 2101.77, 2237.79, 2394.78, 2578.38], text: "KALITEXT000051664778" },
  { category: "ouvrier", region: "hauts de france", small: true, from: "28/03/2026", amounts: [1832, 1857, 1955, 2111, 2269, 2469, 2650], text: "KALITEXT000053973255" },
  // The accord of 1 December 2025 for 1597 is not extended: the accord of 2024 binds every company.
  { category: "ouvrier", region: "hauts de france", small: false, from: "01/07/2025", amounts: [1808, 1833, 1930, 2084, 2240, 2437, 2616], text: "KALITEXT000051314737" },
  { category: "ouvrier", region: "île de france", from: "05/02/2026", amounts: [1843, 1855, 1899, 2038, 2164, 2292, 2510], text: "KALITEXT000053504239" },
  { category: "ouvrier", region: "normandie", from: "10/05/2026", amounts: [1823.03, 1845.73, 1884.22, 2065.63, 2210.88, 2380.23, 2527.04], text: "KALITEXT000054303863" },
  { category: "ouvrier", region: "nouvelle aquitaine", from: "17/01/2026", amounts: [1838.24, 1862.51, 1912.56, 2073.33, 2229.55, 2399.42, 2560.19], text: "KALITEXT000053497377" },
  { category: "ouvrier", region: "occitanie", from: "29/05/2026", amounts: [1836.33, 1851.8, 1902.53, 2084.9, 2248.73, 2380.1, 2547.01], text: "KALITEXT000054337421" },
  // In force on the first day of the month after the JORF of 4 February 2026.
  { category: "ouvrier", region: "pays de la loire", from: "01/03/2026", amounts: [1832.17, 1850.37, 1864.02, 2064.23, 2244.72, 2425.2, 2607.21], text: "KALITEXT000053504214" },
  { category: "ouvrier", region: "PACA", from: "03/01/2025", amounts: [1837.8, 1868.43, 1975.12, 2170.8, 2340.59, 2510.38, 2680.18], text: "KALITEXT000050962279" },
  { category: "etam", region: "auvergne rhône alpes", from: "17/04/2026", amounts: [1834, 1884, 1994.18, 2130.73, 2377.33, 2723.69, 2993.52, 3341.81], text: "KALITEXT000054066750" },
  { category: "etam", region: "bourgogne franche comté", from: "04/09/2026", until: "01/01/2027", amounts: [1850, 1885, 1986, 2170, 2428, 2704, 3035, 3227], text: "KALITEXT000054887775" },
  { category: "etam", region: "bourgogne franche comté", from: "01/01/2027", amounts: [1859, 1894, 1996, 2181, 2440, 2717, 3050, 3243], text: "KALITEXT000054887775" },
  { category: "etam", region: "bretagne", from: "05/02/2026", amounts: [1857, 1943, 2055, 2191, 2368, 2699, 3010, 3354], text: "KALITEXT000053715945" },
  // The accord of 10 April 2026 is not extended.
  { category: "etam", region: "centre val de loire", from: "26/04/2025", amounts: [1808, 1907, 2049, 2185, 2419, 2777, 3042, 3311], text: "KALITEXT000051493772" },
  { category: "etam", region: "corse", from: "06/06/2026", amounts: [1827.1, 1870.6, 1957.61, 2117.12, 2328.77, 2655.83, 2959.16, 3231.05], text: "KALITEXT000054092314" },
  { category: "etam", region: "grand est", from: "03/05/2025", amounts: [1870.77, 1962.82, 2077.62, 2234.63, 2483.08, 2764.2, 3110.99, 3346.39], text: "KALITEXT000051664849" },
  { category: "etam", region: "hauts de france", from: "28/03/2026", amounts: [1838, 1938, 2091, 2256, 2451, 2818, 3149, 3365], text: "KALITEXT000054040626" },
  { category: "etam", region: "île de france", from: "05/02/2026", amounts: [1843, 1932, 2057, 2239, 2407, 2841, 3119, 3357], text: "KALITEXT000053504320" },
  { category: "etam", region: "normandie", from: "10/05/2026", amounts: [1833.19, 1937.51, 2104.47, 2324.55, 2493.65, 2763.06, 3082.36, 3386.15], text: "KALITEXT000054303973" },
  { category: "etam", region: "nouvelle aquitaine", from: "17/01/2026", amounts: [1838.24, 1882.98, 1986.16, 2115.49, 2368.73, 2699.39, 3039.3, 3423.86], text: "KALITEXT000053497521" },
  { category: "etam", region: "occitanie", from: "29/05/2026", amounts: [1847.16, 1936.54, 2061.72, 2256.45, 2462.01, 2902.48, 3176.04, 3497.5], text: "KALITEXT000054337649" },
  { category: "etam", region: "PACA", from: "03/01/2025", amounts: [1825, 1940, 2080, 2295, 2480, 2770, 3020, 3310], text: "KALITEXT000050962368" },
];

/** The day before a dd/mm/yyyy date. */
function dayBefore(date: string): string {
  const [day, month, year] = date.split("/").map(Number) as [number, number, number];
  const previousDay = new Date(Date.UTC(year, month - 1, day - 1));
  return [previousDay.getUTCDate(), previousDay.getUTCMonth() + 1, previousDay.getUTCFullYear()]
    .map((n, i) => String(n).padStart(i < 2 ? 2 : 4, "0"))
    .join("/");
}

describe("building agreements — regional grids", () => {
  const situation = (category: string, region: string, headcount: number, classification: string, date: string): Situation => ({
    date,
    [`${BTP} . catégorie`]: `'${category}'`,
    "entreprise . salariés . effectif": `${headcount} employé`,
    [`${BTP} . région`]: `'${region}'`,
    [`${BTP} . classification`]: `'${classification}'`,
  });
  const worker = (region: string, headcount: number, classification: string, date = "01/10/2026") =>
    situation("ouvrier", region, headcount, classification, date);
  const etam = (region: string, classification: string, date = "01/10/2026") =>
    situation("etam", region, 20, classification, date);
  const minimum = (s: Situation, on = engine) => {
    const value = evaluate(`${BTP} . salaire minimum conventionnel`, s, on);
    assert.equal(typeof value, "number");
    return Math.round((value as number) * 100) / 100;
  };
  const applies = (s: Situation, on = engine) => evaluate(`${BTP} . grille applicable`, s, on);
  const outOfGrid = (s: Situation) => evaluate(`${BTP} . classification hors grille`, s);

  for (const grid of REGIONAL_GRIDS) {
    const size = grid.small === undefined ? "" : grid.small ? ", up to 10 employees" : ", above 10 employees";
    it(`${grid.category} of ${grid.region}${size}, from ${grid.from}${grid.until ? ` to ${grid.until}` : ""} (${grid.text})`, () => {
      const codes = grid.category === "ouvrier" ? WORKER : ETAM;
      const headcounts = grid.small === undefined ? [5, 50] : grid.small ? [10] : [11];
      for (const headcount of headcounts) {
        codes.forEach((code, index) => {
          const at = situation(grid.category, grid.region, headcount, code, grid.from);
          assert.equal(minimum(at), grid.amounts[index], `${code}, ${headcount} employees`);
          assert.equal(outOfGrid(at), false);
        });
        // The grid of the same region before: an older one, or none.
        const before = situation(grid.category, grid.region, headcount, codes[0]!, dayBefore(grid.from));
        const older = REGIONAL_GRIDS.find(
          (g) => g !== grid && g.category === grid.category && g.region === grid.region && g.until === grid.from,
        );
        if (older) assert.equal(minimum(before), older.amounts[0]);
        else assert.equal(applies(before), false);
      }
    });
  }

  it("covers every region for the workers, and every region but Pays de la Loire for the ETAM", () => {
    for (const region of ["auvergne rhône alpes", "bourgogne franche comté", "bretagne", "centre val de loire", "corse", "grand est", "hauts de france", "île de france", "normandie", "nouvelle aquitaine", "occitanie", "pays de la loire", "PACA"]) {
      assert.equal(applies(worker(region, 5, "150")), true, region);
      assert.equal(applies(worker(region, 50, "150")), true, region);
      assert.equal(applies(etam(region, "A")), region !== "pays de la loire", region);
    }
  });

  it("applies the Nouvelle-Aquitaine workers' grid to companies up to 10 employees from 2026.5", () => {
    assert.equal(minimum(worker("nouvelle aquitaine", 10, "270")), 2560.19);
    // 2026.4 applied it above 10 employees only.
    assert.equal(applies(worker("nouvelle aquitaine", 10, "270"), previous), false);
    assert.equal(minimum(worker("nouvelle aquitaine", 11, "270"), previous), 2560.19);
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
    for (const s of [
      worker("non renseignée", 50, "150"),
      etam("pays de la loire", "A"),
      worker("île de france", 50, "150", "01/01/2026"),
      { [`${BTP} . catégorie`]: "'cadre'", [`${BTP} . région`]: "'occitanie'" },
    ]) {
      assert.equal(applies(s), false);
      assert.equal(minimum(s), 0);
      assert.equal(outOfGrid(s), false);
    }
  });

  it("detects a classification absent from the grid that applies", () => {
    assert.equal(outOfGrid(worker("nouvelle aquitaine", 11, "160")), true);
    assert.equal(outOfGrid(worker("bretagne", 5, "non renseignée")), true);
    assert.equal(outOfGrid(etam("occitanie", "I")), true);
    // An ETAM level is not a worker's coefficient.
    assert.equal(outOfGrid(worker("île de france", 11, "A")), true);
    assert.equal(outOfGrid(etam("occitanie", "H")), false);
  });
});
