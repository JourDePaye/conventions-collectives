/**
 * The `maintien de salaire` rules of the agreements that have them, as JourDePaye reads them: every
 * output evaluates for every motive and seniority, and figures of each text (read on Légifrance on
 * 24 October 2026, see each version's sources).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { maintenanceEngine, MOTIVES } from "./salary-maintenance.ts";

/** The versions with the rules: model, revision, value of `convention collective`, classification. */
const VERSIONS = [
  { model: "1486-syntec", revision: "2026.4", value: "syntec", classification: { coefficient: 355 } },
  { model: "3248-metallurgie", revision: "2026.5", value: "métallurgie", classification: { niveau: "'C5'" } },
  { model: "1979-hotels-cafes-restaurants", revision: "2024.4", value: "hôtels cafés restaurants", classification: { niveau: "'I.1'" } },
  { model: "1979-hotels-cafes-restaurants", revision: "2026.3", value: "hôtels cafés restaurants", classification: { niveau: "'I.1'" } },
  { model: "2216-commerce-detail-gros-predominance-alimentaire", revision: "2026.5", value: "commerce alimentaire", classification: { niveau: "'2B'" } },
  { model: "1517-commerce-detail-non-alimentaire", revision: "2026.2", value: "commerce de détail non alimentaire", classification: {} },
  { model: "1501-restauration-rapide", revision: "2026.3", value: "restauration rapide", classification: {} },
  { model: "1501-restauration-rapide", revision: "2026.4", value: "restauration rapide", classification: {} },
  { model: "3043-entreprises-proprete", revision: "2026.2", value: "propreté", classification: { niveau: "'AQS1-A'" } },
  { model: "1090-services-automobile", revision: "2026.2", value: "services automobile", classification: { niveau: "'5'" } },
  { model: "0044-industries-chimiques", revision: "2026.5", value: "industries chimiques", classification: { coefficient: 190 } },
  { model: "2120-banque", revision: "2026.3", value: "banque", classification: { niveau: "'D'" } },
  { model: "0016-transports-routiers", revision: "2026.4", value: "transports routiers", classification: { niveau: "'M-O-128'" } },
  { model: "0573-commerces-de-gros", revision: "2026.3", value: "commerces de gros", classification: {} },
  { model: "0787-experts-comptables", revision: "2026.3", value: "experts-comptables", classification: {} },
  { model: "0843-boulangerie-patisserie-artisanale", revision: "2026.3", value: "boulangerie-pâtisserie artisanale", classification: {} },
  { model: "1043-gardiens-concierges-employes-immeubles", revision: "2026.5", value: "gardiens concierges et employés d'immeubles", classification: {} },
  { model: "1266-restauration-collective", revision: "2025.2", value: "restauration collective", classification: {} },
  { model: "1351-prevention-securite", revision: "2026.5", value: "prévention et sécurité", classification: {} },
  { model: "1413-travail-temporaire", revision: "2026.2", value: "travail temporaire", classification: {} },
  { model: "1483-commerce-detail-habillement-textiles", revision: "2026.6", value: "commerce de détail habillement", classification: { niveau: "'3'" } },
  { model: "1505-commerce-detail-alimentaire-non-specialise", revision: "2026.6", value: "commerce de détail alimentaire non spécialisé", classification: {} },
  { model: "1527-immobilier", revision: "2026.3", value: "immobilier", classification: {} },
  { model: "1606-bricolage", revision: "2025.3", value: "bricolage", classification: { coefficient: 190 } },
  { model: "1672-societes-assurances", revision: "2026.5", value: "sociétés assurances", classification: {} },
  { model: "2098-prestataires-tertiaire", revision: "2026.3", value: "prestataires tertiaires", classification: {} },
  { model: "2511-sport", revision: "2026.5", value: "branche du sport", classification: {} },
  { model: "2941-aide-soins-domicile", revision: "2026.2", value: "aide et soins à domicile", classification: {} },
] as const;

