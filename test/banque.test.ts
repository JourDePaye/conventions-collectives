import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2120-banque";
const value = "banque";
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

/** Annual minimums of the accord of 16 April 2026 by level: from 0, 5, 10, 15 and 20 years. */
const STEPS = [0, 5, 10, 15, 20];
const ANNUAL: Record<string, number[]> = {
  A: [23387, 23387, 23387, 23387, 23387],
  B: [23387, 23387, 23387, 23387, 23649],
  C: [23387, 23387, 23387, 23456, 24100],
  D: [23387, 23768, 24424, 25090, 25788],
  E: [24240, 24800, 25487, 26196, 26928],
  F: [26272, 26874, 27626, 28401, 29216],
  G: [28929, 29624, 30478, 31364, 32270],
  H: [31801, 32560, 33532, 34518, 35541],
  I: [38734, 39690, 40868, 42088, 43352],
  J: [46764, 47923, 49363, 50852, 52378],
  K: [55641, 57038, 58739, 60508, 62323],
};

const roundToCents = (amount: number) => Math.round((amount + 1e-9) * 100) / 100;

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
  return roundToCents(result as number);
};

const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 2120 — 2026.1 minimum salaries", () => {
  it("is in force from 1 April 2026 and cites the accord", () => {
    assert.equal(version.validFrom, "2026-04-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 16 avril 2026")));
  });

  it("has 11 levels with 5 seniority steps", () => {
    assert.deepEqual(Object.keys(ANNUAL), ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"]);
    for (const values of Object.values(ANNUAL)) assert.equal(values.length, 5);
  });

  for (const [level, values] of Object.entries(ANNUAL)) {
    it(`level ${level}: every seniority step, in thirteenths`, () => {
      STEPS.forEach((years, index) => {
        setSituation(level, years);
        assert.equal(amount(), roundToCents(values[index]! / 13), `${level} from ${years} years`);
        if (index > 0) {
          setSituation(level, years - 0.01);
          assert.equal(amount(), roundToCents(values[index - 1]! / 13), `${level} just before ${years} years`);
        }
      });
      assert.equal(outOfGrid(), false);
    });
  }

  it("gives the monthly amounts quoted in the README", () => {
    for (const [level, years, monthly] of [["E", 0, 1864.62], ["A", 0, 1799], ["K", 20, 4794.08]] as const) {
      setSituation(level, years);
      assert.equal(amount(), monthly, `${level} ${years}`);
    }
  });

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("E", 0, "50%");
    assert.equal(amount(), 932.31);
    setSituation("H", 6, "80%");
    assert.equal(amount(), roundToCents((32560 / 13) * 0.8));
  });

  it("rejects levels outside the grid", () => {
    for (const level of ["L", "AA", "a", "1", "H1", "non renseigné"]) {
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
    setSituation("E");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "niveau hors grille"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
