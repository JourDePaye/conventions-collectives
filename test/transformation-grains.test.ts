import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1930-transformation-grains";
const value = "métiers de la transformation des grains";
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
  I: 1871.06,
  II: 1955.58,
  III: 2047.84,
  IV: 2157.51,
  V: 2426.26,
  "VI.1": 2608.23,
  "VI.2": 2801.77,
  VII: 3399.33,
  VIII: 4063.66,
  IX: 5055.07,
};

function setSituation(level: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 1930 — 2026.1 minimum salaries", () => {
  it("is in force from 1 February 2026 and cites the official extension", () => {
    assert.equal(version.validFrom, "2026-02-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 30 du 9 février 2026")));
    assert.ok(version.sources.some((source) => source.includes("Arrêté du 4 mai 2026")));
    assert.ok(version.sources.some((source) => source.includes("AGRS2610625A")));
  });

  for (const [level, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for ${level}`, () => {
      setSituation(level);
      assert.equal(minimum(), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setSituation("IV", "50%");
    assert.equal(minimum(), 1078.76);
  });

  it("rejects levels and steps outside the grid", () => {
    for (const level of ["0", "X", "VI", "VI.3", "I.1"]) {
      setSituation(level);
      assert.equal(outOfGrid(), true, level);
      assert.equal(minimum(), 0, level);
    }
  });

  it("reports a missing level as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(minimum(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("IV");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, null);
  });
});
