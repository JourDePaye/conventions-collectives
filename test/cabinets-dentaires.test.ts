import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1619-cabinets-dentaires";
const value = "cabinets dentaires";
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

/** Minimum hourly rates of the accord of 12 February 2026, by job. */
const HOURLY: Record<string, number> = {
  "entretien": 12.02,
  "reception": 12.02,
  "secretaire-technique": 13.78,
  "aide-dentaire": 12.56,
  "assistant-dentaire": 13.93,
  "prothesiste-1": 12.94,
  "prothesiste-2": 16.34,
  "prothesiste-3": 20.21,
  "prothesiste-4": 22.0,
};

const roundToCents = (amount: number) => Math.round((amount + 1e-9) * 100) / 100;

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
  return roundToCents(result as number);
};

const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 1619 — 2026.1 minimum salaries", () => {
  it("is in force from 1 January 2026 and cites the accord and its extension order", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 12 février 2026")));
    assert.ok(version.sources.some((source) => source.includes("arrêté du 15 juillet 2026")));
  });

  it("has 9 jobs", () => {
    assert.equal(Object.keys(HOURLY).length, 9);
  });

  for (const [level, hourly] of Object.entries(HOURLY)) {
    it(`${level}: ${hourly} € an hour times 151.67 hours`, () => {
      setSituation(level);
      assert.equal(amount(), roundToCents(hourly * 151.67));
      assert.equal(outOfGrid(), false);
    });
  }

  it("gives the monthly amounts of three jobs (hourly rate times 151.67 hours)", () => {
    for (const [level, monthly] of [["entretien", 1823.07], ["assistant-dentaire", 2112.76], ["prothesiste-4", 3336.74]] as const) {
      setSituation(level);
      assert.equal(amount(), monthly, level);
    }
  });

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("secretaire-technique", "80%");
    assert.equal(amount(), roundToCents(2090.0126 * 0.8));
    setSituation("prothesiste-3", "50%");
    assert.equal(amount(), roundToCents(roundToCents(20.21 * 151.67) / 2));
  });

  it("rejects jobs outside the grid", () => {
    for (const level of ["", "prothesiste", "prothesiste-5", "Assistant-dentaire", "A", "non renseigné"]) {
      setSituation(level);
      assert.equal(outOfGrid(), true, level);
      assert.equal(amount(), 0, level);
    }
  });

  it("reports a missing job as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(amount(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("assistant-dentaire");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "niveau hors grille"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
