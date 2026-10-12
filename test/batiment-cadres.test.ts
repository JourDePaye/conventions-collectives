import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2420-batiment-cadres";
const value = "bâtiment cadres";
const namespace = `salarié . convention collective . ${value}`;
const ANNUAL = { 60: 2356, 65: 2553, 70: 2740, 75: 2853, 80: 3036, 85: 3197, 90: 3353, 95: 3504, 100: 3622, 103: 3693, 108: 3827, 120: 4145, 130: 4411, 162: 5472 } as const;

async function makeEngine() {
  const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
  assert.ok(version, "IDCC 2420 must be exported");
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
    [`${namespace} . coefficient`]: 60,
    [`${namespace} . champ juridique`]: "'employeur signataire ou adhérent'",
    [`${namespace} . date de calcul`]: "01/02/2026",
    "salarié . contrat . statut cadre": "oui",
    "salarié . contrat . salaire brut": "4000 €/mois",
    ...Object.fromEntries(Object.entries(inputs).map(([key, val]) => [key.includes(" . ") || ["date", "salarié", "dirigeant", "plafond sécurité sociale"].includes(key) ? key : `${namespace} . ${key}`, val])),
  });
}

const evaluate = (engine: Engine, name: string) => engine.evaluate(`${namespace} . ${name}`);

describe("IDCC 2420 — avenant n° 78 du 19 janvier 2026", () => {
  for (const [coefficient, amount] of Object.entries(ANNUAL)) {
    it(`${coefficient} evaluates the 39-hour monthly minimum`, async () => {
      const { engine } = await makeEngine();
      situation(engine, { coefficient: Number(coefficient) });
      assert.equal(evaluate(engine, "salaire minimum conventionnel").nodeValue, amount);
      assert.deepEqual(evaluate(engine, "salaire minimum conventionnel").unit, { numerators: ["€"], denominators: ["mois"] });
    });
  }

  it("does not apply outside the signatory or adherent scope", async () => {
    const { engine } = await makeEngine();
    situation(engine, { "champ juridique": "'autre employeur'" });
    assert.ok(evaluate(engine, "salaire minimum conventionnel").nodeValue == null);
    assert.equal(evaluate(engine, "calcul bloqué").nodeValue, true);
  });

  it("does not apply before 1 February 2026 or after the sourced period", async () => {
    const { engine } = await makeEngine();
    for (const date of ["31/01/2026", "31/12/2026", "01/01/2027"]) {
      situation(engine, { "date de calcul": date });
      assert.equal(evaluate(engine, "salaire minimum conventionnel").nodeValue, date === "31/12/2026" ? 2356 : null);
    }
  });

  it("rejects coefficients outside the sourced grid", async () => {
    const { engine } = await makeEngine();
    situation(engine, { coefficient: 61 });
    assert.equal(evaluate(engine, "salaire minimum conventionnel").nodeValue, null);
    assert.equal(evaluate(engine, "coefficient hors grille").nodeValue, true);
  });
});

describe("IDCC 2420 — BTP RNPC cadre correction", () => {
  it("applies the correction only in the IDCC namespace", async () => {
    const { engine, extension } = await makeEngine();
    assert.ok(`${namespace} . prévoyance cadre` in extension);
    situation(engine);
    assert.equal(evaluate(engine, "prévoyance cadre . employeur").nodeValue, 60);
    assert.equal(evaluate(engine, "prévoyance cadre . salarié").nodeValue, 0);
  });

  it("does not redefine modele-social keys or invent unsupported BTP rates", async () => {
    const { extension } = await makeEngine();
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
      assert.ok(!(name in modeleSocial), name);
    }
    assert.equal(Object.keys(extension).some((name) => /CIBTP|intempéries|OPPBTP/i.test(name)), false);
  });
});
