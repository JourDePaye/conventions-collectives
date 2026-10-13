import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2609-batiment-etam";
const value = "bâtiment ETAM";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const version2 = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.2");
assert.ok(version2);
const extension2 = await version2.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
const engine2 = new Engine({ ...rules, ...extension2 }, { logger: { log() {}, warn() {}, error() {} } });

function situation(extra: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . région`]: "'Corse'",
    [`${namespace} . catégorie`]: "'ETAM'",
    [`${namespace} . niveau`]: "'A'",
    [`${namespace} . date de calcul`]: "01/04/2026",
    "salarié . contrat . statut cadre": "non",
    "salarié . cotisations . assiette": "5000 €/mois",
    "salarié . contrat . salaire brut": "5000 €/mois",
    "plafond sécurité sociale": "4005 €/mois",
    "date": "01/04/2026",
    ...extra,
  });
}
function situation2(extra: Record<string, string | number> = {}) {
  engine2.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . région`]: "'Occitanie'",
    [`${namespace} . catégorie`]: "'ETAM'",
    [`${namespace} . niveau`]: "'A'",
    [`${namespace} . date de calcul`]: "01/05/2026",
    "salarié . contrat . statut cadre": "non",
    "salarié . cotisations . assiette": "5000 €/mois",
    "salarié . contrat . salaire brut": "5000 €/mois",
    "plafond sécurité sociale": "4005 €/mois",
    "date": "01/05/2026",
    ...extra,
  });
}
function valueOf(rule: string) { return engine.evaluate(rule.startsWith("salarié .") ? rule : `${namespace} . ${rule}`).nodeValue; }
function valueOf2(rule: string) { return engine2.evaluate(rule.startsWith("salarié .") ? rule : `${namespace} . ${rule}`).nodeValue; }
function amount(rule: string) { const result = valueOf(rule); assert.equal(typeof result, "number", rule); return Math.round((result as number) * 100) / 100; }
function amount2(rule: string) { const result = valueOf2(rule); assert.equal(typeof result, "number", rule); return Math.round((result as number) * 100) / 100; }

describe("IDCC 2609 — 2026.1 building ETAM in Corsica", () => {
  it("uses the Corsica regional ETAM grid from 1 April 2026", () => {
    assert.equal(version.validFrom, "2026-04-01");
    for (const [level, expected] of Object.entries({ A: 1827.10, B: 1870.60, C: 1957.61, D: 2117.12, E: 2328.77, F: 2655.83, G: 2959.16, H: 3231.05 })) {
      situation({ [`${namespace} . niveau`]: `'${level}'` });
      assert.equal(amount("salaire minimum conventionnel"), expected, level);
    }
  });
  it("does not extrapolate the grid outside Corsica or to non-ETAM categories", () => {
    situation({ [`${namespace} . région`]: "'Bretagne'" });
    assert.equal(valueOf("région hors grille"), true);
    assert.equal(valueOf("salaire minimum conventionnel"), null);
    situation({ [`${namespace} . région`]: "'Corse'", [`${namespace} . catégorie`]: "'cadre'" });
    assert.equal(valueOf("catégorie hors champ"), true);
    assert.equal(valueOf("salaire minimum conventionnel"), null);
  });
  it("blocks the grid before the regional effective date", () => {
    situation({ [`${namespace} . date de calcul`]: "31/03/2026" });
    assert.equal(valueOf("période hors couverture"), true);
    assert.equal(valueOf("salaire minimum conventionnel"), null);
  });
  it("applies BTP bad-weather rates with the PMSS cap and documents company abatement limits", () => {
    situation({ [`${namespace} . chômage intempéries . secteur`]: "'gros œuvre'" });
    assert.equal(amount("chômage intempéries"), 27.23);
    situation({ [`${namespace} . chômage intempéries . secteur`]: "'second œuvre'" });
    assert.equal(amount("chômage intempéries"), 5.21);
  });
  it("does not apply the cadre RNPC correction to ETAM", () => {
    assert.equal(Object.keys(extension).some((name) => name.includes("prévoyance cadre")), false);
  });
  it("stays inactive outside the agreement", () => {
    situation();
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(valueOf("salaire minimum conventionnel"), null);
    assert.equal(valueOf("chômage intempéries"), null);
  });
  it("uses the extended Occitanie grid from 1 May 2026 in version 2026.2", () => {
    assert.equal(version2.validFrom, "2026-05-01");
    for (const [level, expected] of Object.entries({ A: 1847.16, B: 1936.54, C: 2061.72, D: 2256.45, E: 2462.01, F: 2902.48, G: 3176.04, H: 3497.50 })) {
      situation2({ [`${namespace} . niveau`]: `'${level}'` });
      assert.equal(amount2("salaire minimum conventionnel"), expected, level);
    }
    situation2({ [`${namespace} . date de calcul`]: "30/04/2026" });
    assert.equal(valueOf2("salaire minimum conventionnel"), null);
    situation2({ [`${namespace} . région`]: "'Corse'" });
    assert.equal(valueOf2("salaire minimum conventionnel"), null);
  });
});
