import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1517-commerce-detail-non-alimentaire";
const value = "commerce de détail non alimentaire";
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

/** Monthly minimum salaries for 151.67 hours, avenant n° 15 of 6 February 2026. */
const GRID: Record<string, number> = {
  "1": 1829, "2": 1838, "3": 1843, "4": 1867, "5": 1967,
  "6": 2146, "7": 2741, "8": 3583, "9": 4034,
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

describe("IDCC 1517 — 2026.1 minimum salaries", () => {
  it("is in force from 1 June 2026 and cites the avenant and its extension order", () => {
    assert.equal(version.validFrom, "2026-06-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 15 du 6 février 2026")));
    assert.ok(version.sources.some((source) => source.includes("arrêté du 4 mai 2026")));
    assert.ok(version.sources.some((source) => source.includes("TRST2610662A")));
  });

  it("has 9 levels", () => {
    assert.equal(Object.keys(GRID).length, 9);
  });

  for (const [level, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for level ${level}`, () => {
      setSituation(level);
      assert.equal(minimum(), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setSituation("5", "50%");
    assert.equal(minimum(), 983.5);
    setSituation("7", "80%");
    assert.equal(minimum(), 2192.8);
  });

  it("rejects levels outside the grid", () => {
    for (const level of ["0", "10", "A", "1.1", "I", "non renseigné"]) {
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
    setSituation("5");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, null);
  });
});
