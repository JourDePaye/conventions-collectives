import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "miroiterie transformation négoce verre";
const namespace = `salarié . convention collective . ${value}`;
const versions = COMPILED_VERSIONS["1499-miroiterie"];
assert.ok(versions);

async function engineOf(revision: string) {
  const version = versions?.find((entry) => entry.version === revision);
  assert.ok(version, revision);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...new Set([...choice["une possibilité"], value])] } as Rule;
  Object.assign(rules, await version.loadRules());
  return { version, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
}
type Situation = { coefficient: number; seniority?: number; quota?: string };
function evaluate(engine: Engine, rule: string, situation: Situation) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . coefficient`]: situation.coefficient,
    ...(situation.seniority === undefined ? {} : { [`${namespace} . ancienneté`]: `${situation.seniority} années` }),
    ...(situation.quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": situation.quota }),
    "salarié . contrat . statut cadre": "non",
  });
  return engine.evaluate(`${namespace} . ${rule}`).nodeValue;
}
const round = (n: unknown, digits: number) => Math.round((n as number) * 10 ** digits) / 10 ** digits;

// [coefficient, monthly SMP, hourly SMP, hourly seniority premium at 3, 6, 9, 12, 15 years] (annex tables).
type Row = [number, number, number, number[]];
const GRID_2025: Row[] = [
  [140, 1801.73, 11.88, [0.3564, 0.7128, 1.0692, 1.4255, 1.7819]],
  [150, 1816.78, 11.98, [0.3594, 0.7187, 1.0781, 1.4375, 1.7968]],
  [160, 1822.9, 12.02, [0.3606, 0.7211, 1.0817, 1.4423, 1.8029]],
  [170, 1829.02, 12.06, [0.3618, 0.7236, 1.0854, 1.4471, 1.8089]],
  [180, 1835.13, 12.1, [0.363, 0.726, 1.089, 1.452, 1.815]],
  [200, 1844.11, 12.16, [0.3648, 0.7295, 1.0943, 1.4591, 1.8238]],
  [225, 1891.77, 12.47, [0.3742, 0.7484, 1.1226, 1.4968, 1.871]],
  [250, 1962.26, 12.94, [0.3881, 0.7763, 1.1644, 1.5526, 1.9407]],
  [275, 2020.84, 13.32, [0.3997, 0.7995, 1.1992, 1.5989, 1.9986]],
  [300, 2157.51, 14.23, [0.4268, 0.8535, 1.2803, 1.707, 2.1338]],
  [330, 2316.84, 15.28, [0.4583, 0.9166, 1.3748, 1.8331, 2.2914]],
  [370, 2526.12, 16.66, []],
  [410, 2743.81, 18.09, []],
  [460, 3016.31, 19.89, []],
  [550, 3510.27, 23.14, []],
  [660, 4117.84, 27.15, []],
  [880, 5340.49, 35.21, []]
];
const GRID_2026: Row[] = [
  [140, 1823.35, 12.02, [0.3606, 0.7212, 1.0818, 1.4424, 1.803]],
  [150, 1834.94, 12.09, [0.3627, 0.7254, 1.0881, 1.4508, 1.8135]],
  [160, 1839.3, 12.12, [0.3636, 0.7272, 1.0908, 1.4544, 1.818]],
  [170, 1843.65, 12.15, [0.3645, 0.729, 1.0935, 1.458, 1.8225]],
  [180, 1849.81, 12.19, [0.3657, 0.7314, 1.0971, 1.4628, 1.8285]],
  [200, 1858.86, 12.25, [0.3675, 0.735, 1.1025, 1.47, 1.8375]],
  [225, 1906.89, 12.56, [0.3768, 0.7536, 1.1304, 1.5072, 1.884]],
  [250, 1977.95, 13.04, [0.3912, 0.7824, 1.1736, 1.5648, 1.956]],
  [275, 2037.0, 13.42, [0.4026, 0.8052, 1.2078, 1.6104, 2.013]],
  [300, 2174.77, 14.34, [0.4302, 0.8604, 1.2906, 1.7208, 2.151]],
  [330, 2335.36, 15.4, [0.462, 0.924, 1.386, 1.848, 2.31]],
  [370, 2546.31, 16.79, []],
  [410, 2765.76, 18.23, []],
  [460, 3040.44, 20.04, []],
  [550, 3538.34, 23.32, []],
  [660, 4150.78, 27.36, []],
  [880, 5383.21, 35.49, []]
];
// The annex computes the premium from the unrounded hourly SMP, the model from the published two-decimal SMP: at most 15 % x 0,005 = 0,00075 apart.
const SENIORITY = [3, 6, 9, 12, 15];

describe("IDCC 1499 — 2025.2 (accord du 26 mars 2025, corrected)", async () => {
  const { version, engine } = await engineOf("2025.2");
  it("keeps the effective date of 2025.1 and cites the accord", () => {
    assert.equal(version.validFrom, "2025-05-01");
    assert.equal(versions.find((entry) => entry.version === "2025.1")?.validFrom, "2025-05-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000051910288")));
  });
  for (const [coefficient, monthly, hourly, premiums] of GRID_2025) {
    it(`${coefficient}: ${monthly} €/mois, ${hourly} €/heure`, () => {
      assert.equal(evaluate(engine, "salaire minimum conventionnel", { coefficient }), monthly);
      assert.equal(evaluate(engine, "salaire minimum horaire", { coefficient }), hourly);
      assert.equal(evaluate(engine, "coefficient hors grille", { coefficient }), false);
      SENIORITY.forEach((years, index) => {
        const premium = round(evaluate(engine, "prime ancienneté horaire", { coefficient, seniority: years }), 4);
        const expected = premiums[index] ?? 0;
        assert.ok(Math.abs(premium - expected) <= 0.001, `${coefficient} at ${years} years: ${premium} vs ${expected}`);
      });
    });
  }
  it("exposes the night meal bonus per night shift, not 2 882,77 € a month", () => {
    // Article 2 of the accord: 1,6 times the SMP of coefficient 140 (11,88 €/h), per shift.
    assert.equal(round(evaluate(engine, "prime de panier de nuit", { coefficient: 300 }), 3), 19.008);
  });
  it("gives no premium to coefficients 370 and above", () => {
    for (const coefficient of [370, 410, 460, 550, 660, 880]) {
      assert.equal(evaluate(engine, "prime ancienneté horaire", { coefficient, seniority: 20 }), 0, String(coefficient));
    }
    assert.equal(evaluate(engine, "prime ancienneté horaire", { coefficient: 140, seniority: 2 }), 0);
  });
  it("prorates the minimum once for part-time work", () => {
    assert.equal(round(evaluate(engine, "salaire minimum conventionnel", { coefficient: 300, quota: "50%" }), 3), 1078.755);
  });
  it("flags coefficients outside the grid", () => {
    for (const coefficient of [139, 999]) {
      assert.equal(evaluate(engine, "coefficient hors grille", { coefficient }), true);
      assert.equal(evaluate(engine, "salaire minimum conventionnel", { coefficient }), 0);
    }
  });
});

describe("IDCC 1499 — 2026.1 (accord du 3 mars 2026)", async () => {
  const { version, engine } = await engineOf("2026.1");
  it("applies from 1 May 2026 and cites the accord and its extension", () => {
    assert.equal(version.validFrom, "2026-05-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000054337384")));
    assert.ok(version.sources.some((source) => source.includes("19 mai 2026")));
    assert.equal(versions[versions.length - 1]?.version, "2026.1");
  });
  for (const [coefficient, monthly, hourly, premiums] of GRID_2026) {
    it(`${coefficient}: ${monthly} €/mois, ${hourly} €/heure`, () => {
      assert.equal(evaluate(engine, "salaire minimum conventionnel", { coefficient }), monthly);
      assert.equal(evaluate(engine, "salaire minimum horaire", { coefficient }), hourly);
      assert.equal(evaluate(engine, "coefficient hors grille", { coefficient }), false);
      SENIORITY.forEach((years, index) => {
        const premium = round(evaluate(engine, "prime ancienneté horaire", { coefficient, seniority: years }), 4);
        const expected = premiums[index] ?? 0;
        assert.ok(Math.abs(premium - expected) <= 0.001, `${coefficient} at ${years} years: ${premium} vs ${expected}`);
      });
    });
  }
  it("matches the amounts quoted in the audit (140, 200, 300, 550, 880)", () => {
    const expected: [number, number, number][] = [[140, 1823.35, 12.02], [200, 1858.86, 12.25], [300, 2174.77, 14.34], [550, 3538.34, 23.32], [880, 5383.21, 35.49]];
    for (const [coefficient, monthly, hourly] of expected) {
      assert.equal(evaluate(engine, "salaire minimum conventionnel", { coefficient }), monthly);
      assert.equal(evaluate(engine, "salaire minimum horaire", { coefficient }), hourly);
    }
  });
  it("keeps the night meal bonus at 1,6 times the SMP of coefficient 140 in force", () => {
    assert.equal(round(evaluate(engine, "prime de panier de nuit", { coefficient: 880 }), 3), 19.232);
  });
  it("gives no premium to coefficients 370 and above and prorates part-time work", () => {
    for (const coefficient of [370, 550, 880]) assert.equal(evaluate(engine, "prime ancienneté horaire", { coefficient, seniority: 20 }), 0);
    assert.equal(round(evaluate(engine, "salaire minimum conventionnel", { coefficient: 300, quota: "50%" }), 3), 1087.385);
  });
  it("flags coefficients outside the grid", () => {
    for (const coefficient of [139, 340, 999]) {
      assert.equal(evaluate(engine, "coefficient hors grille", { coefficient }), true);
      assert.equal(evaluate(engine, "salaire minimum conventionnel", { coefficient }), 0);
    }
  });
});