describe("salary maintenance rules", () => {
  for (const { model, revision, value, classification } of VERSIONS) {
    it(`evaluates every output of ${model} ${revision}`, async () => {
      const { of } = await maintenanceEngine(model, revision, value, classification);
      for (const motive of MOTIVES) {
        for (const months of [0, 6, 12, 40, 70, 130, 200, 250, 320, 400]) {
          const maintenance = of(motive, months);
          assert.equal(typeof maintenance.eligible, "boolean");
          assert.ok(Number.isFinite(maintenance.waitingDays), `${motive} ${months}`);
          for (const [days, rate] of maintenance.periods) {
            assert.ok(days > 0 && rate > 0 && rate <= 100, `${motive} ${months}: ${days} ${rate}`);
          }
          assert.ok(["douze mois", "année civile", "anniversaire", "arrêt"].includes(maintenance.window), maintenance.window);
          assert.ok(["brut", "salaire de base", "net"].includes(maintenance.base), maintenance.base);
        }
      }
    });
  }
});

describe("IDCC 3248 — 2026.5, articles 91.1 and 92", async () => {
  const { of } = await maintenanceEngine("3248-metallurgie", "2026.5", "métallurgie", { niveau: "'C5'" });
  const groupF = { "salarié . convention collective . métallurgie . niveau": "'F11'" };

  it("pays groups A to E at 100 % for 90 to 180 days over the civil year", () => {
    assert.equal(of("maladie", 11).eligible, false);
    assert.equal(of("accident du travail", 3).eligible, true);
    assert.deepEqual(of("maladie", 12).periods, [[90, 100]]);
    assert.deepEqual(of("maladie", 60).periods, [[120, 100]]);
    assert.deepEqual(of("maladie", 180).periods, [[180, 100]]);
    assert.equal(of("maladie", 12).window, "année civile");
    assert.equal(of("maladie", 12).waitingDays, 0);
    assert.equal(of("maladie", 12).netCap, true);
  });

  it("adds the same days at 50 % for groups F to I", () => {
    assert.deepEqual(of("maladie", 130, {}, groupF).periods, [[150, 100], [150, 50]]);
  });

  it("pays maternity and adoption in full, not paternity", () => {
    assert.deepEqual(of("maternité", 12, {}, groupF).periods, [[365, 100]]);
    assert.equal(of("paternité", 120).eligible, false);
  });
});

describe("IDCC 1979 — 2024.4 and 2026.3, article 29.2", async () => {
  const { of } = await maintenanceEngine("1979-hotels-cafes-restaurants", "2026.3", "hôtels cafés restaurants", { niveau: "'I.1'" });

  it("pays after 3 years from the 11th day, 90 % then two thirds, 10 more days every 5 years", () => {
    assert.equal(of("maladie", 35).eligible, false);
    const maintenance = of("maladie", 36);
    assert.equal(maintenance.waitingDays, 10);
    assert.equal(maintenance.periods[0]?.[0], 30);
    assert.equal(maintenance.periods[0]?.[1], 90);
    assert.ok(Math.abs(maintenance.periods[1]![1] - 200 / 3) < 1e-9);
    assert.equal(of("maladie", 96).periods[0]?.[0], 40);
    assert.equal(of("maladie", 400).periods[0]?.[0], 90);
    assert.equal(of("accident du travail", 36).waitingDays, 0);
    assert.equal(of("accident de trajet", 36).waitingDays, 10);
    assert.equal(of("maternité", 120).eligible, false);
  });
});

