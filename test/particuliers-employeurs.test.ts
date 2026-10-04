import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "particuliers employeurs et emploi à domicile";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS["3239-particuliers-employeurs-emploi-domicile"]?.find((entry) => entry.version === "2026.1");
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
    // Keep the expected agreement grid independent of future SMIC changes.
    "SMIC . horaire": "12.31 €/heure",
    [`${namespace} . niveau`]: "'I'",
    ...Object.fromEntries(Object.entries(inputs).map(([name, input]) => [`${namespace} . ${name}`, input])),
    ...context,
  });
}

function amount(name: string) {
  const result = engine.evaluate(`${namespace} . ${name}`);
  assert.equal(typeof result.nodeValue, "number", name);
  return Math.round((result.nodeValue as number) * 100) / 100;
}

// Published values, including the rounded certified rates, from annex 6, avenant 10.
const grid = [
  ["I", 12.61, 2194.14, 13.11, 2281.14],
  ["II", 12.74, 2216.76, 13.25, 2305.50],
  ["III", 12.89, 2242.86, 13.41, 2333.34],
  ["IV", 13.08, 2275.92, 13.60, 2366.40],
  ["V", 13.28, 2310.72, 13.94, 2425.56],
  ["VI", 13.80, 2401.20, 14.49, 2521.26],
  ["VII", 14.11, 2455.14, 14.11, 2455.14],
  ["VIII", 14.52, 2526.48, 14.52, 2526.48],
  ["IX", 15.29, 2660.46, 15.29, 2660.46],
  ["X", 16.12, 2804.88, 16.12, 2804.88],
  ["XI", 17.06, 2968.44, 17.06, 2968.44],
  ["XII", 18.07, 3144.18, 18.07, 3144.18],
] as const;

describe("IDCC 3239 — June 2026 employee salary grid", () => {
  it("exports the effective date and primary legal references", () => {
    assert.equal(version.validFrom, "2026-06-01");
    for (const reference of ["KALITEXT000054254158", "KALITEXT000054254151", "KALITEXT000043941642", "LEGIARTI000018261010"]) {
      assert.ok(version.sources.some((source) => source.includes(reference)), reference);
    }
  });
  for (const [level, hourly, monthly, certifiedHourly, certifiedMonthly] of grid) {
    for (const certified of [false, true]) {
      it(`level ${level}, certification ${certified}: uses published hourly and 174-hour monthly values`, () => {
        setSituation({ "niveau": `'${level}'`, "certification professionnelle": certified ? "oui" : "non" });
        assert.equal(amount("taux horaire minimum"), certified ? certifiedHourly : hourly);
        assert.equal(amount("heures rémunérées de base"), 174);
        assert.equal(amount("salaire minimum conventionnel"), certified ? certifiedMonthly : monthly);
      });
    }
  }
  for (const level of ["non renseigné", "inconnu", "XIII", "0"]) {
    it(`flags invalid classification ${level} without a SMIC fallback`, () => {
      setSituation({ "niveau": `'${level}'`, "certification professionnelle": "oui" });
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
      assert.equal(amount("taux horaire minimum"), 0);
      assert.equal(amount("salaire minimum conventionnel"), 0);
    });
  }
  it("uses 52/12 at part-time and ignores generic modele-social proration", () => {
    setSituation({ "heures de base par semaine": "20 heure/semaine" }, { "salarié . contrat . temps de travail . quotité": "50%" });
    assert.equal(amount("heures rémunérées de base"), 86.67);
    assert.equal(amount("salaire minimum conventionnel"), 1092.87);
  });
  it("applies the employee SMIC floor after certification", () => {
    setSituation({ "certification professionnelle": "oui" }, { "SMIC . horaire": "14 €/heure" });
    assert.equal(amount("taux horaire minimum"), 14);
    assert.equal(amount("salaire minimum conventionnel"), 2436);
  });
  it("uses the date-dependent modele-social SMIC without overriding it", () => {
    setSituation();
    const situation = { ...engine.getSituation() };
    delete situation["SMIC . horaire"];
    engine.setSituation(situation);
    assert.equal(engine.evaluate("SMIC . horaire").nodeValue, 12.31);
    assert.equal(amount("salaire minimum conventionnel"), 2194.14);
  });
  it("converts eligible daytime responsible presence to two-thirds", () => {
    setSituation({ "heures de base par semaine": "20 heure/semaine", "heures de présence responsable par semaine": "6 heure/semaine" });
    assert.equal(amount("heures équivalentes par semaine"), 24);
    assert.equal(amount("heures rémunérées de base"), 104);
    assert.equal(amount("salaire minimum conventionnel"), 1311.44);
  });
  it("pays irregular hours using the actual monthly counter", () => {
    setSituation({ "mode de rémunération": "'réel'", "heures de base réelles du mois": "30 heure/mois" });
    assert.equal(amount("salaire minimum conventionnel"), 378.30);
  });
  it("exposes net benefit deductions without reducing the gross minimum", () => {
    setSituation();
    assert.equal(amount("prestation en nature repas"), 4.70);
    assert.equal(amount("prestation en nature logement"), 71);
    assert.equal(amount("salaire minimum conventionnel"), 2194.14);
  });
});

