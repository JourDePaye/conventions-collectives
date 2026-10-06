import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1539-bureau-numerique";
const value = "bureau et numérique";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2025.1");
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

/** Monthly minimums of the accord of 2 April 2025 (151.67 hours), A1 with less than a year. */
const MONTHLY: Record<string, number> = {
  A1: 1835, A2: 1855, A3: 1875, A4: 1905, A5: 1970,
  B1: 2075, B2: 2185, B3: 2385,
  C1: 2530, C2: 3280, C3: 4020, C4: 4720,
};

/** Completed years of seniority, as modele-social counts them (`salarié . ancienneté`). */
function setSituation(level: string | undefined, years = 0, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    "salarié . ancienneté": `${years} an`,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

const amount = () => {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
};

const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 1539 — 2025.1 minimum salaries", () => {
  it("is in force from 1 September 2025 and cites the accord and its extension order", () => {
    assert.equal(version.validFrom, "2025-09-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 2 avril 2025")));
    assert.ok(version.sources.some((source) => source.includes("31 juillet 2025")));
  });

  for (const [level, monthly] of Object.entries(MONTHLY)) {
    it(`${level}: ${monthly} € a month`, () => {
      setSituation(level, 0);
      assert.equal(amount(), monthly);
      assert.equal(outOfGrid(), false);
    });
  }

  it("keeps the other levels unchanged with seniority", () => {
    for (const [level, monthly] of Object.entries(MONTHLY)) {
      if (level === "A1") continue;
      setSituation(level, 15);
      assert.equal(amount(), monthly, level);
    }
  });

  it("gives A1 the A2 minimum from one year of seniority", () => {
    setSituation("A1", 0);
    assert.equal(amount(), 1835);
    setSituation("A1", 1);
    assert.equal(amount(), 1855);
    setSituation("A1", 10);
    assert.equal(amount(), 1855);
  });

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("A3", 0, "50%");
    assert.equal(amount(), 937.5);
    setSituation("A1", 2, "80%");
    assert.equal(amount(), 1484);
  });

  it("rejects levels outside the grid", () => {
    for (const level of ["A0", "A6", "B0", "B4", "C0", "C5", "a1", "1", "140", "non renseigné"]) {
      setSituation(level);
      assert.equal(outOfGrid(), true, level);
      assert.equal(amount(), 0, level);
    }
  });

  it("reports a missing level as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(amount(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("A3");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "niveau hors grille"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
