import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const name = "1987-pates-alimentaires-seches";
const value = "pâtes alimentaires sèches et couscous non préparé";
const namespace = `salarié . convention collective . ${value}`;

const engineFor = async (version: string, coefficient: number, seniority = 0, quotient = "100%") => {
  const found = COMPILED_VERSIONS[name]?.find((item: { version: string }) => item.version === version);
  assert.ok(found, version);
  const extension = await found.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...new Set([...choice["une possibilité"], value])] } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . coefficient`]: coefficient,
    [`${namespace} . ancienneté en années`]: seniority,
    [`${namespace} . adhérent d'une organisation signataire`]: "oui",
    "salarié . contrat . temps de travail . quotité": quotient,
    "salarié . contrat . statut cadre": "non",
  });
  return engine;
};
const num = (engine: Engine, rule: string) => Math.round((engine.evaluate(`${namespace} . ${rule}`).nodeValue as number) * 10000) / 10000;

// Hard-coded from article 1 (prime d'ancienneté base table) and article 2 (minima) of each text.
const cases = [
  { version: "2026.2", base: { 135: 9.33, 200: 10.45, 340: 15.61 }, minimum: { 135: 12.08, 200: 13.02, 340: 19.45, 600: 31.49 }, vacances: 600 },
  { version: "2024.3", base: { 135: 8.9, 200: 9.98, 340: 14.9 }, minimum: { 135: 11.79, 200: 12.7, 340: 18.98, 600: 30.73 }, vacances: 575 },
] as const;

for (const c of cases) {
  describe(`IDCC 1987 ${c.version}`, () => {
    it("computes the prime d'ancienneté on the separate base table, not on the minimum", async () => {
      for (const [coefficient, base] of Object.entries(c.base)) {
        const engine = await engineFor(c.version, Number(coefficient), 15);
        assert.equal(num(engine, "base prime ancienneté"), base);
        assert.equal(num(engine, "prime ancienneté"), Math.round(base * 0.15 * 10000) / 10000);
      }
    });
    it("applies the seniority rates 0 / 3 / 6 / 9 / 12 / 15 %", async () => {
      const base = c.base[200];
      for (const [years, rate] of [[2, 0], [3, 0.03], [6, 0.06], [9, 0.09], [12, 0.12], [15, 0.15]] as const) {
        const engine = await engineFor(c.version, 200, years);
        assert.equal(num(engine, "prime ancienneté"), Math.round(base * rate * 10000) / 10000, `${years} years`);
      }
    });
    it("keeps the hourly minima of article 2", async () => {
      for (const [coefficient, hourly] of Object.entries(c.minimum)) {
        const engine = await engineFor(c.version, Number(coefficient));
        assert.equal(num(engine, "salaire minimum horaire"), hourly);
      }
    });
    it("converts to a monthly minimum on 151.67 h and prorates part-time", async () => {
      const full = await engineFor(c.version, 200);
      assert.equal(num(full, "salaire minimum conventionnel"), Math.round(c.minimum[200] * 151.67 * 10000) / 10000);
      const half = await engineFor(c.version, 200, 0, "50%");
      assert.equal(num(half, "salaire minimum conventionnel"), Math.round(c.minimum[200] * 151.67 * 0.5 * 10000) / 10000);
    });
    it("has no base above coefficient 340 and no minimum outside the grid", async () => {
      const above = await engineFor(c.version, 350, 15);
      assert.equal(num(above, "base prime ancienneté"), 0);
      assert.equal(num(above, "prime ancienneté"), 0);
      const outside = await engineFor(c.version, 999);
      assert.equal(outside.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
    });
    it("keeps the other amounts", async () => {
      const engine = await engineFor(c.version, 200);
      assert.equal(num(engine, "prime vacances"), c.vacances);
      assert.equal(num(engine, "indemnité journalière de poste"), 5.2);
      assert.equal(num(engine, "panier de nuit"), 11);
    });
  });
}
