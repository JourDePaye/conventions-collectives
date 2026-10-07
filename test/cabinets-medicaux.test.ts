import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1147-cabinets-medicaux";
const value = "cabinets médicaux";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2024.1");
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

/** Monthly minimums of the avenant n° 90 of 14 December 2023 (151.67 hours), by position. */
const MONTHLY: Record<string, number> = {
  "4": 1782.14,
  "5": 1815.79,
  "6": 1889.38,
  "7": 1966.21,
  "8": 2050.62,
  "9": 2159.91,
  "10": 2275.69,
  "11": 2397.97,
  "12": 2535.4,
  "13": 2685.81,
  "14": 3232.29,
  "15": 3848.01,
  "16": 4530.83,
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

describe("IDCC 1147 — 2024.1 minimum salaries", () => {
  it("is in force from 1 January 2024 and cites the avenant and its extension order", () => {
    assert.equal(version.validFrom, "2024-01-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 90 du 14 décembre 2023")));
    assert.ok(version.sources.some((source) => source.includes("TSST2406494A")));
  });

  it("has 13 positions", () => {
    assert.equal(Object.keys(MONTHLY).length, 13);
  });

  for (const [level, monthly] of Object.entries(MONTHLY)) {
    it(`position ${level}: ${monthly} € a month`, () => {
      setSituation(level);
      assert.equal(amount(), monthly);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("8", "50%");
    assert.equal(amount(), 1025.31);
    setSituation("12", "80%");
    assert.equal(amount(), 2028.32);
  });

  it("rejects positions outside the grid", () => {
    for (const level of ["0", "1", "3", "17", "04", "4.1", "A", "non renseigné"]) {
      setSituation(level);
      assert.equal(outOfGrid(), true, level);
      assert.equal(amount(), 0, level);
    }
  });

  it("reports a missing position as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(amount(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("8");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "niveau hors grille"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
