import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3212-travaux-publics-cadres";
const value = "travaux publics cadres";
const namespace = `salarié . convention collective . ${value}`;

async function makeEngine() {
  const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2024.1");
  assert.ok(version, "IDCC 3212 must be exported");
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
    [`${namespace} . position`]: "'A1'",
    [`${namespace} . forfait jours`]: "non",
    [`${namespace} . date de calcul`]: "01/01/2024",
    "salarié . contrat . statut cadre": "oui",
    "salarié . contrat . salaire brut": "4000 €/mois",
    ...Object.fromEntries(Object.entries(inputs).map(([key, val]) => [key.includes(" . ") || ["date", "salarié", "dirigeant", "plafond sécurité sociale"].includes(key) ? key : `${namespace} . ${key}`, val])),
  });
}

const evaluate = (engine: Engine, name: string) => engine.evaluate(`${namespace} . ${name}`);

const ANNUAL = { A1: 33257, A2: 36066, B: 37627, B1: 40566, B2: 43269, B3: 44368, B4: 47430, C1: 49414, C2: 57592 } as const;
const FORFAIT = { A1: 38245, A2: 41476, B: 43271, B1: 46651, B2: 49759, B3: 51023, B4: 54544, C1: 56826, C2: 66230 } as const;

describe("IDCC 3212 — annual salary grids", () => {
  for (const [position, amount] of Object.entries(ANNUAL)) {
    it(`${position} evaluates the 2024 annual minimum without monthly conversion`, async () => {
      const { engine } = await makeEngine();
      situation(engine, { position: `'${position}'` });
      assert.equal(evaluate(engine, "salaire minimum annuel conventionnel").nodeValue, amount);
      assert.deepEqual(evaluate(engine, "salaire minimum annuel conventionnel").unit, { numerators: ["€"], denominators: ["an"] });
    });
  }
  for (const [position, amount] of Object.entries(FORFAIT)) {
    it(`${position} selects the distinct forfait-jours annual minimum`, async () => {
      const { engine } = await makeEngine();
      situation(engine, { position: `'${position}'`, "forfait jours": "oui" });
      assert.equal(evaluate(engine, "salaire minimum annuel conventionnel").nodeValue, amount);
    });
  }
  it("does not apply the 2024 grid outside its effective period", async () => {
    const { engine } = await makeEngine();
    for (const date of ["31/12/2023", "01/01/2025"]) {
      situation(engine, { "date de calcul": date });
      assert.equal(evaluate(engine, "salaire minimum annuel conventionnel").nodeValue, null);
      assert.equal(evaluate(engine, "période hors couverture").nodeValue, true);
    }
  });
  it("rejects positions outside the sourced nine-position grid", async () => {
    const { engine } = await makeEngine();
    situation(engine, { position: "'D'" });
    assert.equal(evaluate(engine, "salaire minimum annuel conventionnel").nodeValue, null);
    assert.equal(evaluate(engine, "position hors grille").nodeValue, true);
  });
});

describe("IDCC 3212 — BTP cadre correction", () => {
  it("applies the BTP RNPC cadre correction only in the IDCC namespace", async () => {
    const { engine, extension } = await makeEngine();
    assert.ok(`${namespace} . prévoyance cadre` in extension);
    situation(engine);
    assert.equal(evaluate(engine, "prévoyance cadre . employeur").nodeValue, 60);
    assert.equal(evaluate(engine, "prévoyance cadre . salarié").nodeValue, 0);
  });
  it("does not redefine modele-social keys or invent CIBTP, intempéries or OPPBTP rates", async () => {
    const { extension } = await makeEngine();
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
      assert.ok(!(name in modeleSocial), name);
    }
    assert.equal(Object.keys(extension).some((name) => /CIBTP|intempéries|OPPBTP/i.test(name)), false);
  });
});
