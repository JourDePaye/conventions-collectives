import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3216-negoce-materiaux-construction";
const value = "négoce des matériaux de construction";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2025.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const GRID: Record<number, number> = {
  165: 1827.1, 170: 1834.2, 180: 1848.66, 195: 1907.99, 210: 1967.31, 225: 2026.64,
  245: 2105.74, 250: 2125.51, 270: 2204.61, 290: 2283.71, 310: 2362.81, 330: 2441.91, 350: 2521.01,
};

function setSituation(coefficient: number, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . coefficient`]: coefficient,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}
function minimum() {
  return Math.round((engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue as number) * 100) / 100;
}

describe("IDCC 3216 — minima conventionnels 2025", () => {
  it("uses the extended version and cites the official sources", () => {
    assert.equal(version.validFrom, "2025-04-26");
    assert.ok(version.sources.some((source) => source.includes("Avenant du 21 janvier 2025")));
    assert.ok(version.sources.some((source) => source.includes("JORFTEXT000051521231")));
  });
  for (const [coefficient, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € for coefficient ${coefficient}`, () => {
      setSituation(Number(coefficient));
      assert.equal(minimum(), expected);
      assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, false);
    });
  }
  it("prorates the minimum once for part-time work", () => {
    setSituation(245, "50%");
    assert.equal(minimum(), 1052.87);
  });
  it("rejects coefficients outside the published grid", () => {
    for (const coefficient of [164, 175, 360]) {
      setSituation(coefficient);
      assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
      assert.equal(minimum(), 0);
    }
  });
  it("is inapplicable for another agreement", () => {
    setSituation(245);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
