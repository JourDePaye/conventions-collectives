import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1596-batiment-ouvriers-petites-entreprises";
const value = "bâtiment ouvriers petites entreprises";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = {
  ...choice,
  "une possibilité": [...choice["une possibilité"], value],
} as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function situation(extra: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . région`]: "'Centre-Val de Loire'",
    [`${namespace} . catégorie`]: "'ouvrier'",
    [`${namespace} . coefficient`]: 150,
    [`${namespace} . date de calcul`]: "01/05/2026",
    "salarié . contrat . statut cadre": "non",
    "salarié . cotisations . assiette": "3000 €/mois",
    "salarié . contrat . salaire brut": "3000 €/mois",
    "plafond sécurité sociale": "4000 €/mois",
    "date": "01/04/2026",
    ...extra,
  });
}

function valueOf(rule: string) {
  return engine.evaluate(rule.startsWith("salarié .") ? rule : `${namespace} . ${rule}`).nodeValue;
}

function amount(rule: string) {
  const result = valueOf(rule);
  assert.equal(typeof result, "number", rule);
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 1596 — 2026.1 building workers in companies with up to 10 employees", () => {
  it("uses the Centre-Val de Loire regional grid from 1 May 2026", () => {
    assert.equal(version.validFrom, "2026-05-01");
    for (const [coefficient, expected] of Object.entries({
      150: 1823,
      170: 1863,
      185: 1907,
      210: 2056,
      230: 2175,
      250: 2293,
      270: 2412,
    })) {
      situation({ [`${namespace} . coefficient`]: Number(coefficient) });
      assert.equal(amount("salaire minimum conventionnel"), expected, coefficient);
    }
  });

  it("does not extrapolate the regional grid to another region or unsupported category", () => {
    situation({ [`${namespace} . région`]: "'Bretagne'" });
    assert.equal(valueOf("région hors grille"), true);
    assert.equal(valueOf("salaire minimum conventionnel"), null);
    situation({ [`${namespace} . région`]: "'Centre-Val de Loire'", [`${namespace} . catégorie`]: "'cadre'" });
    assert.equal(valueOf("catégorie hors champ"), true);
    assert.equal(valueOf("salaire minimum conventionnel"), null);
  });

  it("blocks the grid before the regional effective date", () => {
    situation({ [`${namespace} . date de calcul`]: "30/04/2026" });
    assert.equal(valueOf("période hors couverture"), true);
    assert.equal(valueOf("salaire minimum conventionnel"), null);
  });

  it("uses the 2026 Centre CIBTP leave rate and bad-weather rates", () => {
    situation({
      [`${namespace} . caisse de rattachement`]: "'centre'",
      [`${namespace} . chômage intempéries . secteur`]: "'gros œuvre'",
    });
    assert.equal(amount("congés intempéries"), 621);
    assert.equal(amount("chômage intempéries"), 20.4);
    situation({
      [`${namespace} . caisse de rattachement`]: "'centre'",
      [`${namespace} . chômage intempéries . secteur`]: "'second œuvre'",
    });
    assert.equal(amount("chômage intempéries"), 3.9);
  });

  it("does not apply the CIBTP bad-weather contribution to a non-exposed activity", () => {
    situation({ [`${namespace} . chômage intempéries . secteur`]: "'non exposée'" });
    assert.equal(amount("chômage intempéries"), 0);
  });

  it("keeps RNPC tranche C optional and replaces ordinary cadre protection", () => {
    situation({
      [`${namespace} . catégorie`]: "'cadre'",
      "salarié . contrat . statut cadre": "oui",
    });
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
