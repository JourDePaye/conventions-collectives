import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1702-travaux-publics-ouvriers";
const value = "travaux publics ouvriers";
const namespace = `salarié . convention collective . ${value}`;
async function makeEngine() {
  const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.3");
  assert.ok(version, "IDCC 1702 must be exported");
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  return { engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }), version, extension };
}
function situation(engine: Engine, inputs: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié": "oui",
    "dirigeant": "non",
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . catégorie`]: "'ouvrier'",
    [`${namespace} . région`]: "'Bretagne'",
    [`${namespace} . coefficient`]: 100,
    [`${namespace} . date de calcul`]: "11/10/2026",
    ...Object.fromEntries(Object.entries(inputs).map(([key, val]) => [key.includes(" . ") || ["date", "salarié", "dirigeant", "plafond sécurité sociale"].includes(key) ? key : `${namespace} . ${key}`, val])),
  });
}
const evaluate = (engine: Engine, name: string) => engine.evaluate(`${namespace} . ${name}`);

const COEFFICIENTS = [100, 110, 125, 140, 150, 165, 180];
// Article 1 of each official regional accord, in coefficient order.
const REGIONS = [
  { region: "Bretagne", from: "24/02/2026", before: "23/02/2026", amounts: [23863, 24133, 24621, 27126, 29020, 31711, 34529] },
  { region: "Nouvelle-Aquitaine", from: "17/04/2026", before: "16/04/2026", amounts: [23242, 23751, 24210, 26969, 28883, 31214, 34040] },
  { region: "Bourgogne-Franche-Comté", from: "05/03/2026", before: "04/03/2026", amounts: [23287, 23785, 24764, 27420, 29345, 31733, 34182] },
  { region: "Centre-Val de Loire", from: "20/03/2026", before: "19/03/2026", amounts: [22893, 23337, 23931, 26783, 28683, 29490, 32166] },
  { region: "Grand Est", from: "20/03/2026", before: "19/03/2026", amounts: [23294, 23597, 24339, 26978, 28399, 31054, 33525] },
  { region: "Hauts-de-France", from: "20/03/2026", before: "19/03/2026", amounts: [23305, 23607, 24287, 27148, 29005, 31697, 34577] },
  { region: "Île-de-France", from: "17/04/2026", before: "16/04/2026", amounts: [23709, 23930, 24826, 27474, 28954, 31886, 34569] },
  { region: "Normandie", from: "24/02/2026", before: "23/02/2026", amounts: [23462, 23552, 24691, 27202, 29145, 31746, 34634] },
  { region: "Occitanie", from: "20/03/2026", before: "19/03/2026", amounts: [23160, 23518, 24606, 27301, 29105, 31550, 33928] },
  { region: "Pays de la Loire", from: "04/09/2026", before: "03/09/2026", amounts: [23537, 23733, 24749, 27334, 29301, 31743, 34619] },
];

// Each tracer bullet runs against the real combined modele-social engine.
describe("IDCC 1702 — coverage and date gates", () => {
  for (const { region, from, before, amounts } of REGIONS) {
    it(`${region}: refuses the grid before extension publication`, async () => {
      const { engine } = await makeEngine();
      situation(engine, { région: `'${region}'`, "date de calcul": before });
      assert.equal(evaluate(engine, "minimum annuel").nodeValue, null);
    });
    it(`${region}: opens on extension publication, not the KALI January start date`, async () => {
      const { engine } = await makeEngine();
      situation(engine, { région: `'${region}'`, "date de calcul": from, ...(region === "Pays de la Loire" ? { "année Pays de la Loire confirmée": "oui" } : {}) });
      assert.equal(evaluate(engine, "minimum annuel").nodeValue, amounts[0]);
      assert.equal(evaluate(engine, "calcul bloqué").nodeValue, false);
    });
  }
  for (const region of ["Auvergne-Rhône-Alpes", "Provence-Alpes-Côte d'Azur", "Corse", "Guadeloupe", "France", "", "non renseignée"]) {
    it(`refuses an unsupported or missing region: ${region}`, async () => {
      const { engine } = await makeEngine();
      situation(engine, { région: JSON.stringify(region).replace(/^\"|\"$/g, "'") });
      assert.equal(evaluate(engine, "minimum annuel").nodeValue, null);
      assert.equal(evaluate(engine, "région hors grille").nodeValue, true);
      assert.equal(evaluate(engine, "calcul bloqué").nodeValue, true);
    });
  }
  for (const coefficient of [0, 99, 101, 124, 181, 100.5]) {
    it(`refuses an unsupported coefficient: ${coefficient}`, async () => {
      const { engine } = await makeEngine();
      situation(engine, { coefficient });
      assert.equal(evaluate(engine, "minimum annuel").nodeValue, null);
      assert.equal(evaluate(engine, "coefficient hors grille").nodeValue, true);
    });
  }
  for (const category of ["ETAM", "cadre", "non renseignée"]) {
    it(`does not apply IDCC 1702 to ${category}`, async () => {
      const { engine } = await makeEngine();
      situation(engine, { catégorie: `'${category}'` });
      assert.equal(evaluate(engine, "minimum annuel").nodeValue, null);
      assert.equal(evaluate(engine, "calcul bloqué").nodeValue, true);
    });
  }
  it("blocks the inconsistent Pays de la Loire year unless explicitly confirmed", async () => {
    const { engine } = await makeEngine();
    situation(engine, { région: "'Pays de la Loire'" });
    assert.equal(evaluate(engine, "minimum annuel").nodeValue, null);
    assert.equal(evaluate(engine, "calcul bloqué").nodeValue, true);
    assert.equal(evaluate(engine, "incohérence année grille").nodeValue, true);
  });
  it("does not silently reuse 2026 grids before 2026 or in 2027", async () => {
    const { engine } = await makeEngine();
    for (const date of ["31/12/2025", "01/01/2027"]) {
      situation(engine, { "date de calcul": date });
      assert.equal(evaluate(engine, "minimum annuel").nodeValue, null);
      assert.equal(evaluate(engine, "calcul bloqué").nodeValue, true);
    }
    situation(engine, { "date de calcul": "31/12/2026" });
    assert.equal(evaluate(engine, "minimum annuel").nodeValue, 23863);
  });
  it("does not expose an ungated annual grid before regional extension", async () => {
    const { engine } = await makeEngine();
    situation(engine, { "date de calcul": "23/02/2026" });
    assert.equal(evaluate(engine, "grille annuelle").nodeValue, null);
  });
  it("rejects a contradictory cadre status for an ouvriers classification", async () => {
    const { engine } = await makeEngine();
    situation(engine, { "salarié . contrat . statut cadre": "oui", "droit à prime validé par caisse": "oui", "indemnité de congé des 24 jours": "2000 €" });
    assert.equal(evaluate(engine, "minimum annuel").nodeValue, null);
    assert.equal(evaluate(engine, "calcul bloqué").nodeValue, true);
    assert.equal(evaluate(engine, "prime de vacances").nodeValue, null);
  });
  for (const contract of ["apprentissage", "professionnalisation", "stage"]) {
    it(`refuses an unsupported ${contract} contract instead of applying the ordinary ouvriers floor`, async () => {
      const { engine } = await makeEngine();
      situation(engine, { [`salarié . contrat . ${contract}`]: "oui", "droit à prime validé par caisse": "oui", "indemnité de congé des 24 jours": "2000 €" });
      assert.equal(evaluate(engine, "prime de vacances").nodeValue, null);
      assert.equal(evaluate(engine, "minimum annuel").nodeValue, null);
      assert.equal(evaluate(engine, "calcul bloqué").nodeValue, true);
    });
  }
  it("requires region, category, coefficient and an explicit calculation date", async () => {
    const { engine } = await makeEngine();
    for (const missing of ["région", "catégorie", "coefficient", "date de calcul"]) {
      situation(engine);
      const inputs = engine.getSituation();
      delete inputs[`${namespace} . ${missing}`];
      engine.setSituation(inputs);
      assert.equal(evaluate(engine, "minimum annuel").nodeValue, null, missing);
      assert.equal(evaluate(engine, "calcul bloqué").nodeValue, true, missing);
    }
  });
});

describe("IDCC 1702 — annual comparison", () => {
  it("prorates the annual floor exactly once using the validated annual fraction", async () => {
    const { engine, extension } = await makeEngine();
    assert.ok(`${namespace} . salaire minimum annuel conventionnel` in extension);
    situation(engine, { "fraction annuelle validée": "50%", "salarié . contrat . temps de travail . quotité": "50%" });
    assert.equal(evaluate(engine, "minimum annuel").nodeValue, 23863);
    assert.equal(evaluate(engine, "salaire minimum annuel conventionnel").nodeValue, 11931.5);
  });
  it("requires the annual fraction instead of guessing absence, classification and third-party periods", async () => {
    const { engine, extension } = await makeEngine();
    assert.ok(`${namespace} . salaire minimum annuel conventionnel` in extension);
    situation(engine);
    const result = evaluate(engine, "salaire minimum annuel conventionnel");
    assert.equal(result.nodeValue, undefined);
    assert.ok(`${namespace} . fraction annuelle validée` in result.missingVariables, JSON.stringify(result.missingVariables));
  });
  it("compares only an externally validated Article 4.1 annual remuneration base", async () => {
    const { engine, extension } = await makeEngine();
    assert.ok(`${namespace} . régularisation annuelle` in extension);
    situation(engine, { "fraction annuelle validée": "50%" });
    assert.equal(evaluate(engine, "régularisation annuelle").nodeValue, null);
    situation(engine, { "fraction annuelle validée": "50%", "assiette annuelle validée": "oui", "rémunération annuelle retenue": "10000 €/an" });
    assert.equal(evaluate(engine, "régularisation annuelle").nodeValue, 1931.5);
    situation(engine, { "fraction annuelle validée": "50%", "assiette annuelle validée": "oui", "rémunération annuelle retenue": "15000 €/an" });
    assert.equal(evaluate(engine, "régularisation annuelle").nodeValue, 0);
  });
  it("does not turn a missing eligible remuneration base into zero", async () => {
    const { engine, extension } = await makeEngine();
    assert.ok(`${namespace} . régularisation annuelle` in extension);
    situation(engine, { "fraction annuelle validée": "100%", "assiette annuelle validée": "oui" });
    const result = evaluate(engine, "régularisation annuelle");
    assert.equal(result.nodeValue, undefined);
    assert.ok(`${namespace} . rémunération annuelle retenue` in result.missingVariables);
  });
});

describe("IDCC 1702 — caisse benefits", () => {
  it("computes the vacation premium only after eligibility is validated by the caisse", async () => {
    const { engine, extension } = await makeEngine();
    assert.ok(`${namespace} . prime de vacances` in extension);
    situation(engine);
    assert.equal(evaluate(engine, "prime de vacances").nodeValue, null);
    situation(engine, { "droit à prime validé par caisse": "oui", "indemnité de congé des 24 jours": "2000 €" });
    assert.equal(evaluate(engine, "prime de vacances").nodeValue, 600);
    assert.deepEqual(evaluate(engine, "prime de vacances").unit, { numerators: ["€"], denominators: [] });
  });
  it("requires the actual 24-day indemnity base for an eligible vacation premium", async () => {
    const { engine, extension } = await makeEngine();
    assert.ok(`${namespace} . prime de vacances` in extension);
    situation(engine, { "droit à prime validé par caisse": "oui" });
    const result = evaluate(engine, "prime de vacances");
    assert.equal(result.nodeValue, undefined);
    assert.ok(`${namespace} . indemnité de congé des 24 jours` in result.missingVariables);
  });
  it("deducts payments with the same object without producing a negative vacation premium", async () => {
    const { engine, extension } = await makeEngine();
    assert.ok(`${namespace} . prime de vacances` in extension);
    for (const [paid, expected] of [[100, 500], [600, 0], [700, 0]]) {
      situation(engine, { "droit à prime validé par caisse": "oui", "indemnité de congé des 24 jours": "2000 €", "prime de même objet déjà versée": `${paid} €` });
      assert.equal(evaluate(engine, "prime de vacances").nodeValue, expected);
    }
  });
  it("grants 2, 4 or 6 seniority leave days at 20, 25 or 30 years in the same company", async () => {
    const { engine, extension } = await makeEngine();
    assert.ok(`${namespace} . congés supplémentaires d'ancienneté` in extension);
    for (const [years, days] of [[0, 0], [19.99, 0], [20, 2], [24.99, 2], [25, 4], [29.99, 4], [30, 6], [40, 6]]) {
      situation(engine, { "services dans la même entreprise à fin de référence": `${years} an` });
      assert.equal(evaluate(engine, "congés supplémentaires d'ancienneté").nodeValue, days);
    }
  });
});

