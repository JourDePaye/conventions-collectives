import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1672-societes-assurances";
const value = "sociétés assurances";
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

/** Annual minimum remunerations of the protocol of 10 June 2026, by class. */
const ANNUAL: Record<string, number> = {
  "1": 22230,
  "2": 23640,
  "3": 25070,
  "4": 29720,
  "5": 35140,
  "6": 44670,
  "7": 60690,
};

const roundToCents = (amount: number) => Math.round((amount + 1e-9) * 100) / 100;

function setSituation(level: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

const amount = () => {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return roundToCents(result as number);
};

const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 1672 — 2026.1 minimum remunerations", () => {
  it("is in force from 1 January 2026 and cites the protocol", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source) => source.includes("Protocole d'accord du 10 juin 2026")));
  });

  it("is consistent with the announced revaluations of the previous grid", () => {
    assert.equal(roundToCents(21900 * 1.015), 22228.5);
    assert.ok(Math.abs(ANNUAL["1"]! - 21900 * 1.015) < 2);
    assert.ok(Math.abs(ANNUAL["7"]! - 60450 * 1.004) < 2);
  });

  for (const [level, annual] of Object.entries(ANNUAL)) {
    it(`class ${level}: ${annual} € a year, a thirteenth a month`, () => {
      setSituation(level);
      assert.equal(amount(), roundToCents(annual / 13));
      assert.equal(outOfGrid(), false);
    });
  }

  it("gives the monthly amounts quoted in the README", () => {
    for (const [level, monthly] of [["1", 1710], ["3", 1928.46], ["7", 4668.46]] as const) {
      setSituation(level);
      assert.equal(amount(), monthly, level);
    }
  });

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("3", "50%");
    assert.equal(amount(), roundToCents(25070 / 13 / 2));
    setSituation("5", "80%");
    assert.equal(amount(), roundToCents((35140 / 13) * 0.8));
  });

  it("rejects classes outside the grid", () => {
    for (const level of ["0", "8", "10", "A", "1.5", "non renseigné"]) {
      setSituation(level);
      assert.equal(outOfGrid(), true, level);
      assert.equal(amount(), 0, level);
    }
  });

  it("reports a missing class as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(amount(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("3");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "niveau hors grille"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
