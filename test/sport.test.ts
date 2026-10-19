import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const namespace = "salarié . convention collective . sport";
const quiet = { logger: { log() {}, warn() {}, error() {} } };

// 2026.3 has the amounts of 2026.1 and 2026.2 without redefining any modele-social rule.
for (const [versionNumber, supplement] of [
  ["2026.1", `${namespace} . cotisations . formation professionnelle . supplément conventionnel validé`],
  ["2026.3", `${namespace} . formation professionnelle 2025 . supplément conventionnel validé`],
] as const) {
  const version = COMPILED_VERSIONS["2511-sport"]?.find((v) => v.version === versionNumber);
  assert.ok(version);
  const extension = await version.loadRules();
  if (versionNumber === "2026.3") {
    for (const name of Object.keys(extension)) assert.ok(!(name in modeleSocial), `Duplicate modele-social rule: ${name}`);
  }
  const engine = new Engine({ ...modeleSocial, ...extension } as Record<string, Rule>, quiet);
  function situation(group = "3", extra: Record<string, string | number> = {}) {
    engine.setSituation({ "salarié . convention collective": "'sport'", [`${namespace} . groupe`]: `'${group}'`, ...extra });
  }
  function value(rule: string) { return engine.evaluate(rule.startsWith("salarié .") ? rule : `${namespace} . ${rule}`).nodeValue; }
  function amount(rule: string) {
    const result = value(rule);
    assert.equal(typeof result, "number", rule);
    return Math.round((result as number) * 100) / 100;
  }

  describe(`IDCC 2511 Sport ${versionNumber}`, () => {
    it("preserves all six sourced monthly floors", () => {
      assert.equal(version.validFrom, "2026-01-01");
      for (const [group, expected] of Object.entries({ "1": 1848.42, "2": 1885.14, "3": 1997.87, "4": 2099.37, "5": 2333.99, "6": 2865.97 })) {
        situation(group);
        assert.equal(amount("salaire minimum conventionnel"), expected);
      }
    });
    it("adds percentage operands without scaling the group-1 extra twice", () => {
      situation("1", { [`${namespace} . périodes de 24 mois d'ancienneté`]: 1, [`${namespace} . ancienneté groupe 1 au moins 3 ans`]: "oui" });
      assert.equal(amount("prime d'ancienneté"), 119.87);
    });
    it("uplifts hourly floors at the 10h and 24h boundaries", () => {
      for (const [hours, uplift] of [[5, 1.05], [10, 1.05], [10.01, 1.02], [23.99, 1.02], [24, 1], [35, 1]] as const) {
        for (const [group, floor] of Object.entries({ "1": 1848.42, "2": 1885.14, "3": 1997.87, "4": 2099.37, "5": 2333.99, "6": 2865.97 })) {
          situation(group, { "salarié . contrat . temps de travail . temps partiel": "oui", "salarié . contrat . temps de travail . temps partiel . heures par semaine": `${hours} heure/semaine` });
          assert.equal(amount("salaire minimum conventionnel"), Math.round(floor * hours / 35 * uplift * 100) / 100);
        }
      }
    });
    it("restricts seniority to groups 1–6, caps the total at 15%, and prorates", () => {
      for (const group of ["1", "2", "3", "4", "5", "6", "7", "8"]) {
        for (const periods of [0, 1, 2, 10, 14, 15, 16, 25]) {
          for (const extra of ["oui", "non"]) {
            situation(group, { [`${namespace} . périodes de 24 mois d'ancienneté`]: periods, [`${namespace} . ancienneté groupe 1 au moins 3 ans`]: extra, "salarié . contrat . temps de travail . quotité": "50%" });
            const rate = ["7", "8"].includes(group) ? 0 : Math.min(15, periods + (group === "1" && extra === "oui" ? 5 : 0));
            assert.equal(amount("prime d'ancienneté"), Math.round(1997.87 * rate / 100 * 0.5 * 100) / 100, `${group}/${periods}/${extra}`);
          }
        }
      }
    });
    it("uses the 2025 non-cadre protection rates through core endpoints", () => {
      situation("3", { "salarié . contrat . statut cadre": "non", "salarié . cotisations . assiette": "3000 €/mois", "plafond sécurité sociale": "4000 €/mois" });
      assert.equal(amount("salarié . cotisations . prévoyances . conventionnelle . employeur"), 14.55);
      assert.equal(amount("salarié . cotisations . prévoyances . conventionnelle . salarié"), 14.55);
      assert.equal(amount("salarié . cotisations . prévoyances . santé . montant"), 38.4);
      assert.equal(amount("salarié . cotisations . prévoyances . santé . employeur"), 19.2);
      assert.equal(amount("salarié . cotisations . prévoyances . santé . salarié"), 19.2);
      situation("3", { "salarié . contrat . statut cadre": "non", "salarié . cotisations . assiette": "3000 €/mois", "plafond sécurité sociale": "4000 €/mois", "salarié . régimes spécifiques . alsace moselle": "oui" });
      assert.equal(amount("salarié . cotisations . prévoyances . santé . montant"), 24.4);
      assert.equal(amount("salarié . cotisations . prévoyances . santé . employeur"), 12.2);
      assert.equal(amount("salarié . cotisations . prévoyances . santé . salarié"), 12.2);
    });
    it("caps non-cadre protection at the current TA/TB four-PMSS limit", () => {
      for (const [salary, expected] of [[16000, 77.6], [20000, 77.6], [32000, 77.6]] as const) {
        situation("3", { "salarié . contrat . statut cadre": "non", "salarié . cotisations . assiette": `${salary} €/mois`, "plafond sécurité sociale": "4000 €/mois" });
        assert.equal(amount("salarié . cotisations . prévoyances . conventionnelle . employeur"), expected);
        assert.equal(amount("salarié . cotisations . prévoyances . conventionnelle . salarié"), expected);
      }
    });
    it("does not automatically exempt ordinary employees or use special forfaits", () => {
      situation("3", { "salarié . cotisations . assiette": "600 €/mois", "établissement . taux ATMP": "2%", "entreprise . salariés . effectif": 5, [`${namespace} . primes . nombre de manifestations`]: "1 manifestations", [`${namespace} . primes . manifestation 1`]: "100 €" });
      assert.equal(amount("salarié . cotisations . ATMP"), 12);
      assert.equal(value("salarié . cotisations . assiette forfaitaire"), null);
      // 2026.3 disables modele-social's sport contributions, the franchise among them.
      if (versionNumber === "2026.3") assert.equal(value("cotisations . franchise"), null);
      else assert.equal(amount("cotisations . franchise"), 0);
    });
    it("restores legal formation rather than obsolete CIF and plan/professionnalisation", () => {
      for (const [employees, expected] of [[5, 16.5], [11, 30], [20, 30]] as const) {
        situation("3", { "salarié . cotisations . assiette": "3000 €/mois", "entreprise . salariés . effectif": employees });
        assert.equal(amount("salarié . cotisations . formation professionnelle"), expected);
      }
    });
    it("rejects missing/unknown classifications and stays inactive outside Sport", () => {
      for (const group of ["non renseigné", "0", "9", "invalid"]) {
        situation(group, { [`${namespace} . périodes de 24 mois d'ancienneté`]: 2 });
        assert.equal(value("groupe hors grille"), true);
        assert.equal(amount("salaire minimum conventionnel"), 0);
        assert.equal(amount("prime d'ancienneté"), 0);
        assert.equal(value("salaire minimum annuel conventionnel"), null);
      }
      engine.setSituation({ "salarié . convention collective": "'autre'" });
      for (const rule of ["salaire minimum conventionnel", "salaire minimum annuel conventionnel", "prime d'ancienneté", "santé 2025 . taux"]) assert.equal(value(rule), null);
    });
    it("leaves other conventions' core endpoints unchanged", () => {
      const baseline = new Engine(modeleSocial, quiet);
      const input = { "salarié . convention collective": "'autre'", "salarié . cotisations . assiette": "3000 €/mois", "entreprise . salariés . effectif": 5, "établissement . taux ATMP": "2%", "salarié . contrat . statut cadre": "non", "plafond sécurité sociale": "4000 €/mois" };
      engine.setSituation(input);
      baseline.setSituation(input);
      for (const rule of ["salarié . cotisations . ATMP", "salarié . cotisations . formation professionnelle", "salarié . cotisations . prévoyances . santé . montant", "salarié . cotisations . prévoyances . santé . salarié", "salarié . cotisations . prévoyances . conventionnelle . employeur"]) assert.equal(value(rule), baseline.evaluate(rule).nodeValue, rule);
    });
    it("preserves cadre protection and does not apply chapter-X protection to professionals", () => {
      situation("6", { "salarié . contrat . statut cadre": "oui", "salarié . cotisations . assiette": "3000 €/mois", "salarié . cotisations . assiette . sans prévoyance": "3000 €/mois", "plafond sécurité sociale": "4000 €/mois" });
      assert.equal(amount("salarié . cotisations . prévoyances . conventionnelle . employeur"), 0);
      assert.equal(amount("salarié . cotisations . prévoyances . conventionnelle . salarié"), 0);
      assert.equal(amount("salarié . cotisations . prévoyances . employeur . cadres"), 45);
      situation("3", { "salarié . contrat . statut cadre": "non", "salarié . cotisations . assiette": "3000 €/mois", [`${namespace} . salarié relevant du chapitre XII`]: "oui" });
      assert.equal(amount("salarié . cotisations . prévoyances . conventionnelle . employeur"), 0);
      assert.equal(value("salaire minimum conventionnel"), null);
      assert.equal(value("prime d'ancienneté"), null);
    });
    it("does not charge obsolete monthly paritarisme without a validated allocation", () => {
      situation("3", { "salarié . cotisations . assiette": "3000 €/mois", "entreprise . salariés . effectif": 5 });
      if (versionNumber === "2026.3") {
        // The allocation is added to the employer total, see below.
        assert.equal(value("cotisations . financement du paritarisme"), null);
        assert.equal(amount("allocation mensuelle paritarisme validée"), 0);
        return;
      }
      assert.equal(amount("cotisations . financement du paritarisme"), 0);
      situation("3", { [`${namespace} . allocation mensuelle paritarisme validée`]: "2.7 €/mois" });
      assert.equal(amount("cotisations . financement du paritarisme"), 2.7);
    });
    it("preserves employer-total integration for explicit formation and paritarisme allocations", () => {
      const input = { "salarié . rémunération . brut": "3000 €/mois", "salarié . contrat . statut cadre": "non", "entreprise . salariés . effectif": 5, "établissement . taux ATMP": "2%", "date": "01/01/2026" };
      situation("3", input);
      const base = amount("salarié . cotisations . employeur");
      situation("3", { ...input, [`${namespace} . allocation mensuelle paritarisme validée`]: "2.7 €/mois", [supplement]: "30 €/mois" });
      assert.equal(amount("salarié . cotisations . employeur"), Math.round((base + 32.7) * 100) / 100);
      assert.equal(amount("salarié . cotisations . formation professionnelle"), 46.5);
    });
    it("respects an explicit health contract, employer share, and dispensation", () => {
      situation("3", { "plafond sécurité sociale": "4000 €/mois", "salarié . cotisations . prévoyances . santé . taux employeur": "75%" });
      assert.equal(amount("salarié . cotisations . prévoyances . santé . employeur"), 28.8);
      assert.equal(amount("salarié . cotisations . prévoyances . santé . salarié"), 9.6);
      situation("3", { [`${namespace} . santé 2025 . montant contractuel`]: "60 €/mois" });
      assert.equal(amount("salarié . cotisations . prévoyances . santé . employeur"), 30);
      assert.equal(amount("salarié . cotisations . prévoyances . santé . salarié"), 30);
      situation("3", { [`${namespace} . santé 2025 . montant contractuel`]: "0 €/mois" });
      assert.equal(amount("salarié . cotisations . prévoyances . santé . salarié"), 0);
    });
    it("keeps groups 7 and 8 as annual floors, not monthly salaries", () => {
      for (const [group, expected] of [["7", 40597.94], ["8", 46833.81]] as const) {
        situation(group);
        assert.equal(amount("salaire minimum annuel conventionnel"), expected);
        assert.equal(value("salaire minimum conventionnel"), null);
        situation(group, { "salarié . contrat . temps de travail . quotité": "50%" });
        assert.equal(amount("salaire minimum annuel conventionnel"), Math.round(expected * 50) / 100);
      }
    });
  });
}
