import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1597-batiment-ouvriers-plus-de-10";
const value = "bâtiment ouvriers plus de 10 salariés";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function situation(extra: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . région`]: "'Nouvelle-Aquitaine'",
    [`${namespace} . catégorie`]: "'ouvrier'",
    [`${namespace} . coefficient`]: 150,
    [`${namespace} . date de calcul`]: "01/01/2026",
    "salarié . contrat . statut cadre": "non",
    "salarié . cotisations . assiette": "3000 €/mois",
    "salarié . contrat . salaire brut": "3000 €/mois",
    "plafond sécurité sociale": "4000 €/mois",
    "date": "01/01/2026",
    ...extra,
  });
}
function valueOf(rule: string) { return engine.evaluate(rule.startsWith("salarié .") ? rule : `${namespace} . ${rule}`).nodeValue; }
function amount(rule: string) { const result = valueOf(rule); assert.equal(typeof result, "number", rule); return Math.round((result as number) * 100) / 100; }

describe("IDCC 1597 — 2026.1 building workers in companies with more than 10 employees", () => {
  it("uses the Nouvelle-Aquitaine regional grid from 1 January 2026", () => {
    assert.equal(version.validFrom, "2026-01-01");
    for (const [coefficient, expected] of Object.entries({ 150: 1838.24, 170: 1862.51, 185: 1912.56, 210: 2073.33, 230: 2229.55, 250: 2399.42, 270: 2560.19 })) {
      situation({ [`${namespace} . coefficient`]: Number(coefficient) });
      assert.equal(amount("salaire minimum conventionnel"), expected, coefficient);
    }
  });
  it("does not extrapolate the grid to another region or unsupported category", () => {
    situation({ [`${namespace} . région`]: "'Bretagne'" });
    assert.equal(valueOf("région hors grille"), true);
    assert.equal(valueOf("salaire minimum conventionnel"), null);
    situation({ [`${namespace} . région`]: "'Nouvelle-Aquitaine'", [`${namespace} . catégorie`]: "'cadre'" });
    assert.equal(valueOf("catégorie hors champ"), true);
    assert.equal(valueOf("salaire minimum conventionnel"), null);
  });
  it("uses the 2026 Grand-Ouest CIBTP rate and bad-weather rates", () => {
    situation({ [`${namespace} . chômage intempéries . secteur`]: "'gros œuvre'" });
    assert.equal(amount("congés intempéries"), 621);
    assert.equal(amount("chômage intempéries"), 20.4);
    situation({ [`${namespace} . chômage intempéries . secteur`]: "'second œuvre'" });
    assert.equal(amount("chômage intempéries"), 3.9);
  });
  it("does not apply bad-weather contribution to a non-exposed activity", () => {
    situation({ [`${namespace} . chômage intempéries . secteur`]: "'non exposée'" });
    assert.equal(amount("chômage intempéries"), 0);
  });
  it("keeps RNPC tranche C optional and replaces ordinary cadre protection", () => {
    situation({ [`${namespace} . catégorie`]: "'cadre'", "salarié . contrat . statut cadre": "oui" });
    assert.equal(amount("prévoyance cadre"), 45);
    assert.equal(valueOf("prévoyance cadre . tranche C incluse"), false);
  });
  it("stays inactive outside the agreement", () => {
    situation();
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(valueOf("salaire minimum conventionnel"), null);
    assert.equal(valueOf("chômage intempéries"), null);
  });
});
