import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3248-metallurgie";
const value = "métallurgie";
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

/** Annual hierarchical minimums of the avenant of 20 February 2026 (35 hours a week). */
const ANNUAL: Record<string, number> = {
  A1: 21980,
  A2: 22100,
  B3: 22710,
  B4: 23620,
  C5: 24510,
  C6: 25780,
  D7: 26680,
  D8: 28700,
  E9: 30760,
  E10: 33970,
  F11: 35200,
  F12: 37000,
  G13: 40350,
  G14: 44250,
  H15: 47380,
  H16: 52370,
  I17: 59720,
  I18: 68450,
};

function setSituation(level: string | undefined, quota?: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    ...(quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": quota }),
  });
}

const amount = (name: string) => {
  const result = engine.evaluate(`${namespace} . ${name}`).nodeValue;
  assert.equal(typeof result, "number", name);
  return Math.round((result as number) * 100) / 100;
};

const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 3248 — 2026.1 hierarchical minimums", () => {
  it("is in force from 1 January 2026 and cites the avenant and its extension", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant du 20 février 2026")));
    assert.ok(version.sources.some((source) => source.includes("TRST2607042V")));
  });

  for (const [level, annual] of Object.entries(ANNUAL)) {
    it(`${level}: ${annual} € a year, a twelfth a month`, () => {
      setSituation(level);
      assert.equal(amount("salaire minimum hiérarchique annuel"), annual);
      assert.equal(amount("salaire minimum conventionnel"), Math.round((annual / 12) * 100) / 100);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("C5", "50%");
    assert.equal(amount("salaire minimum conventionnel"), 1021.25);
    setSituation("G13", "80%");
    assert.equal(amount("salaire minimum conventionnel"), 2690);
  });

  it("rejects classes outside the grid", () => {
    for (const level of ["A0", "A3", "B1", "J19", "A19", "I19", "a1", "1", "18", "non renseigné"]) {
      setSituation(level);
      assert.equal(outOfGrid(), true, level);
      assert.equal(amount("salaire minimum conventionnel"), 0, level);
    }
  });

  it("reports a missing class as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(amount("salaire minimum conventionnel"), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("C5");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "niveau hors grille", "salaire minimum hiérarchique annuel"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
