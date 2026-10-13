import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "2728-sucreries";
const ns = "salarié . convention collective . sucreries";

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((v) => v.version === "2026.2");
  assert.ok(version, "IDCC 2728 must be exported");
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "sucreries"] } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

function set(engine: Engine, inputs: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié": "oui",
    "dirigeant": "non",
    "salarié . convention collective": "'sucreries'",
    [`${ns} . classe`]: "'1A'",
    [`${ns} . date de calcul`]: "11/10/2026",
    [`${ns} . champ juridique`]: "'tous employeurs après extension'",
    ...Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key.includes(" . ") ? key : `${ns} . ${key}`, value])),
  });
}

const get = (engine: Engine, rule: string) => engine.evaluate(`${ns} . ${rule}`);

const annual = {
  "1A": 23005.08,
  "1B": 23417.5,
  "2A": 23925.49,
  "2B": 24536.45,
  "3A": 25262.66,
  "3B": 26108.63,
  "4A": 27083.47,
  "4B": 28200.41,
  "5A": 29473.9,
  "5B": 30921.04,
  "6A": 32561.61,
  "6B": 34417.91,
  "7A": 36516.26,
  "7B": 38889.62,
  "8": 41572.1,
  "9": 49665.63,
  "10": 61807.31,
} as const;

describe("IDCC 2728 — 2026 annual minimum salaries", () => {
  for (const [classe, amount] of Object.entries(annual)) {
    it(`class ${classe} annual minimum is ${amount} euros`, async () => {
      const engine = await makeEngine();
      set(engine, { classe: `'${classe}'` });
      assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, amount);
    });
  }

  it("rejects a class outside the sourced grid", async () => {
    const engine = await makeEngine();
    set(engine, { classe: "'11'" });
    assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, null);
  });
});

describe("IDCC 2728 — legal scope and effective date", () => {
  for (const [date, scope, expected] of [
    ["31/03/2026", "employeur signataire ou adhérent", null],
    ["01/04/2026", "employeur signataire ou adhérent", 23005.08],
    ["26/06/2026", "tous employeurs après extension", null],
    ["27/06/2026", "tous employeurs après extension", 23005.08],
    ["11/10/2026", "non renseigné", null],
  ] as const) {
    it(`${date} with ${scope} has expected availability`, async () => {
      const engine = await makeEngine();
      set(engine, { classe: "'1A'", "date de calcul": date, "champ juridique": `'${scope}'` });
      assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, expected);
    });
  }
});

describe("IDCC 2728 — annual endpoint", () => {
  it("keeps the sourced minimum in euros per year without inventing a monthly conversion", async () => {
    const engine = await makeEngine();
    set(engine, { classe: "'10'" });
    const result = get(engine, "salaire minimum annuel conventionnel");
    assert.equal(result.nodeValue, 61807.31);
    assert.equal(result.unit?.denominators?.includes("an"), true);
  });
});

describe("IDCC 2728 — specific annual minima and premiums", () => {
  it("applies the confirmed specific annual minima and senior executive minimum", async () => {
    const engine = await makeEngine();
    set(engine, { "catégorie spécifique": "'agents de maîtrise et techniciens confirmés'", "condition spécifique remplie": "oui" });
    assert.equal(get(engine, "rémunération spécifique").nodeValue, 31370.10);
    set(engine, { "catégorie spécifique": "'ingénieurs et cadres confirmés'", "condition spécifique remplie": "oui" });
    assert.equal(get(engine, "rémunération spécifique").nodeValue, 43208.27);
    set(engine, { "catégorie spécifique": "'cadres supérieurs'" });
    assert.equal(get(engine, "rémunération spécifique").nodeValue, 80043.76);
  });

  it("does not apply a confirmed-category minimum without the campaign or seniority condition", async () => {
    const engine = await makeEngine();
    set(engine, { "catégorie spécifique": "'agents de maîtrise et techniciens confirmés'" });
    assert.equal(get(engine, "rémunération spécifique").nodeValue, null);
  });

  it("calculates the night-post basket premium and exposes the vacation premium", async () => {
    const engine = await makeEngine();
    set(engine, { "type de poste avec panier": "'poste de 8 heures'", "nombre de postes avec panier": "10 poste/mois" });
    assert.equal(get(engine, "montant de la prime de panier").nodeValue, 6.02);
    assert.ok(Math.abs((get(engine, "prime de panier").nodeValue as number) - 60.2) < 1e-9);
    set(engine, { "type de poste avec panier": "'poste de plus de 8 heures'", "nombre de postes avec panier": "10 poste/mois" });
    assert.equal(get(engine, "prime de panier").nodeValue, 75.9);
    assert.equal(get(engine, "prime de vacances").nodeValue, 520.26);
  });
});
