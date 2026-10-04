import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const model = "1351-prevention-securite";
const value = "prévention et sécurité";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[model]?.find((entry) => entry.version === "2026.1");
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

function setSituation(inputs: Record<string, string | number> = {}, context: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    "salarié . contrat . statut cadre": "non",
    "date": "01/10/2026",
    [`${namespace} . catégorie`]: "'exploitation'",
    [`${namespace} . coefficient`]: 120,
    ...Object.fromEntries(Object.entries(inputs).map(([name, input]) => [`${namespace} . ${name}`, input])),
    ...context,
  });
}

function amount(name: string) {
  const result = engine.evaluate(`${namespace} . ${name}`);
  assert.equal(typeof result.nodeValue, "number", name);
  return Math.round((result.nodeValue as number) * 100) / 100;
}

// Independent figures from annex 3 of the extended 2023 agreement, applicable in 2026.
// https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000049067305
const salaryGrid = {
  exploitation: [
    [120, 1883.85], [130, 1908.54], [140, 1965.78], [150, 2039.33],
    [160, 2152.09], [175, 2327.04], [190, 2502.06], [210, 2735.99],
    [230, 2969.36], [250, 3202.76],
  ],
  maîtrise: [
    [150, 2234.30], [160, 2357.77], [170, 2480.93], [185, 2666.29],
    [200, 2851.20], [215, 3036.16], [235, 3282.88], [255, 3529.58],
    [275, 3776.29],
  ],
  cadre: [
    [300, 2968.47], [400, 3756.63], [470, 4307.92],
    [530, 4780.86], [620, 5489.93], [800, 6908.48],
  ],
} as const;

describe("IDCC 1351 — July 2026 extended agreement", () => {
  it("exports the effective date and legal sources", () => {
    assert.equal(version.validFrom, "2026-07-01");
    for (const reference of [
      "KALIARTI000049067305", "KALIARTI000053576558", "KALIARTI000005853757",
      "KALITEXT000005680940", "KALIARTI000005853996",
    ]) {
      assert.ok(version.sources.some((source) => source.includes(reference)), reference);
    }
  });
  for (const [category, entries] of Object.entries(salaryGrid)) {
    for (const [coefficient, expected] of entries) {
      it(`${category} coefficient ${coefficient}: EUR ${expected} for 151.67 hours`, () => {
        setSituation({ "catégorie": `'${category}'`, "coefficient": coefficient });
        assert.equal(amount("minimum mensuel à temps plein"), expected);
        assert.equal(amount("salaire minimum conventionnel"), expected);
        assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, false);
      });
    }
  }
  it("distinguishes overlapping coefficients across professional categories", () => {
    setSituation({ "catégorie": "'exploitation'", "coefficient": 150 });
    assert.equal(amount("salaire minimum conventionnel"), 2039.33);
    setSituation({ "catégorie": "'maîtrise'", "coefficient": 150 });
    assert.equal(amount("salaire minimum conventionnel"), 2234.30);
    setSituation({ "catégorie": "'exploitation'", "coefficient": 160 });
    assert.equal(amount("salaire minimum conventionnel"), 2152.09);
    setSituation({ "catégorie": "'maîtrise'", "coefficient": 160 });
    assert.equal(amount("salaire minimum conventionnel"), 2357.77);
  });
  for (const [category, coefficient] of [
    ["exploitation", 0], ["exploitation", 125], ["exploitation", 300],
    ["maîtrise", 120], ["maîtrise", 300], ["cadre", 120], ["cadre", 150],
    ["inconnue", 150],
  ] as const) {
    it(`flags unsupported pair ${category}/${coefficient}`, () => {
      setSituation({ "catégorie": `'${category}'`, "coefficient": coefficient });
      assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
      assert.equal(amount("salaire minimum conventionnel"), 0);
      assert.equal(amount("taux horaire minimum conventionnel"), 0);
    });
  }
  it("prorates the grid once using modele-social's contract quota", () => {
    setSituation({}, { "salarié . contrat . temps de travail . quotité": "50%" });
    assert.equal(amount("salaire minimum conventionnel"), 941.93);
  });
  it("uses the sourced grid without silently replacing it with the SMIC", () => {
    setSituation({}, { "SMIC . horaire": "20 €/heure" });
    assert.equal(amount("salaire minimum conventionnel"), 1883.85);
  });
});