describe("IDCC 1702 — isolation and statutory baseline", () => {
  it("uses an independent namespace without overriding shared BTP rules", async () => {
    const { extension } = await makeEngine();
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
      assert.ok(!(name in modeleSocial), name);
    }
  });
  it("preserves the standard SMIC, overtime, contributions and employer total endpoints", async () => {
    const { engine } = await makeEngine();
    const baseline = new Engine(modeleSocial, { logger: { log() {}, warn() {}, error() {} } });
    const input = {
      "salarié": "oui", "dirigeant": "non", "date": "11/10/2026",
      "salarié . contrat . salaire brut": "3000 €/mois",
      "salarié . contrat . statut cadre": "non",
      "salarié . cotisations . assiette": "3000 €/mois",
      "plafond sécurité sociale": "4000 €/mois",
      "salarié . cotisations . prévoyances . santé . montant": "60 €/mois",
      "entreprise . salariés . effectif": 20,
      "établissement . taux ATMP": "2%",
      "salarié . temps de travail . heures supplémentaires": "10 heure/mois",
    };
    baseline.setSituation({ ...input, "salarié . convention collective": "'droit commun'" });
    situation(engine, input);
    for (const endpoint of ["salarié . contrat . temps de travail . SMIC", "salarié . rémunération . contrôle minimum", "salarié . temps de travail . heures supplémentaires . majoration", "salarié . cotisations . formation professionnelle"]) {
      const actual = engine.evaluate(endpoint);
      const expected = baseline.evaluate(endpoint);
      assert.notEqual(actual.nodeValue, undefined, endpoint);
      assert.equal(actual.nodeValue, expected.nodeValue, endpoint);
    }
    assert.equal(engine.evaluate("salarié . convention collective . BTP . OPPBTP").nodeValue, null);
  });
  it("keeps monthly SMIC protection even when the annual floor exceeds the year's pay", async () => {
    const { engine } = await makeEngine();
    situation(engine, { "date": "11/10/2026", "salarié . contrat . salaire brut": "1000 €/mois" });
    assert.equal(engine.evaluate("salarié . rémunération . contrôle minimum").nodeValue, true);
  });
  it("applies the TP workers employer prévoyance rate through three PMSS", async () => {
    const { engine } = await makeEngine();
    situation(engine, {
      "salarié . contrat . salaire brut": "20000 €/mois",
      "plafond sécurité sociale": "4000 €/mois",
    });
    assert.equal(engine.evaluate("salarié . cotisations . prévoyances . conventionnelle . employeur").nodeValue, 206.4);
    assert.equal(engine.evaluate("salarié . cotisations . prévoyances . conventionnelle . salarié").nodeValue, null);
  });
  it("makes agreement outputs inapplicable under another agreement", async () => {
    const { engine } = await makeEngine();
    situation(engine, { "salarié . convention collective": "'droit commun'" });
    for (const name of ["minimum annuel", "calcul bloqué", "salaire minimum annuel conventionnel", "régularisation annuelle", "prime de vacances", "congés supplémentaires d'ancienneté"]) {
      assert.equal(evaluate(engine, name).nodeValue, null, name);
    }
  });
});

describe("IDCC 1702 — regional annual minima", () => {
  it("exports the extended Brittany annual 35-hour minimum without a monthly conversion", async () => {
    const { engine, version, extension } = await makeEngine();
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.includes("https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054033905"));
    situation(engine);
    assert.equal(evaluate(engine, "minimum annuel").nodeValue, 23863);
    assert.deepEqual(evaluate(engine, "minimum annuel").unit, { numerators: ["€"], denominators: ["an"] });
    assert.ok(!(`${namespace} . salaire minimum conventionnel` in extension));
  });
  for (const { region, amounts } of REGIONS) {
    for (const [index, coefficient] of COEFFICIENTS.entries()) {
      it(`${region}, coefficient ${coefficient}: ${amounts[index]} €/an`, async () => {
        const { engine } = await makeEngine();
        situation(engine, { région: `'${region}'`, coefficient, ...(region === "Pays de la Loire" ? { "année Pays de la Loire confirmée": "oui" } : {}) });
        assert.equal(evaluate(engine, "minimum annuel").nodeValue, amounts[index]);
      });
    }
  }
});
