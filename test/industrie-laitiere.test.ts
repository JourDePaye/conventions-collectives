import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0112-industrie-laitiere";
const value = "industrie laitière";
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

/** Monthly minimum salaries for full-time work, annex I of avenant n° 57 of 22 January 2026. */
const GRID: Record<string, number> = {
  "1.1": 1833.26, "1.2": 1843.58,
  "2.1": 1853.90, "2.2": 1864.23, "2.3": 1874.55,
  "3.1": 1874.55, "3.2": 1884.87, "3.3": 1895.19,
  "4.1": 1895.19, "4.2": 1905.52, "4.3": 1916.87,
  "5.1": 1916.87, "5.2": 1930.29, "5.3": 1943.71,
  "6.1": 1943.71, "6.2": 2036.61, "6.3": 2129.60,
  "7.1": 2129.60, "7.2": 2235.92, "7.3": 2342.25,
  "8.1": 2342.25, "8.2": 2461.32, "8.3": 2628.25,
  "9.1": 2628.25, "9.2": 2925.95,
  "10": 3574.50, "11": 4309.18, "12": 4931.15,
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

describe("IDCC 0112 — 2026.1 minimum salaries", () => {
  it("is in force from 1 February 2026 and cites the avenant and its extension order", () => {
    assert.equal(version.validFrom, "2026-02-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 57 du 22 janvier 2026")));
    assert.ok(version.sources.some((source) => source.includes("arrêté du 4 mai 2026")));
  });

  it("has 28 positions: 14 workers and employees, 9 supervisors and 5 executives", () => {
    assert.equal(Object.keys(GRID).length, 28);
  });

  for (const [level, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for ${level}`, () => {
      setSituation(level);
      assert.equal(minimum(), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setSituation("7.2", "50%");
    assert.equal(minimum(), 1117.96);
    setSituation("9.1", "80%");
    assert.equal(minimum(), 2102.6);
  });

  it("rejects levels outside the grid", () => {
    for (const level of ["1", "1.3", "5.4", "8.4", "9", "9.3", "10.1", "13", "non renseigné"]) {
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
    setSituation("7.2");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, null);
  });
});
