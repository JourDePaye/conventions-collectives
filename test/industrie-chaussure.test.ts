import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1580-industrie-chaussure";
const value = "industrie chaussure";
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

const MONTHLY: Record<string, number> = {
  "1.1": 1823.03, "1.2": 1836, "1.3": 1846,
  "2.1": 1864, "2.2": 1886, "2.3": 1894,
  "3.1": 1910, "3.2": 1930,
};
const ANNUAL: Record<string, number> = {
  "4.1": 23177, "4.2": 23814, "4.3": 25793,
  "5.1": 26043, "5.2": 27909, "5.3": 30056,
  "6.1": 30348, "6.2": 34386,
  "P1.1": 32138, "P1.2": 34520, P2: 39797, P3: 46192, P4: 54721,
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
  return result as number;
}

const outOfGrid = () => engine.evaluate(`${namespace} . classification hors grille`).nodeValue;

describe("IDCC 1580 — industrie de la chaussure, 2026.1", () => {
  it("is effective from 1 January 2026 and cites the extended agreement", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source: string) => source.includes("Accord du 26 mars 2026")));
    assert.ok(version.sources.some((source: string) => source.includes("Arrêté du 11 juin 2026")));
    assert.ok(version.sources.some((source: string) => source.includes("JORFTEXT000054322358")));
  });

  for (const [classification, expected] of Object.entries(MONTHLY)) {
    it(`${classification}: ${expected} € monthly minimum`, () => {
      setSituation(classification);
      assert.equal(minimum(), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  for (const [classification, expected] of Object.entries(ANNUAL)) {
    it(`${classification}: ${expected} € annual minimum, one twelfth monthly`, () => {
      setSituation(classification);
      assert.ok(Math.abs(minimum() - expected / 12) < 1e-9);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates monthly and annual minimums once for part-time work", () => {
    setSituation("2.2", "50%");
    assert.equal(minimum(), 1886 / 2);
    setSituation("P2", "80%");
    assert.equal(minimum(), (39797 / 12) * 0.8);
  });

  it("rejects classifications outside the published grid", () => {
    for (const classification of ["1", "1.4", "3.3", "4", "6.3", "P1", "P5", "p1.1", "non renseigné"]) {
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

  it("is inapplicable when another collective agreement is selected", () => {
    setSituation("2.2");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . classification hors grille`).nodeValue, null);
  });
});
