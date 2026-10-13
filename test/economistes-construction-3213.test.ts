import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3213-economistes-construction";
const value = "économistes de la construction et métreurs-vérificateurs";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(level: string, region = "hors Île-de-France", quotité = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: `'${level}'`,
    [`${namespace} . zone`]: `'${region}'`,
    "salarié . contrat . temps de travail . quotité": quotité,
  });
}

function minimum() {
  return engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
}

describe("IDCC 3213 — 2026.1 salary minimums and payroll audit", () => {
  it("uses the official extended agreement and effective date", () => {
    assert.equal(version.validFrom, "2026-07-11");
    assert.ok(version.sources.some((source: string) => source.includes("KALITEXT000054872359")));
    assert.ok(version.sources.some((source: string) => source.includes("JORFTEXT000054408938")));
  });

  for (const [level, expected] of Object.entries({ A1: 1883.47, A2: 2036.24, B: 2310.16, C: 2555.25, D: 2902.46, E: 3157.75, F: 3497.02, G: 4005.13, H: 4014.30, I: 4738.91 })) {
    it(`level ${level} evaluates the national minimum`, () => {
      setSituation(level);
      assert.equal(minimum(), expected);
    });
  }

  it("uses the Île-de-France column", () => {
    setSituation("I", "IDF");
    assert.equal(engine.evaluate(`${namespace} . zone`).nodeValue, "IDF");
    assert.equal(minimum(), 4999.77);
  });

  it("prorates the minimum once for part-time work", () => {
    setSituation("A1", "national", "50%");
    assert.equal(minimum(), 941.735);
  });

  it("marks an unknown level outside the grid", () => {
    setSituation("J");
    assert.equal(minimum(), 0);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
  });

  it("is isolated from another convention", () => {
    setSituation("A1");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });

  it("does not redefine payroll-wide endpoints or collide with modele-social", () => {
    assert.equal(Object.keys(extension).some((name) => name.includes("cotisations") || name.includes("prévoyance") || name.includes("santé") || name.includes("formation professionnelle") || name.includes("exonération cotisation AT")), false);
    assert.equal(Object.keys(extension).some((name) => name in modeleSocial), false);
    engine.setSituation({ "salarié . convention collective": `'${value}'`, "salarié . cotisations . assiette": "3000 €/mois" });
    assert.equal(typeof engine.evaluate("salarié . cotisations . prévoyances . santé . employeur").nodeValue, "number");
  });
});
