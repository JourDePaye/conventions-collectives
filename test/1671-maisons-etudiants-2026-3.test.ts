import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "maisons d'étudiants";
const namespace = `salarié . convention collective . ${value}`;
const list = COMPILED_VERSIONS["1671-maisons-etudiants"]!;
const version = list.find((v) => v.version === "2026.3");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const ADHERENT = "employeur signataire ou adhérent";

function minimum(classe: number, date: string, champ?: string, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . classe`]: classe,
    [`${namespace} . date de calcul`]: date,
    ...(champ ? { [`${namespace} . champ juridique`]: `'${champ}'` } : {}),
    "salarié . contrat . temps de travail . quotité": quota,
  });
  return engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue;
}

// Avenant n° 75, article 4 (coefficients) and avenant n° 76 (point 68,80 € from 1 January 2026; 67,78 € before).
const COEFFICIENTS = [333, 340, 347, 356, 365, 373, 381, 390, 400, 410, 420, 431, 459, 469, 499, 529, 559, 587, 627, 677];

describe("IDCC 1671 — 2026.3 dates of application", () => {
  it("is selected from 1 January 2026", () => {
    assert.equal(version.validFrom, "2026-01-01");
    const eligible = list.filter((v) => v.validFrom <= "2026-01-01");
    assert.equal(eligible.map((v) => v.version).sort().at(-1), "2026.3");
  });

  COEFFICIENTS.forEach((coefficient, index) => {
    it(`class ${index + 1}: coefficient ${coefficient} x 68,80 € for an adherent employer on 1 January 2026`, () => {
      assert.equal(minimum(index + 1, "01/01/2026", ADHERENT), Math.round(coefficient * 68.8 * 100) / 100);
    });
  });

  it("gives hard-coded amounts for the lowest, middle and highest classes", () => {
    assert.equal(minimum(1, "01/01/2026", ADHERENT), 22910.4);
    assert.equal(minimum(10, "01/01/2026", ADHERENT), 28208);
    assert.equal(minimum(20, "01/01/2026", ADHERENT), 46577.6);
  });

  it("does not apply before 1 January 2026", () => {
    assert.equal(minimum(10, "31/12/2025", ADHERENT), null);
  });

  it("binds all employers only from 12 July 2026 (JORF of 11 July), with the old point until 3 October", () => {
    assert.equal(minimum(10, "01/07/2026"), null);
    assert.equal(minimum(10, "11/07/2026"), null);
    assert.equal(minimum(10, "12/07/2026"), 27789.8);
    assert.equal(minimum(10, "03/10/2026"), 27789.8);
  });

  it("applies the 68,80 € point to all employers from 4 October 2026 (JORF of 3 October)", () => {
    assert.equal(minimum(10, "04/10/2026"), 28208);
    assert.equal(minimum(10, "16/10/2026"), 28208);
  });

  it("prorates once for part-time work", () => {
    assert.equal(minimum(10, "01/01/2026", ADHERENT, "50%"), 14104);
  });

  it("flags a class outside the grid", () => {
    minimum(21, "04/10/2026");
    assert.equal(engine.evaluate(`${namespace} . classe hors grille`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, null);
  });
});
