import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3013-librairie";
const value = "librairie";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === "2026.3");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

// Accord du 25 novembre 2025, article 3: monthly minimum, full time (151.67 hours).
const GRID: Record<string, number> = {
  "1": 1834, "2": 1848, "3": 1862, "4": 1876, "5": 1952, "6": 2037,
  "7": 2209, "8": 2426, "9": 2635, "10": 3175, "11": 3620, "12": 3965,
};

function evaluate(rule: string, level?: string, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
  return engine.evaluate(`${namespace} . ${rule}`).nodeValue;
}

describe("IDCC 3013 librairie 2026.3 (accord du 25 novembre 2025)", () => {
  it("applies from 1 April 2026 and cites the real text", () => {
    assert.equal(version.validFrom, "2026-04-01");
    assert.ok(version.sources.some((source: string) => source.includes("KALITEXT000054034034")));
  });
  for (const [level, expected] of Object.entries(GRID)) {
    it(`level ${level} pays ${expected}`, () => {
      assert.equal(evaluate("salaire minimum conventionnel", level), expected);
      assert.equal(evaluate("niveau hors grille", level), false);
    });
  }
  it("prorates once for part-time work", () => {
    assert.equal(evaluate("salaire minimum conventionnel", "8", "50%"), 1213);
    assert.equal(evaluate("salaire minimum conventionnel", "1", "80%"), 1467.2);
  });
  it("flags a level outside the grid", () => {
    for (const level of ["0", "13", "99"]) {
      assert.equal(evaluate("salaire minimum conventionnel", level), 0);
      assert.equal(evaluate("niveau hors grille", level), true);
    }
    assert.equal(evaluate("niveau hors grille"), true);
  });
});
