import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1513-papeterie-librairie";
const value = "papeterie fournitures bureau bureautique informatique librairie";
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

/** Monthly minimum salaries for 151.67 hours, avenant n° 4 of 24 March 2026. */
const GRID: Record<string, number> = {
  "1": 1823, "2": 1823, "3": 1823, "4": 1823, "5": 1823,
  "6": 1830, "7": 1830, "8": 1830, "9": 1830, "10": 1830,
};

function setSituation(coefficient: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(coefficient === undefined ? {} : { [`${namespace} . coefficient`]: `'${coefficient}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

const outOfGrid = () => engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue;

describe("IDCC 1513 — 2026.1 minimum salaries", () => {
  it("is in force from 1 August 2026 and cites the salary amendment and extension order", () => {
    assert.equal(version.validFrom, "2026-08-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 4 du 24 mars 2026")));
    assert.ok(version.sources.some((source) => source.includes("arrêté du 30 juin 2026")));
    assert.ok(version.sources.some((source) => source.includes("TRST2617482A")));
  });

  it("has ten coefficient positions", () => {
    assert.equal(Object.keys(GRID).length, 10);
  });

  for (const [coefficient, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for coefficient ${coefficient}`, () => {
      setSituation(coefficient);
      assert.equal(minimum(), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setSituation("6", "50%");
    assert.equal(minimum(), 915);
    setSituation("10", "80%");
    assert.equal(minimum(), 1464);
  });

  it("rejects coefficients outside the grid", () => {
    for (const coefficient of ["0", "11", "A", "1.1", "non renseigné"]) {
      setSituation(coefficient);
      assert.equal(outOfGrid(), true, coefficient);
      assert.equal(minimum(), 0, coefficient);
    }
  });

  it("reports a missing coefficient as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(minimum(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("6");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, null);
  });
});
