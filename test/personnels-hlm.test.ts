import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2150-personnels-hlm";
const value = "personnels hlm";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(coefficient: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(coefficient === undefined ? {} : { [`${namespace} . coefficient`]: `'${coefficient}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function evaluate(rule: string) {
  const result = engine.evaluate(`${namespace} . ${rule}`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 2150 — 2026.1 minima annuels", () => {
  it("starts on 1 January 2026 and cites the official extension", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 15 du 7 janvier 2026")));
    assert.ok(version.sources.some((source) => source.includes("JORFTEXT000053907654")));
  });

  it("evaluates every sourced coefficient group", () => {
    for (const [coefficient, expected] of [
      ["G1", 24599.54], ["EE", 24599.54], ["G2", 25586.99], ["AQ", 25586.99],
      ["G3", 27244.72], ["OHQ", 27244.72], ["G4", 30195.27], ["CE", 30195.27],
      ["G5", 38133.95], ["G6", 40318.01], ["G7", 46776.54], ["G8", 53305.70], ["G9", 65261.78],
    ] as const) {
      setSituation(coefficient);
      assert.equal(evaluate("salaire minimum annuel conventionnel"), expected, coefficient);
    }
  });

  it("keeps annual units and prorates both annual rubrics", () => {
    setSituation("G7", "50%");
    assert.equal(evaluate("salaire minimum annuel conventionnel"), 23388.27);
    assert.equal(evaluate("prime de vacances annuelle"), 450);
  });

  it("reports coefficients outside the grid and missing coefficients", () => {
    for (const coefficient of ["G0", "G10", "unknown"] as const) {
      setSituation(coefficient);
      assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true, coefficient);
      assert.equal(evaluate("salaire minimum annuel conventionnel"), 0, coefficient);
    }
    setSituation(undefined);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
    assert.equal(evaluate("salaire minimum annuel conventionnel"), 0);
  });

  it("is inapplicable to another agreement", () => {
    setSituation("G1");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, null);
  });
});
