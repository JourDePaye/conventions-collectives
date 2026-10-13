import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2614-travaux-publics-etam";
const value = "travaux publics ETAM";
const namespace = `salarié . convention collective . ${value}`;

async function makeEngine() {
  const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.2");
  assert.ok(version, "IDCC 2614 must be exported");
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
    [`${namespace} . catégorie`]: "'ETAM'",
    [`${namespace} . région`]: "'Île-de-France'",
    [`${namespace} . niveau`]: "'A'",
    [`${namespace} . forfait jours`]: "non",
    [`${namespace} . date de calcul`]: "17/04/2026",
    "salarié . contrat . statut cadre": "non",
    "salarié . cotisations . assiette": "5000 €/mois",
    "salarié . contrat . salaire brut": "5000 €/mois",
    "plafond sécurité sociale": "4005 €/mois",
    "date": "17/04/2026",
    ...inputs,
  });
}

const evaluate = (engine: Engine, rule: string) => engine.evaluate(`${namespace} . ${rule}`);
const amount = (engine: Engine, rule: string) => {
  const result = evaluate(engine, rule);
  assert.equal(typeof result.nodeValue, "number", rule);
  return Math.round((result.nodeValue as number) * 100) / 100;
};

describe("IDCC 2614 — Île-de-France ETAM 2026", () => {
  it("uses the sourced annual regional grid", async () => {
    const { engine, version } = await makeEngine();
    assert.equal(version.version, "2026.2");
    assert.equal(version.validFrom, "2026-04-17");
    for (const [level, expected] of Object.entries({ A: 23545, B: 25372, C: 27185, D: 29847, E: 33260, F: 37255, G: 39628, H: 40624 })) {
      situation(engine, { [`${namespace} . niveau`]: `'${level}'` });
      assert.equal(amount(engine, "salaire minimum annuel conventionnel"), expected, level);
    }
  });

  it("uses the separate forfait-jours minima only for F to H", async () => {
    const { engine } = await makeEngine();
    for (const [level, expected] of Object.entries({ F: 42843, G: 45572, H: 46718 })) {
      situation(engine, { [`${namespace} . niveau`]: `'${level}'`, [`${namespace} . forfait jours`]: "oui" });
      assert.equal(amount(engine, "salaire minimum annuel conventionnel"), expected, level);
    }
    situation(engine, { [`${namespace} . niveau`]: "'E'", [`${namespace} . forfait jours`]: "oui" });
    assert.equal(amount(engine, "salaire minimum annuel conventionnel"), 33260);
  });

  it("does not extrapolate outside Île-de-France, ETAM, or 2026 coverage", async () => {
    const { engine } = await makeEngine();
    for (const extra of [
      { [`${namespace} . région`]: "'Bretagne'" },
      { [`${namespace} . catégorie`]: "'cadre'" },
      { [`${namespace} . date de calcul`]: "16/04/2026" },
      { [`${namespace} . date de calcul`]: "01/01/2027" },
    ] as Record<string, string | number>[]) {
      situation(engine, extra);
      assert.equal(evaluate(engine, "salaire minimum annuel conventionnel").nodeValue, null);
      assert.equal(evaluate(engine, "calcul bloqué").nodeValue, true);
    }
  });

  it("applies scoped BTP CIBTP, bad-weather, and OPPBTP corrections", async () => {
    const { engine, extension } = await makeEngine();
    assert.ok(Object.keys(extension).every((name) => name === namespace || name.startsWith(`${namespace} . `)));
    situation(engine, { [`${namespace} . chômage intempéries . secteur`]: "'gros œuvre'" });
    assert.equal(amount(engine, "congés intempéries"), 1010);
    assert.equal(amount(engine, "chômage intempéries"), 27.23);
    assert.equal(amount(engine, "OPPBTP"), 6.22);
    situation(engine, { [`${namespace} . chômage intempéries . secteur`]: "'second œuvre'" });
    assert.equal(amount(engine, "chômage intempéries"), 5.21);
  });

  it("does not add cadre RNPC correction and stays inactive outside the agreement", async () => {
    const { engine, extension } = await makeEngine();
    assert.equal(Object.keys(extension).some((name) => name.includes("prévoyance cadre")), false);
    situation(engine, { "salarié . convention collective": "'droit commun'" });
    assert.equal(evaluate(engine, "salaire minimum annuel conventionnel").nodeValue, null);
    assert.equal(evaluate(engine, "chômage intempéries").nodeValue, null);
  });
});
