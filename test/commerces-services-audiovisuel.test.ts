import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1686-commerces-services-audiovisuel";
const value = "audiovisuel électronique équipement ménager";
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

/** Monthly minimums for 151.67 hours, article 2 of avenant n° 63 of 12 February 2026. */
const MONTHLY: Record<string, number> = {
  "I.1": 1827.03, "I.2": 1831.21, "I.3": 1843.11,
  "II.1": 1883.31, "II.2": 1928.72, "II.3": 1974.07,
  "III.1": 2015.67, "III.2": 2060.98, "III.3": 2106.23,
  "IV.1": 2171.24, "IV.2": 2419.31, "IV.3": 2665.45,
};

/** Annual remunerations of the four positions of cadres. */
const ANNUAL: Record<string, number> = {
  C1: 32187.06, C2: 39208.62, C3: 46617.85, C4: 54007.49,
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
  return result as number;
}

const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 1686 — 2026.1 minimum salaries", () => {
  it("is in force from 1 May 2026 and cites the avenant and its extension order", () => {
    assert.equal(version.validFrom, "2026-05-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 63 du 12 février 2026")));
    assert.ok(version.sources.some((source) => source.includes("arrêté du 5 mai 2026")));
    assert.ok(version.sources.some((source) => source.includes("TRST2610665A")));
  });

  it("has 16 positions: 12 monthly and 4 annual", () => {
    assert.equal(Object.keys(MONTHLY).length, 12);
    assert.equal(Object.keys(ANNUAL).length, 4);
  });

  for (const [level, expected] of Object.entries(MONTHLY)) {
    it(`${level}: ${expected} € a month`, () => {
      setSituation(level);
      assert.ok(Math.abs(minimum() - expected) < 1e-9);
      assert.equal(outOfGrid(), false);
    });
  }

  for (const [level, expected] of Object.entries(ANNUAL)) {
    it(`${level}: ${expected} € a year, one twelfth a month`, () => {
      setSituation(level);
      assert.ok(Math.abs(minimum() - expected / 12) < 1e-9);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setSituation("III.2", "50%");
    assert.ok(Math.abs(minimum() - 2060.98 / 2) < 1e-9);
    setSituation("C2", "80%");
    assert.ok(Math.abs(minimum() - (39208.62 / 12) * 0.8) < 1e-9);
  });

  it("rejects levels, steps and positions outside the grid", () => {
    for (const level of ["I", "I.0", "I.4", "V.1", "IV.4", "C0", "C5", "c1", "1.1", "non renseigné"]) {
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
    setSituation("III.2");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, null);
  });
});
