import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1536-distributeurs-conseils-hors-domicile";
const value = "distributeurs conseils hors domicile";
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

const GRID: Record<string, number> = {
  "I.1": 1844, "I.2": 1856, "I.3": 1875, "I.4": 1891,
  "II.1": 1908, "II.2": 1929, "II.3": 1962, "II.4": 1982,
  "III.1": 2002, "III.2": 2024, "III.3": 2054, "III.4": 2079,
  "IV.1": 2106, "IV.2": 2161, "IV.3": 2267, "IV.4": 2376,
  "V.1": 2531, "V.2": 2820, "V.3": 3037, "V.4": 3257,
  "VI.1": 3572, "VI.2": 3825, "VI.3": 4304, "VI.4": 4632,
};

function setSituation(classification: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(classification === undefined ? {} : { [`${namespace} . classification`]: `'${classification}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

const outOfGrid = () => engine.evaluate(`${namespace} . classification hors grille`).nodeValue;

describe("IDCC 1536 — 2026.1 minimum salaries", () => {
  it("is in force from 1 March 2026 and cites the salary amendment and extension order", () => {
    assert.equal(version.validFrom, "2026-03-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 2026/1 du 3 mars 2026")));
    assert.ok(version.sources.some((source) => source.includes("Arrêté du 20 mai 2026")));
    assert.ok(version.sources.some((source) => source.includes("Journal officiel du 29 mai 2026")));
  });

  it("has all twenty-four level and echelon positions", () => {
    assert.equal(Object.keys(GRID).length, 24);
  });

  for (const [classification, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for ${classification}`, () => {
      setSituation(classification);
      assert.equal(minimum(), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setSituation("I.3", "50%");
    assert.equal(minimum(), 937.5);
    setSituation("VI.4", "80%");
    assert.equal(minimum(), 3705.6);
  });

  it("rejects classifications outside the grid", () => {
    for (const classification of ["0.1", "I.5", "VII.1", "non renseigné"]) {
      setSituation(classification);
      assert.equal(outOfGrid(), true, classification);
      assert.equal(minimum(), 0, classification);
    }
  });

  it("reports a missing classification as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(minimum(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("I.1");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . classification hors grille`).nodeValue, null);
  });
});
