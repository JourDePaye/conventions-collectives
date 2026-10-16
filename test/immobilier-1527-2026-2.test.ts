import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1527-immobilier";
const value = "immobilier";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.2");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

// Avenant n° 111 du 24 juin 2026, article 1er: annual minimum over 13 months, in euros.
const ANNUAL: Record<string, number> = {
  E1: 24272, E2: 24428, E3: 25080, AM1: 25569, AM2: 26415, C1: 28333, C2: 36932, C3: 44221, C4: 49800,
};
// Same minima as monthly amounts (annual / 13, rounded to the cent), written out by hand.
const MONTHLY: Record<string, number> = {
  E1: 1867.08, E2: 1879.08, E3: 1929.23, AM1: 1966.85, AM2: 2031.92, C1: 2179.46, C2: 2840.92, C3: 3401.62, C4: 3830.77,
};

function evaluate(rule: string, situation: Record<string, string | number>) {
  engine.setSituation({ "salarié . convention collective": `'${value}'`, ...situation });
  return engine.evaluate(`${namespace} . ${rule}`).nodeValue;
}
const cents = (n: unknown) => Math.round((n as number) * 100) / 100;

describe("IDCC 1527 immobilier 2026.2", () => {
  it("is in force from 1 June 2026, like 2026.1", () => {
    assert.equal(version.validFrom, "2026-06-01");
  });
  it("pays the grid of the avenant n° 111, every level", () => {
    for (const [level, monthly] of Object.entries(MONTHLY)) {
      assert.equal(cents(evaluate("salaire minimum conventionnel", { [`${namespace} . niveau`]: `'${level}'` })), monthly, level);
      assert.ok(Math.abs(monthly * 13 - ANNUAL[level]!) < 0.07, level);
    }
  });
  it("prorates the minimum by the working time", () => {
    assert.equal(cents(evaluate("salaire minimum conventionnel", { [`${namespace} . niveau`]: "'C4'", "salarié . contrat . temps de travail . quotité": "50%" })), 1915.39);
    assert.equal(cents(evaluate("salaire minimum conventionnel", { [`${namespace} . niveau`]: "'E1'", "salarié . contrat . temps de travail . quotité": "80%" })), 1493.66);
  });
  it("flags a level absent from the grid", () => {
    assert.equal(evaluate("niveau hors grille", { [`${namespace} . niveau`]: "'E4'" }), true);
    assert.equal(evaluate("niveau hors grille", {}), true);
    assert.equal(evaluate("niveau hors grille", { [`${namespace} . niveau`]: "'C2'" }), false);
  });
  it("adds 32 euros only for each complete period of 3 years (article 36)", () => {
    const expected: [number, number][] = [[0, 0], [2, 0], [3, 32], [4, 32], [5, 32], [6, 64], [8, 64], [9, 96], [12, 128], [30, 320]];
    for (const [years, bonus] of expected) {
      assert.equal(evaluate("prime d'ancienneté", { [`${namespace} . années complètes d'ancienneté`]: years }), bonus, `${years} years`);
    }
    assert.equal(evaluate("prime d'ancienneté", { [`${namespace} . années complètes d'ancienneté`]: 5.9 }), 32);
  });
});
