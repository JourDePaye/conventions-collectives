import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "branche ferroviaire";
const namespace = `salarié . convention collective . ${value}`;
const versions = COMPILED_VERSIONS["3217-branche-ferroviaire"];
assert.ok(versions);
const version = versions.find((v) => v.version === "2026.1");
assert.ok(version);
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, await version.loadRules());
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

// Avenant du 17 décembre 2025, article 2: thresholds at 0, 3, 6, ..., 33 years.
const THRESHOLDS = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33];
const GRID: Record<number, number[]> = {
  1: [22641, 22981, 23325, 23675, 24030, 24391, 24757, 25128, 25505, 25887, 26276, 26670],
  2: [23133, 23480, 23832, 24190, 24553, 24921, 25295, 25674, 26059, 26450, 26847, 27249],
  3: [24839, 25212, 25590, 25974, 26363, 26759, 27160, 27567, 27981, 28401, 28827, 29259],
  4: [26566, 26964, 27369, 27779, 28196, 28619, 29048, 29484, 29926, 30375, 30831, 31293],
  5: [28954, 29388, 29829, 30277, 30731, 31192, 31660, 32134, 32616, 33106, 33602, 34106],
  6: [34129, 34641, 35161, 35688, 36223, 36767, 37318, 37878, 38446, 39023, 39608, 40202],
  7: [41095, 41711, 42337, 42972, 43617, 44271, 44935, 45609, 46293, 46988, 47692, 48408],
  8: [51196, 51964, 52743, 53535, 54338, 55153, 55980, 56820, 57672, 58537, 59415, 60306],
  9: [66468, 67465, 68477, 69504, 70547, 71605, 72679, 73769, 74876, 75999, 77139, 78296],
};

function minimum(classe: number, seniority: number, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . classe`]: classe,
    [`${namespace} . ancienneté`]: seniority,
    "salarié . contrat . temps de travail . quotité": quota,
  });
  return engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue;
}

describe("IDCC 3217 branche ferroviaire — 2026.1", () => {
  it("is effective on 1 January 2026 and ordered after 2025.1", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.deepEqual(versions.map((v) => v.version).slice(0, 2), ["2025.1", "2026.1"]);
    assert.ok(version.sources.some((s) => s.includes("KALITEXT000053973515")));
  });
  for (const [classe, amounts] of Object.entries(GRID)) {
    it(`gives the 12 thresholds of class ${classe}`, () => {
      THRESHOLDS.forEach((years, i) => {
        assert.equal(minimum(Number(classe), years), amounts[i], `class ${classe}, ${years} years`);
      });
    });
  }
  it("stays on the lower threshold between two thresholds", () => {
    assert.equal(minimum(1, 2), 22641);
    assert.equal(minimum(9, 32), 77139);
    assert.equal(minimum(9, 40), 78296);
  });
  it("prorates once for part-time work", () => {
    assert.equal(minimum(5, 0, "50%"), 14477);
    assert.equal(minimum(7, 21, "80%"), 36487.2);
  });
  it("rejects classes outside the grid", () => {
    for (const classe of [0, 10]) {
      assert.equal(minimum(classe, 0), 0);
      assert.equal(engine.evaluate(`${namespace} . classe hors grille`).nodeValue, true);
    }
  });
});