describe("IDCC 1351 — seniority and work at night or on Sunday", () => {
  for (const [years, rate] of [[0, 0], [3, 0], [4, 2], [6, 2], [7, 5], [10, 8], [12, 10], [15, 12], [20, 12]] as const) {
    it(`uses the ${years}-year seniority step at ${rate}%`, () => {
      setSituation({ "ancienneté prise en compte": `${years} an` });
      assert.equal(amount("taux de la prime d'ancienneté"), rate);
      assert.equal(amount("prime d'ancienneté"), Math.round(1883.85 * rate) / 100);
      assert.equal(amount("salaire minimum conventionnel"), 1883.85);
    });
  }
  it("uses the category's minimum as the seniority base, including at part-time", () => {
    setSituation({ "catégorie": "'maîtrise'", "coefficient": 150, "ancienneté prise en compte": "7 an" },
      { "salarié . contrat . temps de travail . quotité": "50%" });
    assert.equal(amount("prime d'ancienneté"), 55.86);
    setSituation({ "catégorie": "'cadre'", "coefficient": 300, "ancienneté prise en compte": "20 an" });
    assert.equal(amount("prime d'ancienneté"), 0);
  });
  it("adds night and Sunday increases without compounding and exposes night rest separately", () => {
    setSituation({ "heures de nuit": "8 heure/mois", "heures du dimanche": "8 heure/mois" });
    const eachIncrease = Math.round(1883.85 / 151.67 * 0.1 * 8 * 100) / 100;
    assert.equal(amount("majoration de nuit"), eachIncrease);
    assert.equal(amount("majoration du dimanche"), eachIncrease);
    assert.equal(amount("compléments salariaux bruts calculés"), Math.round(1883.85 / 151.67 * 0.1 * 16 * 100) / 100);
    assert.equal(amount("repos compensateur de nuit"), 0.08);
  });
  it("uses airport-specific night and Sunday rates on the base hourly wage", () => {
    setSituation({
      "sûreté aérienne et aéroportuaire": "oui",
      "taux horaire contractuel": "15 €/heure",
      "heures de nuit": "8 heure/mois",
      "heures du dimanche": "8 heure/mois",
    });
    assert.equal(amount("majoration de nuit"), 30);
    assert.equal(amount("majoration du dimanche"), 60);
    assert.equal(amount("compléments salariaux bruts calculés"), 90);
  });
});

describe("IDCC 1351 — allowances and six-hour period minimum", () => {
  it("uses the general and airport-specific basket values for eligible shifts", () => {
    setSituation({ "vacations avec panier": 2 });
    assert.equal(amount("montant du panier"), 4.48);
    assert.equal(amount("indemnité de panier"), 8.96);
    setSituation({ "vacations avec panier": 2, "sûreté aérienne et aéroportuaire": "oui" });
    assert.equal(amount("montant du panier"), 6.87);
    assert.equal(amount("indemnité de panier"), 13.74);
  });
  it("calculates the dog-team allowance from actual hours and exposes the net clothing amount separately", () => {
    setSituation({ "heures équipe homme-chien": "10 heure/mois", "entretien des tenues dû": "oui" });
    assert.equal(amount("indemnité d'entretien du chien"), 14.10);
    assert.equal(amount("indemnité d'entretien des tenues"), 8.78);
    setSituation({ "entretien des tenues dû": "oui", "sûreté aérienne et aéroportuaire": "oui" });
    assert.equal(amount("indemnité d'entretien des tenues"), 12.20);
    assert.equal(amount("salaire minimum conventionnel"), 1883.85);
    assert.equal(amount("compléments salariaux bruts calculés"), 0);
  });
  it("values separately determined hours needed to reach six paid hours per qualifying period", () => {
    setSituation({ "heures de complément des périodes": "2 heure/mois", "taux horaire contractuel": "15 €/heure" });
    assert.equal(amount("complément minimum des périodes"), 30);
    setSituation({ "heures de complément des périodes": "2 heure/mois", "taux horaire contractuel": "10 €/heure" });
    assert.equal(amount("complément minimum des périodes"), Math.round(1883.85 / 151.67 * 2 * 100) / 100);
    assert.equal(amount("indemnité de panier"), 0);
  });
  it("leaves its rules inapplicable for another agreement", () => {
    setSituation({}, { "salarié . convention collective": "'droit commun'" });
    for (const name of Object.keys(extension).filter((name) => name !== namespace)) {
      assert.equal(engine.evaluate(name).nodeValue, null, name);
    }
  });
});
