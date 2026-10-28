import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const model = "1351-prevention-securite";
const value = "prévention et sécurité";
const namespace = `salarié . convention collective . ${value}`;
const list = COMPILED_VERSIONS[model]!;
const version = list.find((entry) => entry.version === "2026.4");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
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

// Annex 3 of the accord of 25 September 2023, column "Minima conventionnels au 1er janvier 2026",
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

function inForce(date: string) {
  const eligible = list.filter((entry) => entry.validFrom <= date);
  const latest = eligible.map((entry) => entry.validFrom).sort().at(-1);
  return eligible.filter((entry) => entry.validFrom === latest).map((entry) => entry.version).sort().at(-1);
}

describe("IDCC 1351 — 2026.4, January to June 2026", () => {
  it("is selected from 1 January to 30 June 2026 and replaced by 2026.3 (2026.5 with the salary maintenance, 2026.6 with the termination indemnities) on 1 July", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.equal(inForce("2025-12-31"), undefined);
    assert.equal(inForce("2026-01-01"), "2026.4");
    assert.equal(inForce("2026-06-30"), "2026.4");
    assert.equal(inForce("2026-07-01"), "2026.6");
  });

  for (const [category, entries] of Object.entries(salaryGrid)) {
    for (const [coefficient, expected] of entries) {
      it(`${category} coefficient ${coefficient}: ${expected} € for 151.67 hours`, () => {
        setSituation({ catégorie: `'${category}'`, coefficient });
        assert.equal(amount("minimum mensuel à temps plein"), expected);
        assert.equal(amount("salaire minimum conventionnel"), expected);
        assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, false);
      });
    }
  }

  it("has 25 paid positions", () => {
    assert.equal(Object.values(salaryGrid).flat().length, 25);
  });

  it("prorates once for part-time work", () => {
    setSituation({ coefficient: 150 }, { "salarié . contrat . temps de travail . quotité": "50%" });
    assert.equal(amount("salaire minimum conventionnel"), 1019.67);
  });

  it("flags positions outside the grid", () => {
    for (const [category, coefficient] of [["exploitation", 100], ["exploitation", 300], ["maîtrise", 140], ["cadre", 150]] as const) {
      setSituation({ catégorie: `'${category}'`, coefficient });
      assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true, `${category}/${coefficient}`);
      assert.equal(amount("salaire minimum conventionnel"), 0);
    }
  });

  it("uses the 1 January 2026 allowances", () => {
    setSituation({ "vacations avec panier": 2, "heures équipe homme-chien": "10 heure/mois", "entretien des tenues dû": "oui" });
    assert.equal(amount("montant du panier"), 4.48);
    assert.equal(amount("indemnité de panier"), 8.96);
    assert.equal(amount("indemnité d'entretien du chien"), 14.10);
    assert.equal(amount("indemnité d'entretien des tenues"), 8.78);
    setSituation({ "vacations avec panier": 1, "sûreté aérienne et aéroportuaire": "oui", "entretien des tenues dû": "oui" });
    assert.equal(amount("montant du panier"), 6.87);
    assert.equal(amount("indemnité d'entretien des tenues"), 12.20);
  });

  it("has no six-hour period minimum before 1 July 2026", () => {
    setSituation({ "heures de complément des périodes": "2 heure/mois", "taux horaire contractuel": "15 €/heure" });
    assert.equal(amount("complément minimum des périodes"), 0);
  });

  it("keeps the 2002 provident contribution", () => {
    setSituation({}, { "salarié . contrat . salaire brut": "3000 €/mois" });
    assert.equal(amount("prévoyance"), 31.8);
  });
});
