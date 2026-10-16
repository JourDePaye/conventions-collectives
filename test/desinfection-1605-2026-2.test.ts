import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

// Annexe 1 of the accord of 17 December 2025 (KALITEXT000054040312), column « NAO janvier 2026 »
// and the seniority bonus table in euros per month, read on Légifrance.
const agreement = "1605-desinfection-desinsectisation-deratisation";
const value = "désinfection désinsectisation dératisation";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === "2026.2");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const MINIMUMS: Record<number, number> = {
  1: 1837.13, 2: 1892.13, 3: 1947.13, 4: 2002.13,
  5: 2112.13, 6: 2255.26, 7: 2517.53, 8: 2690.8,
  9: 2911.45, 10: 3729.93, 11: 5337.11, 12: 6119.03,
};

// Seniority bonus by level: 2 years, 3-6, 6-9, 9-12, 12-15, 15-20, more than 20 years.
const BONUS: Record<number, number[]> = {
  2: [37.84, 56.76, 113.53, 170.29, 227.06, 283.82, 340.58],
  3: [38.94, 58.41, 116.83, 175.24, 233.66, 292.07, 350.48],
  4: [40.04, 60.06, 120.13, 180.19, 240.26, 300.32, 360.38],
  5: [42.24, 63.36, 126.73, 190.09, 253.46, 316.82, 380.18],
  6: [45.11, 67.66, 135.32, 202.97, 270.63, 338.29, 405.95],
  7: [50.35, 75.53, 151.05, 226.58, 302.1, 377.63, 453.15],
  8: [53.82, 80.72, 161.45, 242.17, 322.9, 403.62, 484.34],
};
// A representative seniority (in years) inside each band.
const YEARS = [2, 4, 7, 10, 13, 17, 25];

function situation(level: number, extra: Record<string, unknown> = {}) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: level,
    ...extra,
  } as Record<string, string | number>);
}
const evaluate = (name: string) => engine.evaluate(`${namespace} . ${name}`).nodeValue;
const round2 = (n: unknown) => Math.round((n as number) * 100) / 100;

describe("IDCC 1605 revision 2026.2 (accord of 17 December 2025, levels 1 to 12)", () => {
  it("keeps the extension publication date of 2026.1", () => {
    assert.equal(version.validFrom, "2026-03-18");
    assert.ok(version.sources.some((source: string) => source.includes("KALITEXT000054040312")));
  });

  for (const [level, expected] of Object.entries(MINIMUMS)) {
    it(`level ${level} has the sourced monthly minimum`, () => {
      situation(Number(level));
      assert.equal(evaluate("salaire minimum conventionnel"), expected);
      assert.equal(evaluate("niveau hors grille"), false);
    });
  }

  it("flags levels outside 1 to 12", () => {
    for (const level of [0, 13, 99]) {
      situation(level);
      assert.equal(evaluate("niveau hors grille"), true, String(level));
      assert.equal(evaluate("salaire minimum conventionnel"), 0, String(level));
    }
  });

  it("prorates the minimum once for part-time work", () => {
    situation(4, { "salarié . contrat . temps de travail . quotité": "50%" });
    assert.equal(evaluate("salaire minimum conventionnel"), 1001.065);
    situation(10, { "salarié . contrat . temps de travail . quotité": "80%" });
    assert.equal(round2(evaluate("salaire minimum conventionnel")), 2983.94);
  });

  for (const [level, amounts] of Object.entries(BONUS)) {
    it(`level ${level} seniority bonus in each band`, () => {
      amounts.forEach((amount, index) => {
        situation(Number(level), { "salarié . ancienneté": `${YEARS[index]} an` });
        assert.equal(round2(evaluate("prime d'ancienneté")), amount, `${level} / ${YEARS[index]} years`);
      });
    });
  }

  it("has no bonus below two years, at level 1 or for the cadres", () => {
    situation(5, { "salarié . ancienneté": "1 an" });
    assert.equal(evaluate("prime d'ancienneté"), 0);
    situation(1, { "salarié . ancienneté": "10 an" });
    assert.equal(evaluate("prime d'ancienneté"), 0);
    for (const level of [9, 10, 11, 12]) {
      situation(level, { "salarié . ancienneté": "25 an" });
      assert.equal(evaluate("prime d'ancienneté"), 0, String(level));
    }
  });

  it("applies the band at its lower bound and the top band above 20 years", () => {
    situation(2, { "salarié . ancienneté": "3 an" });
    assert.equal(evaluate("prime d'ancienneté"), 56.76);
    situation(2, { "salarié . ancienneté": "20 an" });
    assert.equal(evaluate("prime d'ancienneté"), 283.82);
    situation(2, { "salarié . ancienneté": "21 an" });
    assert.equal(evaluate("prime d'ancienneté"), 340.58);
  });

  it("prorates the bonus for part-time work", () => {
    situation(6, { "salarié . ancienneté": "10 an", "salarié . contrat . temps de travail . quotité": "50%" });
    assert.equal(round2(evaluate("prime d'ancienneté")), 101.49);
  });
});
