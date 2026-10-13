import assert from "node:assert/strict";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { describe, it } from "node:test";
import { COMPILED_VERSIONS } from "../src/index.ts";

const model = "1267-patisserie";
const value = "pâtisserie";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[model]?.find((entry) => entry.version === "2026.1");
assert.ok(version, "IDCC 1267 version 2026.1 must be compiled");
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = {
  ...choice,
  "une possibilité": [...new Set([...choice["une possibilité"], value])],
} as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const MONTHLY: Record<string, number> = {
  I: 1830,
  II: 1834,
  III: 1844,
  IV: 1863,
  V: 1915,
  VI: 1989,
  VII: 2071,
  VIII: 2186,
  IX: 2461,
};

function setSituation(level: string | undefined, quota?: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    ...(quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": quota }),
  });
}

function amount() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 1267 — 2026.1 pâtisserie", () => {
  it("is effective from 1 January 2026 and cites the extended salary amendment", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 98 du 12 novembre 2025")));
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000053970120")));
    assert.ok(version.sources.some((source) => source.includes("JORFTEXT000053593452")));
  });

  for (const [level, monthly] of Object.entries(MONTHLY)) {
    it(`${level}: ${monthly} € per month`, () => {
      setSituation(level);
      assert.equal(amount(), monthly);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, false);
    });
  }

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("VII", "60%");
    assert.equal(amount(), 1242.6);
  });

  it("rejects levels outside the 2026 grid and reports missing input", () => {
    for (const level of ["0", "X", "10"]) {
      setSituation(level);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true, level);
      assert.equal(amount(), 0, level);
    }
    setSituation(undefined);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
    assert.equal(amount(), 0);
  });

  it("is inapplicable outside the agreement", () => {
    setSituation("I");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, null);
  });
});
