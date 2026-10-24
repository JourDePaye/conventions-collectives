/**
 * The salary maintenance of the second batch of agreements, figures of each text (read on
 * Légifrance on 24 October 2026, see each version's sources).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { maintenanceEngine } from "./salary-maintenance.ts";

const level = (value: string, name: string, rule = "niveau") => ({ [`salarié . convention collective . ${name} . ${rule}`]: value });

describe("IDCC 16 — 2026.4, annexes I to IV", async () => {
  const name = "transports routiers";
  const { of } = await maintenanceEngine("0016-transports-routiers", "2026.4", name, { niveau: "'M-O-128'" });

  it("pays workers and employees after 3 years, after 5 days of franchise", () => {
    assert.equal(of("maladie", 35).eligible, false);
    const sick = of("maladie", 36);
    assert.equal(sick.waitingDays, 5);
    assert.deepEqual(sick.periods, [[35, 100], [30, 75]]);
    assert.deepEqual(of("maladie", 60).periods, [[65, 100], [60, 75]]);
    assert.deepEqual(of("maladie", 120).periods, [[95, 100], [90, 75]]);
    assert.deepEqual(of("accident du travail", 60).periods, [[60, 100], [90, 75]]);
    assert.equal(of("accident du travail", 60).waitingDays, 0);
  });

  it("pays supervisors by group, and executives as groups 6 to 8", () => {
    assert.deepEqual(of("maladie", 36, {}, level("'M-T-150'", name)).periods, [[30, 100], [30, 75]]);
    assert.equal(of("maladie", 36, {}, level("'M-T-150'", name)).waitingDays, 0);
    assert.deepEqual(of("maladie", 36, {}, level("'M-T-215'", name)).periods, [[60, 100], [60, 75]]);
    assert.deepEqual(of("maladie", 130, {}, level("'V-C-106.5'", name)).periods, [[120, 100], [120, 75]]);
    assert.deepEqual(of("accident du travail", 130, {}, level("'V-C-106.5'", name)).periods, [[120, 100], [150, 75]]);
  });
});

describe("IDCC 573 — 2026.3, article 53", async () => {
  const { of } = await maintenanceEngine("0573-commerces-de-gros", "2026.3", "commerces de gros", {});

  it("pays 90 % then two thirds from the 8th day, 10 more days for a work accident", () => {
    const sick = of("maladie", 12);
    assert.equal(sick.waitingDays, 7);
    assert.equal(sick.periods[0]?.[0], 30);
    assert.equal(of("maladie", 72).periods[0]?.[0], 40);
    assert.equal(of("accident du travail", 12).periods[0]?.[0], 40);
    assert.equal(of("accident du travail", 12).waitingDays, 0);
    assert.equal(of("accident du travail", 400).periods[0]?.[0], 90);
    assert.equal(of("accident de trajet", 12).waitingDays, 7);
  });
});

describe("IDCC 787 — 2026.3, article 7.3", async () => {
  const { of } = await maintenanceEngine("0787-experts-comptables", "2026.3", "experts-comptables", {});

  it("completes the net pay from the 4th day, 30 days a civil year waiting days included", () => {
    assert.deepEqual(of("maladie", 12), {
      eligible: true,
      waitingDays: 3,
      periods: [[27, 100]],
      window: "année civile",
      base: "net",
      netCap: false,
      seniorityDuringAbsence: false,
      separateWorkAccidents: false,
    });
  });
});

describe("IDCC 843 — 2026.3, article 37.1", async () => {
  const { of } = await maintenanceEngine("0843-boulangerie-patisserie-artisanale", "2026.3", "boulangerie-pâtisserie artisanale", {});

  it("pays 90 % for 180 days a civil year, accidents without seniority nor waiting", () => {
    assert.deepEqual(of("maladie", 12).periods, [[180, 90]]);
    assert.equal(of("maladie", 12).waitingDays, 7);
    assert.equal(of("accident de trajet", 0).eligible, true);
    assert.equal(of("accident de trajet", 0).waitingDays, 0);
    assert.equal(of("maladie", 11).eligible, false);
  });
});

describe("IDCC 1043 — 2026.5, article 30.1", async () => {
  const { of } = await maintenanceEngine("1043-gardiens-concierges-employes-immeubles", "2026.5", "gardiens concierges et employés d'immeubles", {});

  it("pays 90 % from the 1st day, 30 to 190 days by seniority, work accidents apart", () => {
    assert.deepEqual(of("maladie", 12).periods, [[30, 90]]);
    assert.deepEqual(of("maladie", 36).periods, [[90, 90]]);
    assert.deepEqual(of("maladie", 396).periods, [[190, 90]]);
    assert.equal(of("accident du travail", 0).eligible, true);
    assert.equal(of("maladie", 12).separateWorkAccidents, true);
  });

  it("maintains the whole pay of maternity and adoption", () => {
    assert.deepEqual(of("maternité", 0).periods, [[365, 100]]);
    assert.equal(of("adoption", 0).window, "arrêt");
  });
});

describe("IDCC 1266 — 2025.2, articles 25 B and 26 B", async () => {
  const { of } = await maintenanceEngine("1266-restauration-collective", "2025.2", "restauration collective", {});

  it("pays sickness in three periods the first two years", () => {
    assert.deepEqual(of("maladie", 12).periods, [[30, 90], [30, 66], [116, 60]]);
    assert.deepEqual(of("maladie", 24).periods, [[30, 90], [146, 70]]);
    assert.deepEqual(of("maladie", 36).periods, [[33, 90], [143, 70]]);
    assert.equal(of("maladie", 12).waitingDays, 7);
  });

  it("pays accidents from the 1st day after 7 months", () => {
    assert.equal(of("accident de trajet", 6).eligible, false);
    assert.deepEqual(of("accident de trajet", 7).periods, [[91, 80], [92, 85]]);
    assert.deepEqual(of("accident du travail", 12).periods, [[30, 90], [61, 80], [92, 85]]);
    assert.deepEqual(of("accident du travail", 24).periods, [[30, 90], [153, 85]]);
  });
});

describe("IDCC 1351 — 2026.5, annexes IV to VI", async () => {
  const name = "prévention et sécurité";
  const { of } = await maintenanceEngine("1351-prevention-securite", "2026.5", name, {});
  const category = (value: string) => level(`'${value}'`, name, "catégorie");

  it("pays operating staff after 3 years from the 11th day", () => {
    assert.equal(of("maladie", 36).eligible, false);
    const sick = of("maladie", 37);
    assert.equal(sick.waitingDays, 10);
    assert.deepEqual(sick.periods, [[30, 90], [30, 70]]);
    assert.deepEqual(of("maladie", 160).periods, [[60, 90], [45, 70]]);
    assert.equal(of("accident du travail", 37).waitingDays, 0);
    assert.equal(sick.base, "salaire de base");
  });

  it("pays supervisors after 2 years, executives after 1", () => {
    assert.deepEqual(of("maladie", 25, {}, category("maîtrise")).periods, [[30, 90], [30, 75]]);
    assert.equal(of("maladie", 25, {}, category("maîtrise")).waitingDays, 3);
    assert.deepEqual(of("maladie", 13, {}, category("cadre")).periods, [[30, 100], [45, 75]]);
    assert.deepEqual(of("maladie", 250, {}, category("cadre")).periods, [[120, 100], [150, 75]]);
  });
});

describe("IDCC 1413 — 2026.2, articles 13 and 14", async () => {
  const { of } = await maintenanceEngine("1413-travail-temporaire", "2026.2", "travail temporaire", {});

  it("maintains the net pay 30 days then 75 %, longer every 5 years, by civil year", () => {
    const sick = of("maladie", 12);
    assert.deepEqual(sick.periods, [[30, 100], [30, 75]]);
    assert.equal(sick.waitingDays, 6);
    assert.equal(sick.window, "année civile");
    assert.deepEqual(of("maladie", 60).periods, [[45, 100], [40, 75]]);
    assert.equal(of("accident du travail", 6).eligible, true);
  });

  it("maintains the net pay of maternity and adoption", () => {
    assert.deepEqual(of("maternité", 0).periods, [[365, 100]]);
    assert.equal(of("adoption", 0).base, "net");
  });
});

describe("IDCC 1483 — 2026.6, articles 27 and 13", async () => {
  const name = "commerce de détail habillement";
  const { of } = await maintenanceEngine("1483-commerce-detail-habillement-textiles", "2026.6", name, { niveau: "'3'" });

  it("pays employees from the 8th day over the year from the anniversary of the hiring", () => {
    const sick = of("maladie", 12);
    assert.equal(sick.waitingDays, 7);
    assert.deepEqual(sick.periods, [[30, 90], [30, 66.67]]);
    assert.equal(sick.window, "anniversaire");
    assert.deepEqual(of("maladie", 72).periods, [[40, 90], [40, 66.67]]);
  });

  it("pays the supervisory staff from the 4th day, by months", () => {
    const supervisor = level("'B'", name);
    assert.deepEqual(of("maladie", 12, {}, supervisor).periods, [[30, 100], [30, 75]]);
    assert.deepEqual(of("maladie", 60, {}, supervisor).periods, [[60, 100]]);
    assert.deepEqual(of("maladie", 240, {}, supervisor).periods, [[120, 100], [60, 75]]);
    assert.equal(of("maladie", 12, {}, supervisor).waitingDays, 3);
  });
});

describe("IDCC 1505 — 2026.6, articles 40.1 and 40.2", async () => {
  const { of } = await maintenanceEngine("1505-commerce-detail-alimentaire-non-specialise", "2026.6", "commerce de détail alimentaire non spécialisé", {});

  it("shortens the waiting days with the seniority", () => {
    assert.equal(of("maladie", 12).waitingDays, 7);
    assert.equal(of("maladie", 60).waitingDays, 5);
    assert.equal(of("maladie", 120).waitingDays, 2);
    assert.deepEqual(of("maladie", 36).periods, [[40, 90], [30, 66.66]]);
    assert.deepEqual(of("maladie", 300).periods, [[90, 90], [90, 66.66]]);
  });

  it("pays accidents from the 1st day without seniority", () => {
    assert.deepEqual(of("accident de trajet", 0).periods, [[40, 90], [30, 66]]);
    assert.deepEqual(of("accident du travail", 301).periods, [[100, 90], [90, 66]]);
  });
});

describe("IDCC 1527 — 2026.3, article 24.2", async () => {
  const { of } = await maintenanceEngine("1527-immobilier", "2026.3", "immobilier", {});

  it("pays 90 % from the 1st day, 30 to 190 days, work accidents apart", () => {
    assert.deepEqual(of("maladie", 12).periods, [[30, 90]]);
    assert.deepEqual(of("maladie", 100).periods, [[110, 90]]);
    assert.equal(of("accident du travail", 0).eligible, true);
    assert.equal(of("maladie", 12).separateWorkAccidents, true);
  });
});

describe("IDCC 1606 — 2025.3, articles 7.1 and 7.2", async () => {
  const name = "bricolage";
  const { of } = await maintenanceEngine("1606-bricolage", "2025.3", name, { coefficient: 190 });

  it("pays employees after 2 years, the waiting days growing with the stops", () => {
    assert.equal(of("maladie", 23).eligible, false);
    assert.deepEqual(of("maladie", 24).periods, [[30, 90], [30, 70]]);
    assert.equal(of("maladie", 24, { "rang de l'arrêt": 1 }).waitingDays, 3);
    assert.equal(of("maladie", 24, { "rang de l'arrêt": 2 }).waitingDays, 5);
    assert.equal(of("maladie", 24, { "rang de l'arrêt": 3 }).waitingDays, 7);
    assert.equal(of("accident du travail", 0).waitingDays, 0);
    assert.equal(of("accident du travail", 0).separateWorkAccidents, true);
  });

  it("pays supervisors and executives without waiting days", () => {
    const supervisor = level("250", name, "coefficient");
    assert.deepEqual(of("maladie", 24, {}, supervisor).periods, [[30, 100], [30, 90]]);
    assert.equal(of("maladie", 24, {}, supervisor).waitingDays, 0);
    assert.deepEqual(of("maladie", 200, {}, level("400", name, "coefficient")).periods, [[90, 100], [40, 90]]);
    assert.deepEqual(of("maladie", 400, {}, level("400", name, "coefficient")).periods, [[90, 100], [90, 70]]);
  });
});

describe("IDCC 1672 — 2026.5, articles 82 c and 86 c", async () => {
  const { of } = await maintenanceEngine("1672-societes-assurances", "2026.5", "sociétés assurances", {});

  it("completes the net pay for 3 months a civil year, and the whole maternity", () => {
    assert.deepEqual(of("maladie", 12).periods, [[90, 100]]);
    assert.equal(of("maladie", 12).base, "net");
    assert.equal(of("maladie", 11).eligible, false);
    assert.deepEqual(of("maternité", 12).periods, [[365, 100]]);
    assert.equal(of("adoption", 12).eligible, false);
  });
});

describe("IDCC 2098 — 2026.3, article 18.1 B", async () => {
  const { of } = await maintenanceEngine("2098-prestataires-tertiaire", "2026.3", "prestataires tertiaires", {});

  it("pays 90 % then 75 %, and 100 % then 80 % after 3 years", () => {
    assert.deepEqual(of("maladie", 12).periods, [[30, 90], [30, 75]]);
    assert.deepEqual(of("maladie", 36).periods, [[30, 100], [30, 80]]);
    assert.deepEqual(of("maladie", 96).periods, [[40, 100], [40, 80]]);
    assert.equal(of("accident de trajet", 12).waitingDays, 7);
    assert.equal(of("accident du travail", 12).waitingDays, 0);
    assert.equal(of("maternité", 12).waitingDays, 0);
  });
});

describe("IDCC 2511 — 2026.5, article 4.3", async () => {
  const { of } = await maintenanceEngine("2511-sport", "2026.5", "branche du sport", {});

  it("maintains the net pay from the 4th day, 87 days, 180 after a work accident", () => {
    assert.deepEqual(of("maladie", 12).periods, [[87, 100]]);
    assert.equal(of("maladie", 12).waitingDays, 3);
    assert.equal(of("maladie", 12).base, "net");
    assert.deepEqual(of("accident du travail", 0).periods, [[180, 100]]);
  });
});

describe("IDCC 2941 — 2026.2, titre VIII", async () => {
  const { of } = await maintenanceEngine("2941-aide-soins-domicile", "2026.2", "aide et soins à domicile", {});

  it("pays 90 % after 6 months, 60 days or 90 after 20 years", () => {
    assert.equal(of("maladie", 5).eligible, false);
    assert.deepEqual(of("maladie", 6).periods, [[60, 90]]);
    assert.deepEqual(of("maladie", 240).periods, [[90, 90]]);
    assert.equal(of("maladie", 6).waitingDays, 3);
    assert.equal(of("accident du travail", 6).waitingDays, 0);
    assert.equal(of("maladie", 6).netCap, true);
  });
});
