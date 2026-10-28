/**
 * The `indemnité de rupture` rules of the agreements that have them: months of the salary of
 * reference, with the figures of each text (read on Légifrance on 28 October 2026, see each
 * version's sources), independent of the YAML.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { terminationEngine } from "./termination-indemnity.ts";

const near = (actual: number, expected: number, label = "") =>
  assert.ok(Math.abs(actual - expected) < 1e-6, `${label} ${actual} ≠ ${expected}`);

describe("1486 Syntec", async () => {
  const { of } = await terminationEngine("1486-syntec", "2026.5", "syntec");

  it("gives the dismissal indemnity of the ETAM and of the engineers and managers (article 4.5)", () => {
    near(of(7).dismissal, 0, "under 8 months");
    near(of(8).dismissal, 8 / 12 / 4, "8 months, ETAM");
    near(of(144).dismissal, 10 / 4 + 2 / 3, "12 years, ETAM");
    near(of(18, { cadre: true }).dismissal, 1.5 / 4, "18 months, cadre");
    near(of(24, { cadre: true }).dismissal, 2 / 3, "2 years, cadre");
    near(of(144, { cadre: true }).dismissal, 4, "12 years, cadre");
  });

  it("gives the retirement indemnities (articles 4.6 and 4.8)", () => {
    near(of(59).voluntaryRetirement, 0, "under 5 years");
    near(of(60).voluntaryRetirement, 1, "5 years");
    near(of(71).voluntaryRetirement, 1, "5 years and 11 months");
    near(of(72).voluntaryRetirement, 1.2, "6 years");
    near(of(240).voluntaryRetirement, 4, "20 years");
    near(of(144).forcedRetirement, 10 / 4 + 2 / 3, "forced retirement as the dismissal");
    near(of(144).conventionalTermination, 0, "no text for a conventional termination");
  });
});

const years = (count: number) => count * 12;

describe("3248 métallurgie", async () => {
  const groupsAE = await terminationEngine("3248-metallurgie", "2026.6", "métallurgie", { niveau: "'C5'" });
  const groupsFI = await terminationEngine("3248-metallurgie", "2026.6", "métallurgie", { niveau: "'F11'" });

  it("gives the dismissal indemnity of the groups A to E (article 75.3.1.1)", () => {
    near(groupsAE.of(7).dismissal, 0, "under 8 months");
    near(groupsAE.of(years(12)).dismissal, 10 / 4 + 2 / 3, "12 years");
    near(groupsAE.of(years(12)).conventionalTermination, 10 / 4 + 2 / 3, "conventional termination (76.2)");
  });

  it("gives the dismissal indemnity of the groups F to I, with the age majorations, reductions and cap (articles 75.3.1.2 and 75.3.3)", () => {
    near(groupsFI.of(years(5), { age: 40 }).dismissal, 5 / 4, "5 years");
    near(groupsFI.of(years(10), { age: 40 }).dismissal, 7 / 5 + 3 * 0.6, "10 years");
    near(groupsFI.of(years(10), { age: 52 }).dismissal, 3.2 * 1.2, "10 years, 52 years old");
    near(groupsFI.of(years(10), { age: 56 }).dismissal, 6, "10 years, 56 years old: at least 6 months");
    near(groupsFI.of(years(5), { age: 52 }).dismissal, 3, "5 years, 52 years old: at least 3 months");
    near(groupsFI.of(years(4), { age: 52 }).dismissal, 1, "under 5 years: no majoration");
    near(groupsFI.of(years(30), { age: 40 }).dismissal, 1.4 + 23 * 0.6, "30 years");
    near(groupsFI.of(years(40), { age: 40 }).dismissal, 18, "capped at 18 months");
    near(groupsFI.of(years(10), { age: 61 }).dismissal, 3.2 * 0.95, "61 years old");
    near(groupsFI.of(years(10), { age: 62 }).dismissal, 3.2 * 0.9, "62 years old");
    near(groupsFI.of(years(10), { age: 63 }).dismissal, 3.2 * 0.8, "63 years old");
    near(groupsFI.of(years(10), { age: 64 }).dismissal, 3.2 * 0.6, "64 years old");
    near(groupsAE.of(years(10), { age: 64 }).dismissal, 2.5, "no reduction for the groups A to E");
  });

  it("gives the voluntary retirement indemnity by seniority (article 77.3)", () => {
    for (const [seniority, months] of [[1, 0], [2, 0.5], [5, 1], [10, 2], [20, 3], [30, 4], [35, 5], [40, 6]] as const) {
      near(groupsAE.of(years(seniority)).voluntaryRetirement, months, `${seniority} years`);
    }
    near(groupsAE.of(23).voluntaryRetirement, 0, "under 2 years");
    near(groupsAE.of(years(10)).forcedRetirement, 0, "forced retirement: the legal indemnity (article 78.3)");
  });
});

describe("1979 hôtels cafés restaurants", async () => {
  for (const revision of ["2024.5", "2026.4"]) {
    const { of } = await terminationEngine("1979-hotels-cafes-restaurants", revision, "hôtels cafés restaurants", { niveau: "'I.1'" });

    it(`gives the dismissal and retirement indemnities in ${revision} (articles 32 and 33, avenant n° 1 article 14)`, () => {
      near(of(23).dismissal, 0, "under 2 years");
      near(of(24).dismissal, 0.2, "2 years");
      near(of(years(12)).dismissal, 1 + 2 / 6, "12 years");
      near(of(years(12)).forcedRetirement, 1 + 2 / 6, "forced retirement as the dismissal");
      near(of(years(12)).conventionalTermination, 0, "no text for a conventional termination");
      for (const [seniority, months] of [[9, 0], [10, 0.5], [15, 1], [20, 1.5], [30, 2]] as const) {
        near(of(years(seniority)).voluntaryRetirement, months, `${seniority} years`);
      }
      for (const [seniority, months] of [[4, 0], [5, 1], [10, 2], [15, 2.5], [20, 3], [25, 3.5], [30, 4.5]] as const) {
        near(of(years(seniority), { cadre: true }).voluntaryRetirement, months, `${seniority} years, cadre`);
      }
    });
  }
});

describe("2216 commerce alimentaire", async () => {
  const staff = await terminationEngine("2216-commerce-detail-gros-predominance-alimentaire", "2026.6", "commerce alimentaire", { niveau: "'2B'" });
  const managers = await terminationEngine("2216-commerce-detail-gros-predominance-alimentaire", "2026.6", "commerce alimentaire", { niveau: "'7'" });

  it("gives the dismissal indemnity of the annexes I and II, and of the annexe III (article 7)", () => {
    near(staff.of(7).dismissal, 0, "under 8 months");
    near(staff.of(years(12)).dismissal, 10 / 4 + 2 / 3, "12 years");
    near(staff.of(years(12)).conventionalTermination, 10 / 4 + 2 / 3, "conventional termination (3.12)");
    near(staff.of(years(12)).forcedRetirement, 10 / 4 + 2 / 3, "forced retirement (8.3)");
    near(managers.of(years(4)).dismissal, 1, "cadre, 4 years");
    near(managers.of(years(5)).dismissal, 1.25, "cadre, 5 years");
    near(managers.of(years(6)).dismissal, 1.8, "cadre, 6 years");
    near(managers.of(years(12)).dismissal, 3 + 0.4 * 2, "cadre, 12 years");
    near(managers.of(years(25)).dismissal, 3 + 4 + 2.5, "cadre, 25 years");
    near(managers.of(years(35)).dismissal, 12, "cadre, capped at 12 months");
    near(managers.of(years(45)).dismissal, 12 + 5 / 3, "cadre, beyond 40 years");
  });

  it("gives the voluntary retirement indemnity (article 8.2)", () => {
    near(staff.of(years(9)).voluntaryRetirement, 0, "under 10 years");
    near(staff.of(years(10)).voluntaryRetirement, 1, "10 years");
    near(staff.of(years(20)).voluntaryRetirement, 2.5, "20 years");
    near(staff.of(years(40)).voluntaryRetirement, 4, "capped at 4 months");
    near(managers.of(years(4)).voluntaryRetirement, 0, "cadre, under 5 years");
    near(managers.of(years(5)).voluntaryRetirement, 0.5, "cadre, 5 years");
    near(managers.of(years(20)).voluntaryRetirement, 2.5, "cadre, 20 years");
    near(managers.of(years(30)).voluntaryRetirement, 5, "cadre, 30 years");
    near(managers.of(years(35)).voluntaryRetirement, 6, "cadre, capped at 6 months");
  });
});

describe("1517 commerce de détail non alimentaire", async () => {
  const { of } = await terminationEngine("1517-commerce-detail-non-alimentaire", "2026.3", "commerce de détail non alimentaire");

  it("gives the dismissal and retirement indemnities (articles 4, 6 and 8)", () => {
    near(of(7).dismissal, 0, "under 8 months");
    near(of(8).dismissal, 8 / 12 / 4, "8 months");
    near(of(years(12)).dismissal, 2.5 + 2 * 0.4, "12 years");
    near(of(years(12)).forcedRetirement, 2.5 + 2 * 0.4, "forced retirement");
    near(of(years(12)).conventionalTermination, 0, "no text for a conventional termination");
    for (const [seniority, months] of [[9, 0], [10, 1], [15, 1.5], [20, 2], [25, 2.5], [30, 3]] as const) {
      near(of(years(seniority)).voluntaryRetirement, months, `${seniority} years`);
    }
  });
});

describe("1501 restauration rapide", async () => {
  for (const revision of ["2026.5", "2026.6"]) {
    const { of } = await terminationEngine("1501-restauration-rapide", revision, "restauration rapide");

    it(`gives the dismissal and retirement indemnities in ${revision} (articles 13 and 28)`, () => {
      near(of(23).dismissal, 0, "under 2 years");
      near(of(24).dismissal, 0.2, "2 years");
      near(of(years(12)).dismissal, 1 + 2 / 6, "12 years");
      near(of(years(20)).dismissal, 1 + 5 / 6 + 5 * (7 / 30), "20 years");
      near(of(years(4), { cadre: true }).dismissal, 0.4, "cadre, 4 years");
      near(of(years(5), { cadre: true }).dismissal, 0.5, "cadre, 5 years");
      near(of(years(6), { cadre: true }).dismissal, 1.2 + 1 / 15, "cadre, 6 years");
      near(of(years(10), { cadre: true }).dismissal, 2 + 5 / 15, "cadre, 10 years");
      near(of(years(12), { cadre: true }).dismissal, 2.4 + 5 / 15 + 2 * (2 / 15), "cadre, 12 years");
      near(of(years(20), { cadre: true }).dismissal, 4 + 5 / 15 + 5 * (2 / 15) + 5 * (3 / 15), "cadre, 20 years");
      for (const [seniority, months] of [[9, 0], [10, 1], [15, 2], [20, 3], [30, 4]] as const) {
        near(of(years(seniority)).voluntaryRetirement, months, `${seniority} years`);
      }
      near(of(years(12)).forcedRetirement, 0, "forced retirement: the law");
    });
  }
});

describe("3043 propreté", async () => {
  const { of } = await terminationEngine("3043-entreprises-proprete", "2026.3", "propreté", { niveau: "'AQS1-A'" });

  it("gives the dismissal and retirement indemnities (articles 4.11.3 and 4.12)", () => {
    near(of(23).dismissal, 0, "under 2 years");
    near(of(24).dismissal, 0.2, "2 years");
    near(of(years(5)).dismissal, 0.5, "5 years");
    near(of(years(10)).dismissal, 0.5 + 5 / 6, "10 years");
    near(of(years(12)).dismissal, 0.5 + 5 / 6 + 2 / 5, "12 years");
    near(of(years(12)).forcedRetirement, 0.5 + 5 / 6 + 2 / 5, "forced retirement as the dismissal");
    for (const [seniority, months] of [[9, 0], [10, 0.5], [15, 1], [20, 1.5], [30, 2.5]] as const) {
      near(of(years(seniority)).voluntaryRetirement, months, `${seniority} years`);
    }
  });
});

describe("1090 services de l'automobile", async () => {
  const { of } = await terminationEngine("1090-services-automobile", "2026.3", "services automobile", { niveau: "'5'" });

  it("gives the dismissal indemnity of the legal scale (articles 2.13 and 4.11)", () => {
    near(of(7).dismissal, 0, "under 8 months");
    near(of(years(12)).dismissal, 10 / 4 + 2 / 3, "12 years");
    near(of(years(12)).voluntaryRetirement, 0, "no retirement indemnity beyond the law");
    near(of(years(12)).forcedRetirement, 0, "no retirement indemnity beyond the law");
  });
});

describe("0044 industries chimiques", async () => {
  const workers = await terminationEngine("0044-industries-chimiques", "2026.6", "industries chimiques", { coefficient: 190 });
  const supervisors = await terminationEngine("0044-industries-chimiques", "2026.6", "industries chimiques", { coefficient: 250 });
  const managers = await terminationEngine("0044-industries-chimiques", "2026.6", "industries chimiques", { coefficient: 400 });

  it("gives the dismissal indemnity of the workers, supervisors and managers (avenants 1, 2 and 3)", () => {
    near(workers.of(23).dismissal, 0, "under 2 years");
    near(workers.of(years(10)).dismissal, 3, "worker, 10 years");
    near(workers.of(years(10), { age: 52 }).dismissal, 4, "worker, 52 years old: 1 month");
    near(workers.of(years(10), { age: 56 }).dismissal, 5, "worker, 56 years old: 2 months");
    near(workers.of(years(4), { age: 56 }).dismissal, 1.2, "worker, under 5 years: no majoration");
    near(workers.of(years(45), { age: 56 }).dismissal, 14, "worker, capped at 14 months");
    near(supervisors.of(years(5)).dismissal, 1.5, "supervisor, 5 years");
    near(supervisors.of(years(10)).dismissal, 4, "supervisor, 10 years");
    near(supervisors.of(years(20)).dismissal, 10, "supervisor, 20 years");
    near(supervisors.of(years(5), { age: 51 }).dismissal, 2.5, "supervisor, 51 years old");
    near(supervisors.of(years(40)).dismissal, 18, "supervisor, capped at 18 months");
    near(managers.of(years(2), { cadre: true }).dismissal, 0.8, "manager, 2 years");
    near(managers.of(years(10), { cadre: true }).dismissal, 4, "manager, 10 years");
    near(managers.of(years(12), { cadre: true }).dismissal, 4 + 1.2, "manager, 12 years");
    near(managers.of(years(20), { cadre: true }).dismissal, 4 + 3 + 4, "manager, 20 years");
    near(managers.of(years(5), { cadre: true, age: 46 }).dismissal, 2 + 1, "manager, 46 years old: 1 month");
    near(managers.of(years(5), { cadre: true, age: 56 }).dismissal, 2 + 2, "manager, 56 years old: 2 months");
    near(managers.of(years(30), { cadre: true, age: 56 }).dismissal, 20, "manager, capped at 20 months");
  });

  it("gives the retirement allowance by seniority (clauses générales, article 21 bis)", () => {
    for (const [seniority, months] of [[4, 0], [5, 1.5], [10, 2.5], [15, 3], [20, 4], [25, 4.5], [30, 5], [35, 6], [40, 7.5]] as const) {
      near(workers.of(years(seniority)).voluntaryRetirement, months, `${seniority} years`);
    }
    near(workers.of(years(10)).forcedRetirement, 0, "forced retirement: the law");
  });
});

describe("2120 banque", async () => {
  const { of } = await terminationEngine("2120-banque", "2026.4", "banque", { niveau: "'D'" });

  it("gives the dismissal indemnity by semester, with the caps (article 26.2)", () => {
    near(of(11).dismissal, 0, "under a year");
    near(of(12).dismissal, 0.4, "1 year: 2 semesters from 2002");
    near(of(years(10)).dismissal, 4, "10 years");
    near(of(years(40)).dismissal, 15, "capped at 15 monthly amounts");
    // Hired in 1996: 6 years before 2002 (12 semesters), 24 years after (48 semesters).
    near(of(years(30), { "ancienneté avant 2002": years(6) }).dismissal, 12 * 0.5 * (13 / 14.5) + 48 * 0.2, "30 years, hired in 1996");
    near(of(years(40), { "ancienneté avant 2002": years(40), "embauche avant 2000": true }).dismissal, 18 * (13 / 14.5), "technician hired before 2000: capped at 18 x 13/14.5");
    near(of(years(40), { "ancienneté avant 2002": years(40), "embauche avant 2000": true, cadre: true }).dismissal, 24 * (13 / 14.5), "cadre hired before 2000: capped at 24 x 13/14.5");
  });

  it("gives the retirement indemnity, and the majoration of the forced retirement before 65 (articles 31 and 32)", () => {
    for (const [seniority, months] of [[9, 0], [10, 2 / 3], [14, 2 / 3], [15, 1.25], [20, 2], [29, 2], [30, 2.5], [33, 2.5 + 3 / 20]] as const) {
      near(of(years(seniority)).voluntaryRetirement, months, `${seniority} years`);
    }
    near(of(years(20)).forcedRetirement, 0, "the legal indemnity");
    for (const [age, rate] of [[59, 0], [60, 0.025], [61, 0.02], [62, 0.015], [63, 0.01], [64, 0.005], [65, 0]] as const) {
      near(of(years(20), { age }).forcedRetirementSupplement, 20 * rate, `${age} years old`);
    }
  });
});

describe("second lot of agreements", async () => {
  const lot = (model: string, revision: string, value: string, classification: Record<string, string | number> = {}) =>
    terminationEngine(model, revision, value, classification);

  it("0016 transports routiers: congédiement and retirement of the annexes I to IV", async () => {
    const workers = await lot("0016-transports-routiers", "2026.5", "transports routiers", { niveau: "'M-O-128'" });
    const technicians = await lot("0016-transports-routiers", "2026.5", "transports routiers", { niveau: "'M-T-175'" });
    const managers = await lot("0016-transports-routiers", "2026.5", "transports routiers", { niveau: "'M-C-113'" });
    near(workers.of(23).dismissal, 0, "under 2 years");
    near(workers.of(24).dismissal, 0.2, "2 years");
    near(workers.of(35).dismissal, 35 / 12 / 10, "under 3 years");
    near(workers.of(years(3)).dismissal, 0.6, "3 years");
    near(workers.of(years(10)).dismissal, 2, "10 years");
    near(technicians.of(years(3)).dismissal, 0.9, "technician, 3 years");
    near(technicians.of(years(10)).dismissal, 3, "technician, 10 years");
    near(managers.of(35).dismissal, 0, "manager, under 3 years");
    near(managers.of(years(10), { cadre: true }).dismissal, 4, "manager, 10 years");
    for (const [seniority, months] of [[9, 0], [10, 0.5], [15, 1], [20, 1.5], [25, 2], [30, 2.5]] as const) {
      near(workers.of(years(seniority)).voluntaryRetirement, months, `${seniority} years`);
      near(workers.of(years(seniority)).forcedRetirement, months, `${seniority} years, forced`);
    }
    near(managers.of(years(10), { cadre: true }).voluntaryRetirement, 0.54, "manager, 10 years");
    near(managers.of(years(30), { cadre: true }).voluntaryRetirement, 3, "manager, 30 years");
  });

  it("0573 commerces de gros and 0787 experts-comptables", async () => {
    const wholesale = await lot("0573-commerces-de-gros", "2026.4", "commerces de gros");
    near(wholesale.of(11).dismissal, 0, "under a year");
    near(wholesale.of(12).dismissal, 0.2, "1 year");
    near(wholesale.of(years(12)).dismissal, 2 + 2 / 3, "12 years");
    near(wholesale.of(23).voluntaryRetirement, 0, "under 2 years");
    near(wholesale.of(24).voluntaryRetirement, 0.2, "2 years");
    near(wholesale.of(years(40)).voluntaryRetirement, 3, "capped at 3 months");
    near(wholesale.of(years(10)).forcedRetirement, 1, "forced retirement");
    const accountants = await lot("0787-experts-comptables", "2026.4", "experts-comptables");
    near(accountants.of(59).voluntaryRetirement, 0, "under 5 years");
    near(accountants.of(years(5)).voluntaryRetirement, 0.5, "5 years");
    near(accountants.of(years(8)).voluntaryRetirement, 0.8, "8 years");
    near(accountants.of(years(8)).dismissal, 0, "the law");
  });

  it("0843 boulangerie-pâtisserie artisanale: retirement by seniority", async () => {
    const { of } = await lot("0843-boulangerie-patisserie-artisanale", "2026.4", "boulangerie-pâtisserie artisanale");
    for (const [seniority, months] of [[9, 0], [10, 2], [15, 2.5], [20, 3], [25, 3.5], [30, 4], [39, 4.9], [40, 6]] as const) {
      near(of(years(seniority)).voluntaryRetirement, months, `${seniority} years`);
      near(of(years(seniority)).forcedRetirement, months, `${seniority} years, forced`);
    }
  });

  it("1043 gardiens: the scale of article 16 and the categories A and B of article 17", async () => {
    const b = await lot("1043-gardiens-concierges-employes-immeubles", "2026.6", "gardiens concierges et employés d'immeubles", { "catégorie": "'B'" });
    const a = await lot("1043-gardiens-concierges-employes-immeubles", "2026.6", "gardiens concierges et employés d'immeubles", { "catégorie": "'A'" });
    near(b.of(11).dismissal, 0, "under a year");
    near(b.of(12).dismissal, 0.2, "1 year");
    near(b.of(years(7)).dismissal, 1.4, "7 years");
    near(b.of(years(19)).dismissal, 1.4 + 12 * (1 / 5 + 2 / 15), "19 years");
    near(b.of(years(25)).dismissal, 1.4 + 12 * (1 / 5 + 2 / 15) + 6 * (1 / 5 + 2 / 15 + 1 / 10), "25 years");
    near(b.of(years(7)).voluntaryRetirement, 1.4, "category B, voluntary retirement");
    near(b.of(years(7)).forcedRetirement, 1.4, "category B, forced retirement");
    near(a.of(years(10)).voluntaryRetirement, 0.5, "category A, 10 years");
    near(a.of(years(30)).voluntaryRetirement, 2, "category A, 30 years");
    near(a.of(years(7)).forcedRetirement, 1.4, "category A, forced retirement as the scale");
  });

  it("1266 restauration collective: scales of the employees and the managers", async () => {
    const { of } = await lot("1266-restauration-collective", "2025.3", "restauration collective");
    near(of(11).dismissal, 0, "under a year");
    near(of(years(12)).dismissal, 2 + 2 / 3, "12 years");
    near(of(years(12), { cadre: true }).dismissal, 1 + 4 / 3 + 2 / 3, "cadre, 12 years");
    near(of(years(20), { cadre: true }).dismissal, 1 + 4 / 3 + 5 / 3 + 2, "cadre, 20 years");
    for (const [seniority, months] of [[4, 0], [5, 0.5], [10, 1], [15, 1.5], [20, 2], [25, 2.5]] as const) {
      near(of(years(seniority)).voluntaryRetirement, months, `${seniority} years`);
      near(of(years(seniority)).forcedRetirement, months, `${seniority} years, forced`);
    }
    for (const [seniority, months] of [[5, 0.5], [10, 1], [15, 2], [20, 2.5], [25, 3]] as const) {
      near(of(years(seniority), { cadre: true }).voluntaryRetirement, months, `cadre, ${seniority} years`);
    }
  });

  it("1351 prévention et sécurité: retirement by category", async () => {
    const operators = await lot("1351-prevention-securite", "2026.6", "prévention et sécurité", { "catégorie": "'exploitation'", coefficient: 120 });
    const supervisors = await lot("1351-prevention-securite", "2026.6", "prévention et sécurité", { "catégorie": "'maîtrise'", coefficient: 175 });
    const managers = await lot("1351-prevention-securite", "2026.6", "prévention et sécurité", { "catégorie": "'cadre'", coefficient: 270 });
    near(operators.of(years(4)).voluntaryRetirement, 0, "under 5 years");
    near(operators.of(years(5)).voluntaryRetirement, 0.5, "operator, 5 years");
    near(operators.of(years(20)).voluntaryRetirement, 3, "operator, 20 years");
    near(supervisors.of(years(10)).voluntaryRetirement, 1.5, "supervisor, 10 years");
    near(supervisors.of(years(20)).voluntaryRetirement, 4, "supervisor, 20 years");
    near(managers.of(years(5)).voluntaryRetirement, 1, "manager, 5 years");
    near(managers.of(years(15)).voluntaryRetirement, 3, "manager, 15 years");
    near(managers.of(years(15)).forcedRetirement, 3, "manager, forced");
    near(operators.of(years(15)).dismissal, 0, "the law");
  });

  it("1413 travail temporaire: dismissal with the majoration at 50, and the end-of-career indemnity", async () => {
    const { of } = await lot("1413-travail-temporaire", "2026.3", "travail temporaire");
    near(of(23).dismissal, 0, "under 2 years");
    near(of(24).dismissal, 0.2, "2 years");
    near(of(years(4)).dismissal, 0.4, "4 years");
    near(of(years(5)).dismissal, 1, "5 years");
    near(of(years(12)).dismissal, 2.4, "12 years");
    near(of(years(20)).dismissal, 4.5, "20 years");
    near(of(years(12), { age: 50 }).dismissal, 2.88, "12 years, aged 50");
    for (const [seniority, months] of [[4, 0], [5, 1], [10, 1.5], [15, 2], [20, 3], [30, 4]] as const) {
      near(of(years(seniority)).voluntaryRetirement, months, `${seniority} years`);
      near(of(years(seniority)).forcedRetirement, months, `${seniority} years, forced`);
    }
  });

  it("1483 habillement: employees and managers", async () => {
    const employees = await lot("1483-commerce-detail-habillement-textiles", "2026.7", "commerce de détail habillement", { niveau: "'3'" });
    const managers = await lot("1483-commerce-detail-habillement-textiles", "2026.7", "commerce de détail habillement", { niveau: "'B'" });
    near(employees.of(11).dismissal, 0, "under a year");
    near(employees.of(years(12)).dismissal, 2 + 2 / 3, "employee, 12 years");
    near(managers.of(years(4)).dismissal, 0.8, "manager, 4 years");
    near(managers.of(years(5)).dismissal, 1, "manager, 5 years");
    near(managers.of(years(6)).dismissal, 1.5, "manager, 6 years");
    near(managers.of(years(20)).dismissal, 4 + 4 / 3, "manager, 20 years");
    near(managers.of(years(20), { age: 51 }).dismissal, (4 + 4 / 3) * 1.25, "manager, aged 51 with 20 years");
    near(managers.of(years(10), { age: 51 }).dismissal, 2.5, "manager, aged 51 with under 15 years");
    for (const [seniority, months] of [[9, 0], [10, 1], [15, 1.5], [20, 2], [25, 2.5], [30, 3]] as const) {
      near(employees.of(years(seniority)).voluntaryRetirement, months, `employee, ${seniority} years`);
    }
    for (const [seniority, months] of [[7, 0], [8, 1], [10, 1.5], [15, 2.5], [20, 3.5], [25, 5]] as const) {
      near(managers.of(years(seniority)).voluntaryRetirement, months, `manager, ${seniority} years`);
    }
    near(managers.of(years(10)).forcedRetirement, 1.5, "manager, forced");
  });

  it("1505, 1527, 1606: retirement and dismissal indemnities", async () => {
    const food = await lot("1505-commerce-detail-alimentaire-non-specialise", "2026.7", "commerce de détail alimentaire non spécialisé");
    near(food.of(23).voluntaryRetirement, 0, "under 2 years");
    near(food.of(years(10)).voluntaryRetirement, 1, "10 years");
    near(food.of(years(40)).voluntaryRetirement, 3, "capped at 3 months");
    const realEstate = await lot("1527-immobilier", "2026.4", "immobilier");
    for (const [seniority, months] of [[4, 0], [5, 0.6], [6, 0.6], [7, 0.8], [9, 1], [17, 1.8], [19, 2.1], [34, 4.2], [35, 4.5], [40, 4.5]] as const) {
      near(realEstate.of(years(seniority)).voluntaryRetirement, months, `${seniority} years`);
    }
    const diy = await lot("1606-bricolage", "2025.4", "bricolage");
    near(diy.of(11).dismissal, 0, "under a year");
    near(diy.of(12).dismissal, 0.24, "1 year");
    near(diy.of(years(10)).dismissal, 2.4, "10 years");
    near(diy.of(years(10), { cadre: true, age: 50 }).dismissal, 3.6, "manager aged 50, +50 %");
    near(diy.of(years(10), { cadre: true, age: 49 }).dismissal, 2.4, "manager aged 49");
    near(diy.of(years(10)).voluntaryRetirement, 1.2, "10 years");
    near(diy.of(years(10), { cadre: true }).voluntaryRetirement, 1.8, "manager, +50 %");
  });

  it("1672 assurances, 2098 prestataires tertiaires, 2511 sport, 2941 aide et soins à domicile", async () => {
    const insurance = await lot("1672-societes-assurances", "2026.6", "sociétés assurances");
    near(insurance.of(36).dismissal, 0, "3 years or less");
    near(insurance.of(37).dismissal, (37 / 12) * 12 * 0.025, "37 months");
    near(insurance.of(years(10)).dismissal, 10 * 12 * 0.03, "10 years");
    near(insurance.of(years(10), { age: 50 }).dismissal, 10 * 12 * 0.035, "10 years, aged 50");
    near(insurance.of(years(25)).dismissal, 25 * 12 * 0.035, "25 years");
    near(insurance.of(years(30)).dismissal, 30 * 12 * 0.04, "30 years");
    near(insurance.of(years(9)).voluntaryRetirement, 0, "under 10 years");
    near(insurance.of(years(20)).voluntaryRetirement, 2, "20 years");
    near(insurance.of(23).forcedRetirement, 0, "under 2 years");
    near(insurance.of(years(12)).forcedRetirement, 1 + 2 / 3 * 0.5, "12 years");
    const services = await lot("2098-prestataires-tertiaire", "2026.4", "prestataires tertiaires");
    near(services.of(23).dismissal, 0, "under 2 years");
    near(services.of(24).dismissal, 0.2, "2 years");
    near(services.of(years(10)).dismissal, 0.5 + 5 / 7, "10 years");
    near(services.of(years(20)).dismissal, 0.5 + 5 / 7 + 2, "20 years");
    near(services.of(years(30)).dismissal, 0.5 + 5 / 7 + 2 + 2.5, "30 years");
    near(services.of(years(50)).dismissal, 12, "capped at a year of salary");
    near(services.of(years(20)).voluntaryRetirement, (0.5 + 5 / 7 + 2) / 2, "20 years, 50 % abatement");
    near(services.of(years(20)).forcedRetirement, (0.5 + 5 / 7 + 2) / 2, "forced retirement");
    const sport = await lot("2511-sport", "2026.6", "branche du sport");
    near(sport.of(7).dismissal, 0, "under 8 months");
    near(sport.of(years(12)).dismissal, 10 / 4 + 2 / 3, "12 years");
    for (const [seniority, months] of [[9, 0], [10, 1.5], [15, 2], [20, 4], [30, 5]] as const) {
      near(sport.of(years(seniority)).voluntaryRetirement, months, `${seniority} years`);
    }
    near(sport.of(years(5)).forcedRetirement, 1.25, "forced retirement: the dismissal indemnity");
    near(sport.of(years(10)).forcedRetirement, 2.5, "forced retirement: the dismissal indemnity");
    const homeCare = await lot("2941-aide-soins-domicile", "2026.3", "aide et soins à domicile");
    near(homeCare.of(7).dismissal, 0, "under 8 months");
    near(homeCare.of(years(12)).dismissal, 10 / 4 + 2 / 3, "12 years");
    near(homeCare.of(years(12)).conventionalTermination, 10 / 4 + 2 / 3, "conventional termination (article 28)");
    near(homeCare.of(23).forcedRetirement, 0, "under 2 years");
    near(homeCare.of(years(12)).forcedRetirement, 2 + 2 * (1 / 5 + 2 / 15) , "12 years");
    for (const [seniority, months] of [[4, 0], [5, 0.5], [10, 1], [15, 1.5], [20, 2], [25, 2.5], [30, 3]] as const) {
      near(homeCare.of(years(seniority)).voluntaryRetirement, months, `${seniority} years`);
    }
  });
});
