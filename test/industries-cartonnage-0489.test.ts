import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0489-industries-cartonnage";
const value = "industries du cartonnage";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2025.3");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
const monthly: Record<number, number> = { 180: 1841.27, 185: 1851.89, 190: 1862.51, 195: 1876.16, 200: 1886.77, 210: 1921.66, 220: 1979.29, 240: 2105.18, 260: 2202.25, 275: 2309.93, 290: 2411.55, 315: 2582.94, 350: 2822.58 };
function setSituation(category: string, coefficient: number, quota = "100%") { engine.setSituation({ "salarié . convention collective": `'${value}'`, [`${namespace} . catégorie`]: `'${category}'`, [`${namespace} . coefficient`]: coefficient, "salarié . contrat . temps de travail . quotité": quota }); }
const get = (rule: string) => engine.evaluate(`${namespace} . ${rule}`).nodeValue;
const num = (rule: string) => { const value = get(rule); assert.equal(typeof value, "number"); return Math.round((value as number) * 100) / 100; };

describe("IDCC 489 — 2025.3 salaires et audit paie", () => {
  it("uses the signatory effective date and official BOCC source", () => { assert.equal(version.validFrom, "2025-05-01"); assert.ok(version.sources.some((source) => source.includes("ASET2550438M"))); });
  for (const [coefficient, expected] of Object.entries(monthly)) it(`coefficient ${coefficient}: ${expected} €/month`, () => { setSituation("ouvriers employés et agents de maîtrise", Number(coefficient)); assert.equal(num("salaire minimum conventionnel"), expected); assert.equal(get("classification hors grille"), false); });
  it("prorates the monthly minimum once", () => { setSituation("ouvriers employés et agents de maîtrise", 240, "50%"); assert.equal(num("salaire minimum conventionnel"), 1052.59); });
  it("evaluates the annual cadre guarantees without monthly conversion", () => { setSituation("cadres", 600); assert.equal(num("garantie annuelle cadre"), 56980); assert.equal(num("salaire minimum conventionnel"), 0); assert.equal(get("audit paie"), true); });
  it("rejects an unknown classification and isolates another agreement", () => { setSituation("ouvriers employés et agents de maîtrise", 999); assert.equal(get("classification hors grille"), true); engine.setSituation({ "salarié . convention collective": "'droit commun'" }); assert.equal(get("audit paie"), null); });
});

describe("IDCC 489 — 2025.4 executives in the grid", () => {
  it("keeps the effective date and no longer marks executives' coefficients out of the grid", async () => {
    const revision = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2025.4");
    assert.ok(revision);
    assert.equal(revision.validFrom, "2025-05-01");
    const fixed = new Engine({ ...rules, ...(await revision.loadRules()) }, { logger: { log() {}, warn() {}, error() {} } });
    const evaluate = (coefficient: number, rule: string) => {
      fixed.setSituation({ "salarié . convention collective": `'${value}'`, [`${namespace} . coefficient`]: coefficient });
      return fixed.evaluate(`${namespace} . ${rule}`).nodeValue;
    };
    for (const [coefficient, guarantee] of [[355, 34696], [600, 56980], [700, 66053]] as const) {
      assert.equal(evaluate(coefficient, "classification hors grille"), false, String(coefficient));
      assert.equal(evaluate(coefficient, "garantie annuelle cadre"), guarantee);
      assert.equal(evaluate(coefficient, "salaire minimum conventionnel"), 0);
    }
    assert.equal(evaluate(240, "classification hors grille"), false);
    assert.equal(evaluate(240, "salaire minimum conventionnel"), 2105.18);
    for (const coefficient of [0, 999]) assert.equal(evaluate(coefficient, "classification hors grille"), true, String(coefficient));
  });
});