describe("IDCC 3239 — assistant maternel, per child", () => {
  for (const [certified, hourly, monthly] of [[false, 4.20, 819], [true, 4.37, 852.15]] as const) {
    it(`uses annex 5 and 45 hours/week over 52 weeks, certification ${certified}`, () => {
      setSituation({ "socle": "'assistant maternel'", "niveau": "'non renseigné'", "certification professionnelle": certified ? "oui" : "non" });
      assert.equal(amount("taux horaire minimum"), hourly);
      assert.equal(amount("heures rémunérées de base"), 195);
      assert.equal(amount("salaire minimum conventionnel"), monthly);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, false);
      assert.equal(engine.evaluate(`${namespace} . prestation en nature logement`).nodeValue, null);
    });
  }
  for (const [weeks, expected] of [[44, 616], [46, 644], [52, 728]]) {
    it(`monthly base over ${weeks} weeks excludes incomplete-year paid leave`, () => {
      setSituation({ "socle": "'assistant maternel'", "heures de base par semaine": "40 heure/semaine", "semaines programmées": weeks! });
      assert.equal(amount("salaire minimum conventionnel"), expected);
    });
  }
  it("pays occasional care using actual hours without applying 52/12", () => {
    setSituation({ "socle": "'assistant maternel'", "mode de rémunération": "'réel'", "heures de base réelles du mois": "20 heure/mois" });
    assert.equal(amount("salaire minimum conventionnel"), 84);
  });
  it("uses the statutory 0.281 SMIC floor rather than the full SMIC", () => {
    setSituation({ "socle": "'assistant maternel'" }, { "SMIC . horaire": "20 €/heure" });
    assert.equal(amount("taux horaire minimum"), 5.62);
    assert.equal(amount("salaire minimum conventionnel"), 1095.90);
  });
});

describe("IDCC 3239 — additional paid hours", () => {
  it("pays full overtime remuneration at the contractual rate, without including it in the base minimum", () => {
    setSituation({ "taux horaire contractuel": "15 €/heure", "heures supplémentaires à 25 pour cent": "8 heure/mois", "heures supplémentaires à 50 pour cent": "2 heure/mois" },
      { "salarié . contrat . temps de travail . quotité": "50%" });
    assert.equal(amount("rémunération des heures additionnelles"), 195);
    assert.equal(amount("salaire minimum conventionnel"), 2194.14);
  });
  it("protects additional hours against a contractual rate below the minimum", () => {
    setSituation({ "taux horaire contractuel": "10 €/heure", "heures supplémentaires à 25 pour cent": "8 heure/mois" });
    assert.equal(amount("rémunération des heures additionnelles"), 126.10);
  });
  for (const [inputRate, expected] of [["0%", 22], ["10%", 22], ["20%", 24]] as const) {
    it(`assistant maternel enforces the 10% floor for input ${inputRate}`, () => {
      setSituation({ "socle": "'assistant maternel'", "taux horaire contractuel": "5 €/heure", "heures majorées": "4 heure/mois", "taux de majoration des heures majorées": inputRate });
      assert.equal(amount("rémunération des heures additionnelles"), expected);
    });
  }
  it("does not impose a complementary-hour increase, and uses an agreed rate when supplied", () => {
    setSituation({ "socle": "'assistant maternel'", "taux horaire contractuel": "5 €/heure", "heures complémentaires": "4 heure/mois" });
    assert.equal(amount("rémunération des heures additionnelles"), 20);
    setSituation({ "socle": "'assistant maternel'", "taux horaire contractuel": "5 €/heure", "heures complémentaires": "4 heure/mois", "taux de majoration des heures complémentaires": "25%" });
    assert.equal(amount("rémunération des heures additionnelles"), 25);
  });
});

describe("IDCC 3239 — invalid situations and agreement isolation", () => {
  const invalidInputs: Record<string, string | number>[] = [
    { "socle": "'inconnu'" },
    { "mode de rémunération": "'inconnu'" },
    { "heures de base par semaine": "-1 heure/semaine" },
    { "heures de base par semaine": "41 heure/semaine" },
    { "heures de présence responsable par semaine": "-1 heure/semaine" },
    { "mode de rémunération": "'réel'", "heures de base réelles du mois": "-1 heure/mois" },
    ...[0, 47, 51, 53].map((weeks) => ({ "socle": "'assistant maternel'", "semaines programmées": weeks })),
    { "socle": "'assistant maternel'", "heures de présence responsable par semaine": "1 heure/semaine" },
    { "socle": "'assistant maternel'", "heures de base par semaine": "46 heure/semaine" },
    { "heures supplémentaires à 25 pour cent": "-1 heure/mois" },
    { "heures supplémentaires à 50 pour cent": "-1 heure/mois" },
    { "socle": "'assistant maternel'", "heures complémentaires": "-1 heure/mois" },
    { "socle": "'assistant maternel'", "heures majorées": "-1 heure/mois" },
  ];
  for (const inputs of invalidInputs) {
    it(`rejects ${JSON.stringify(inputs)}`, () => {
      setSituation(inputs);
      assert.equal(engine.evaluate(`${namespace} . paramètres invalides`).nodeValue, true);
      assert.equal(amount("salaire minimum conventionnel"), 0);
      assert.equal(amount("rémunération des heures additionnelles"), 0);
    });
  }
  it("leaves every extension rule inapplicable when another agreement is selected", () => {
    setSituation({}, { "salarié . convention collective": "'droit commun'" });
    for (const name of Object.keys(extension).filter((name) => name !== namespace)) {
      assert.equal(engine.evaluate(name).nodeValue, null, name);
    }
  });
});
