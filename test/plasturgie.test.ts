import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0292-plasturgie";
const value = "plasturgie";
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

/** Monthly minimum salaries for 35 hours, article 3-1 of the accord of 19 February 2026. */
const GRID: Record<number, number> = {
  700: 1835,
  710: 1848,
  720: 1868,
  730: 1921,
  740: 2004,
  750: 2126,
  800: 2266,
  810: 2424,
  820: 2652,
  830: 2841,
  900: 3366,
  910: 3525,
  920: 4047,
  930: 5253,
  940: 6543,
};

function setSituation(coefficient: number | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(coefficient === undefined ? {} : { [`${namespace} . coefficient`]: coefficient }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

const outOfGrid = () => engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue;

describe("IDCC 292 — 2026.1 minimum salaries", () => {
  it("is in force from 1 March 2026 and cites the accord and its extension order", () => {
    assert.equal(version.validFrom, "2026-03-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 19 février 2026")));
    assert.ok(version.sources.some((source) => source.includes("arrêté du 23 septembre 2026")));
    assert.ok(version.sources.some((source) => source.includes("TRST2612629A")));
  });

  it("has 15 coefficients", () => {
    assert.equal(Object.keys(GRID).length, 15);
  });

  for (const [coefficient, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for coefficient ${coefficient}`, () => {
      setSituation(Number(coefficient));
      assert.equal(minimum(), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setSituation(800, "50%");
    assert.equal(minimum(), 1133);
    setSituation(900, "80%");
    assert.equal(minimum(), 2692.8);
  });

  it("rejects coefficients outside the grid", () => {
    for (const coefficient of [0, 100, 699, 701, 760, 850, 890, 941, 1000]) {
      setSituation(coefficient);
      assert.equal(outOfGrid(), true, `${coefficient}`);
      assert.equal(minimum(), 0, `${coefficient}`);
    }
  });

  it("reports a missing coefficient as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(minimum(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation(800);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, null);
  });
});