describe("IDCC 2216 — 2026.5, article 7.4 and annexes I to III", async () => {
  const { of } = await maintenanceEngine("2216-commerce-detail-gros-predominance-alimentaire", "2026.5", "commerce alimentaire", { niveau: "'2B'" });
  const level = (niveau: string) => ({ "salarié . convention collective . commerce alimentaire . niveau": `'${niveau}'` });

  it("pays employees on their net pay from the 8th day, by seniority", () => {
    const maintenance = of("maladie", 12);
    assert.equal(maintenance.base, "net");
    assert.equal(maintenance.waitingDays, 7);
    assert.deepEqual(maintenance.periods, [[30, 100], [15, 90]]);
    assert.deepEqual(of("maladie", 60).periods, [[35, 100], [40, 90]]);
    assert.deepEqual(of("maladie", 120).periods, [[90, 100]]);
    assert.deepEqual(of("maladie", 180).periods, [[90, 100], [30, 60]]);
    assert.deepEqual(of("maladie", 240).periods, [[120, 100], [60, 65]]);
    assert.equal(of("accident du travail", 1).eligible, true);
    assert.equal(of("accident du travail", 1).waitingDays, 0);
  });

  it("pays supervisors and executives longer, more after a work accident", () => {
    assert.deepEqual(of("maladie", 12, {}, level("5")).periods, [[55, 100]]);
    assert.deepEqual(of("accident du travail", 250, {}, level("6")).periods, [[180, 100]]);
    assert.deepEqual(of("maladie", 12, {}, level("7")).periods, [[90, 100]]);
    assert.equal(of("maladie", 12, {}, level("7")).waitingDays, 0);
    assert.deepEqual(of("accident du travail", 130, {}, level("8")).periods, [[210, 100]]);
  });

  it("maintains the net pay of maternity and adoption for weeks by seniority", () => {
    assert.deepEqual(of("maternité", 12).periods, [[42, 100]]);
    assert.deepEqual(of("maternité", 24).periods, [[70, 100]]);
    assert.deepEqual(of("maternité", 36).periods, [[112, 100]]);
    assert.deepEqual(of("adoption", 36).periods, [[70, 100]]);
    // Executives: the work accident's durations.
    assert.deepEqual(of("maternité", 12, {}, level("7")).periods, [[120, 100]]);
    assert.equal(of("paternité", 36).eligible, false);
  });
});

describe("IDCC 1517 — 2026.2, chapter VII", async () => {
  const { of } = await maintenanceEngine("1517-commerce-detail-non-alimentaire", "2026.2", "commerce de détail non alimentaire", {});

  it("pays 90 % then 70 % from the 8th day, 10 more days every 5 years beyond the first", () => {
    assert.equal(of("maladie", 11).eligible, false);
    assert.deepEqual(of("maladie", 12).periods, [[30, 90], [30, 70]]);
    assert.equal(of("maladie", 12).waitingDays, 7);
    assert.deepEqual(of("maladie", 72).periods, [[40, 90], [40, 70]]);
    assert.deepEqual(of("maladie", 372).periods, [[90, 90], [90, 70]]);
    assert.equal(of("accident du travail", 6).eligible, true);
    assert.equal(of("accident du travail", 6).waitingDays, 0);
  });
});

describe("IDCC 1501 — 2026.3, articles 19 B and 20", async () => {
  const { of } = await maintenanceEngine("1501-restauration-rapide", "2026.3", "restauration rapide", {});

  it("pays sickness after 3 years from the 11th day, the work accident at the legal rates after 6 months", () => {
    assert.equal(of("maladie", 35).eligible, false);
    assert.deepEqual(of("maladie", 36).periods, [[30, 90], [30, 70]]);
    assert.equal(of("maladie", 36).waitingDays, 10);
    assert.deepEqual(of("maladie", 96).periods, [[40, 90], [40, 70]]);
    const accident = of("accident du travail", 6);
    assert.equal(accident.eligible, true);
    assert.equal(accident.waitingDays, 0);
    assert.equal(accident.periods[0]?.[0], 30);
    assert.equal(of("accident de trajet", 36).eligible, false);
  });
});

describe("IDCC 3043 — 2026.2, article 4.9.1", async () => {
  const { of } = await maintenanceEngine("3043-entreprises-proprete", "2026.2", "propreté", { niveau: "'AQS1-A'" });
  const level = (niveau: string) => ({ "salarié . convention collective . propreté . niveau": `'${niveau}'` });

  it("pays agents from the 8th day, ETAM from the 4th, executives from the 1st", () => {
    const agent = of("maladie", 12);
    assert.equal(agent.waitingDays, 7);
    assert.equal(agent.periods[0]?.[0], 30);
    assert.equal(agent.periods[0]?.[1], 90);
    assert.equal(of("maladie", 72).periods[0]?.[0], 40);
    assert.equal(of("maladie", 360).periods[0]?.[0], 100);
    assert.equal(of("maladie", 12, {}, level("EA2")).waitingDays, 3);
    assert.deepEqual(of("maladie", 12, {}, level("CA1")).periods, [[70, 100]]);
    assert.deepEqual(of("maladie", 121, {}, level("CA1")).periods, [[90, 100]]);
    assert.equal(of("maladie", 12).seniorityDuringAbsence, true);
  });
});

