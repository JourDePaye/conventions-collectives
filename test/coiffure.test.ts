import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2596-coiffure";
const value = "coiffure";
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

/** Monthly minimums of the avenant n° 51 (151.67 hours), by code FILIERE-LEVEL or COEFFICIENT. */
const MONTHLY: Record<string, number> = {
  "T1.1": 1843,
  "T1.2": 1843,
  "T1.3": 1845,
  "T2.1": 1869,
  "T2.2": 1944,
  "T2.3": 2055,
  "T3.1": 2183,
  "T3.2": 2623,
  "T3.2R": 3122,
  "T3.3": 3271,
  "T3.3R": 3367,
  "EC105": 1843,
  "EC115": 1843,
  "EC125": 1845,
  "EC135": 1855,
  "EC145": 1871,
  "EC155": 1944,
  "EC165": 2055,
  "NT100": 1843,
  "NT110": 1843,
  "NT120": 1845,
  "NT130": 1855,
  "A230": 1919,
  "A240": 1919,
  "A250": 1952,
  "A285": 2220,
  "A295": 2251,
  "A305": 2363,
  "A330": 2477,
  "A330P": 2806,
};

function setSituation(level: string | undefined, quota?: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    ...(quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": quota }),
  });
}

const amount = () => {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
};

const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 2596 — 2026.1 minimum salaries", () => {
  it("is in force from 1 March 2026 and cites the avenant and its extension order", () => {
    assert.equal(version.validFrom, "2026-03-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 51 du 3 décembre 2025")));
    assert.ok(version.sources.some((source) => source.includes("arrêté du 17 février 2026")));
  });

  it("has 30 classifications", () => {
    assert.equal(Object.keys(MONTHLY).length, 30);
  });

  for (const [level, monthly] of Object.entries(MONTHLY)) {
    it(`${level}: ${monthly} € a month`, () => {
      setSituation(level);
      assert.equal(amount(), monthly);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("T2.1", "50%");
    assert.equal(amount(), 934.5);
    setSituation("A250", "80%");
    assert.equal(amount(), 1561.6);
  });

  it("rejects classifications outside the grid", () => {
    for (const level of ["T0.1", "T4.1", "T1.4", "T3.1R", "EC100", "NT140", "A200", "A331", "t1.1", "1", "non renseigné"]) {
      setSituation(level);
      assert.equal(outOfGrid(), true, level);
      assert.equal(amount(), 0, level);
    }
  });

  it("reports a missing classification as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(amount(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("T2.1");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "niveau hors grille"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
