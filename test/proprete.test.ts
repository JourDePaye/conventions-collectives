import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const model = "3043-entreprises-proprete";
const value = "propreté";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[model]?.find((entry) => entry.version === "2026.1");
assert.ok(version, "IDCC 3043 version 2026.1 must be compiled");
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

const HOURLY: Record<string, number> = {
  "MP5": 21.90, "MP4": 20.25, "MP3": 18.18, "MP2": 16.39, "MP1": 15.52,
  "CE3": 15.44, "CE2": 15.27, "CE1": 14.43,
  "ATQS3-A": 14.95, "ATQS3-B": 15.27, "ATQS2-A": 13.91, "ATQS2-B": 14.16,
  "ATQS1-A": 13.17, "ATQS1-B": 13.39,
  "AQS3-A": 12.92, "AQS3-B": 13.16, "AQS2-A": 12.81, "AQS2-B": 13.05,
  "AQS1-A": 12.70, "AQS1-B": 12.91,
  "ASCS-A": 12.64, "ASCS-B": 12.86, "ASC-A": 12.57, "ASC-B": 12.79,
  "ASP-A": 12.52, "ASP-B": 12.71,
  "MA3": 21.68, "MA2": 20.56, "MA1": 18.11,
  "EA4": 16.29, "EA3": 14.89, "EA2": 13.54, "EA1": 12.63,
};

const MONTHLY: Record<string, number> = {
  "CA1": 3279.71, "CA2": 3868.89, "CA3": 4323.69,
  "CA4": 4998.10, "CA5": 5304.54, "CA6": 5795.71,
};

function setSituation(inputs: Record<string, string | number> = {}, context: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: "'ASP-A'",
    ...Object.fromEntries(Object.entries(inputs).map(([name, input]) => [`${namespace} . ${name}`, input])),
    ...context,
  });
}

function amount(name: string) {
  const result = engine.evaluate(`${namespace} . ${name}`).nodeValue;
  assert.equal(typeof result, "number", name);
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 3043 — 2026.1 entreprises de propreté", () => {
  it("is effective from 1 April 2026 and cites the extended wage amendment", () => {
    assert.equal(version.validFrom, "2026-04-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 27 du 18 décembre 2025")));
    assert.ok(version.sources.some((source) => source.includes("KALIARTI000053748401")));
  });

  for (const [level, hourly] of Object.entries(HOURLY)) {
    it(`${level}: ${hourly} € per hour`, () => {
      setSituation({ niveau: `'${level}'` });
      assert.equal(amount("taux horaire minimum conventionnel"), hourly);
      assert.equal(amount("salaire minimum conventionnel"), Math.round(hourly * 151.67 * 100) / 100);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, false);
    });
  }

  for (const [level, monthly] of Object.entries(MONTHLY)) {
    it(`${level}: ${monthly} € per month`, () => {
      setSituation({ niveau: `'${level}'` });
      assert.equal(amount("salaire minimum conventionnel"), monthly);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, false);
    });
  }

  it("prorates the full-time minimum once", () => {
    setSituation({ niveau: "'ATQS2-B'" }, { "salarié . contrat . temps de travail . quotité": "50%" });
    assert.equal(amount("salaire minimum conventionnel"), Math.round(14.16 * 151.67 * 50) / 100);
  });

  it("rejects unknown or missing classifications", () => {
    for (const level of ["AS1-A", "ASP-C", "CA7", "ca1", "non renseigné"]) {
      setSituation({ niveau: `'${level}'` });
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true, level);
      assert.equal(amount("salaire minimum conventionnel"), 0, level);
    }
    engine.setSituation({ "salarié . convention collective": `'${value}'` });
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
  });

  it("calculates the professional-experience premium separately from the RMH", () => {
    for (const [years, rate] of [[0, 0], [4, 2], [7, 3], [10, 4], [15, 5], [20, 6], [25, 7]] as const) {
      setSituation({ niveau: "'ASP-A'", "expérience professionnelle reconnue": `${years} an` });
      assert.equal(amount("taux de la prime d'expérience"), rate, `${years} years`);
      assert.equal(amount("prime d'expérience"), Math.round(12.52 * 151.67 * rate) / 100, `${years} years`);
      assert.equal(amount("salaire minimum conventionnel"), Math.round(12.52 * 151.67 * 100) / 100);
    }
  });

  it("calculates night and scheduled Sunday premiums on the hourly contractual base", () => {
    setSituation({
      niveau: "'ASP-A'",
      "taux horaire contractuel": "15 €/heure",
      "heures de nuit régulières": "8 heure/mois",
      "heures du dimanche prévues": "8 heure/mois",
    });
    assert.equal(amount("majoration de nuit"), 24);
    assert.equal(amount("majoration du dimanche"), 30);
    assert.equal(amount("repos compensateur de nuit"), 0);
  });

  it("uses the July 2026 exceptional Sunday and public-holiday rates", () => {
    setSituation({
      "taux horaire contractuel": "15 €/heure",
      "heures du dimanche exceptionnelles": "2 heure/mois",
      "heures fériées prévues": "2 heure/mois",
      "heures fériées exceptionnelles": "2 heure/mois",
      "heures des quatre jours fériés majorés": "2 heure/mois",
    });
    assert.equal(amount("majoration du dimanche"), 30);
    assert.equal(amount("majoration des jours fériés"), 75);
  });

  it("calculates the transport allowance from the supplied minimum garanti", () => {
    setSituation({ "heures mensuelles ouvrant droit au transport": "100 heure/mois", "minimum garanti en vigueur": "4.22 €" });
    assert.equal(amount("indemnité de transport conventionnelle"), Math.round(7 * 4.22 * 100 / 151.67 * 100) / 100);
    setSituation({ "heures mensuelles ouvrant droit au transport": "105 heure/mois", "minimum garanti en vigueur": "4.22 €" });
    assert.equal(amount("indemnité de transport conventionnelle"), 29.54);
  });

  it("is inapplicable outside the agreement", () => {
    setSituation({}, { "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "niveau hors grille", "prime d'expérience", "majoration de nuit"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