describe("IDCC 1090 — 2026.2, articles 2.10 and 4.08", async () => {
  const { of } = await maintenanceEngine("1090-services-automobile", "2026.2", "services automobile", { niveau: "'5'" });

  it("maintains the net pay for 45 days a civil year, 90 for executives", () => {
    const maintenance = of("maladie", 12);
    assert.deepEqual(maintenance.periods, [[45, 100]]);
    assert.equal(maintenance.base, "net");
    assert.equal(maintenance.window, "année civile");
    assert.equal(maintenance.waitingDays, 0);
    assert.deepEqual(of("maladie", 12, {}, { "salarié . convention collective . services automobile . niveau": "'II.B'" }).periods, [[90, 100]]);
  });
});

describe("IDCC 44 — 2026.5, avenants n° 1, 2 and 3", async () => {
  const { of } = await maintenanceEngine("0044-industries-chimiques", "2026.5", "industries chimiques", { coefficient: 190 });
  const coefficient = (value: number) => ({ "salarié . convention collective . industries chimiques . coefficient": value });

  it("pays workers 2 months full and 2 half, half a month more every 4 years", () => {
    assert.deepEqual(of("maladie", 12).periods, [[60, 100], [60, 50]]);
    assert.deepEqual(of("maladie", 48).periods, [[75, 100], [75, 50]]);
    assert.equal(of("maladie", 12).window, "année civile");
    assert.equal(of("accident du travail", 12).window, "arrêt");
  });

  it("pays supervisors a month and a half, executives 4 to 6 months", () => {
    assert.deepEqual(of("maladie", 12, {}, coefficient(275)).periods, [[45, 100], [45, 50]]);
    assert.deepEqual(of("maladie", 12, {}, coefficient(350)).periods, [[120, 100], [120, 50]]);
    assert.deepEqual(of("maladie", 36, {}, coefficient(400)).periods, [[150, 100], [150, 50]]);
    assert.deepEqual(of("maladie", 400, {}, coefficient(880)).periods, [[180, 100], [180, 50]]);
  });
});

describe("IDCC 2120 — 2026.3, articles 51, 52 and 54", async () => {
  const { of } = await maintenanceEngine("2120-banque", "2026.3", "banque", { niveau: "'D'" });

  it("pays the base salary 100 % then 50 % by months of seniority", () => {
    const maintenance = of("maladie", 12);
    assert.deepEqual(maintenance.periods, [[60, 100], [60, 50]]);
    assert.equal(maintenance.base, "salaire de base");
    assert.equal(maintenance.netCap, true);
    assert.deepEqual(of("maladie", 240).periods, [[180, 100], [180, 50]]);
  });

  it("lengthens the half salary with a dependent child", () => {
    assert.deepEqual(of("maladie", 12, { "enfant à charge": "oui" }).periods, [[60, 100], [150, 50]]);
    assert.deepEqual(of("maladie", 130, { "enfant à charge": "oui" }).periods, [[120, 100], [240, 50]]);
  });

  it("waits 3 days from the third sick leave, never after an accident", () => {
    assert.equal(of("maladie", 12, { "rang de l'arrêt": 2 }).waitingDays, 0);
    assert.equal(of("maladie", 12, { "rang de l'arrêt": 3 }).waitingDays, 3);
    assert.equal(of("accident de trajet", 12, { "rang de l'arrêt": 3 }).waitingDays, 0);
  });

  it("pays maternity and adoption after 9 months", () => {
    assert.equal(of("maternité", 8).eligible, false);
    assert.deepEqual(of("adoption", 9).periods, [[365, 100]]);
  });
});
