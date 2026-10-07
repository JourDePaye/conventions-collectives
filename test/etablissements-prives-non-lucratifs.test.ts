import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0029-etablissements-prives-non-lucratifs";
const value = "établissements privés non lucratifs";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = {
  ...choice,
  "une possibilité": [...choice["une possibilité"], value],
} as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(coefficient: number | undefined, quota?: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(coefficient === undefined ? {} : { [`${namespace} . coefficient`]: coefficient }),
    ...(quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": quota }),
  });
}

const minimum = () => {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
};

const outOfGrid = () => engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue;

describe("IDCC 29 — 2026.1 base salary", () => {
  it("is in force from 1 January 2026 and cites the avenant", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source) => source.includes("n° 2025-04")));
  });

  it("multiplies the coefficient by 4.568 €", () => {
    // Hand-computed with decimals: coefficient × 4.568, rounded to the cent.
    const expected: [number, number][] = [
      [306, 1397.81], [376, 1717.57], [408, 1863.74], [409, 1868.31],
      [477, 2178.94], [590, 2695.12], [800, 3654.4], [1000, 4568],
    ];
    for (const [coefficient, amount] of expected) {
      setSituation(coefficient);
      assert.equal(minimum(), amount, `${coefficient}`);
      assert.equal(outOfGrid(), false);
    }
  });

  it("prorates the minimum once for part-time work", () => {
    setSituation(600, "50%");
    assert.equal(minimum(), 1370.4);
    setSituation(600, "80%");
    assert.equal(minimum(), 2192.64);
  });

  it("treats a missing or zero coefficient as outside the grid", () => {
    for (const coefficient of [undefined, 0]) {
      setSituation(coefficient);
      assert.equal(outOfGrid(), true);
      assert.equal(minimum(), 0);
    }
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation(477);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, null);
  });
});
