import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3241-telediffusion";
const value = "télédiffusion";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === "2026.1");

assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(niveau: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: `'${niveau}'`,
  });
}

function amount() {
  return engine.evaluate(`${namespace} . salaire minimum journalier`).nodeValue;
}

describe("IDCC 3241 — 2026.1 CDDU salary minimums and payroll audit", () => {
  it("uses the official 1 June 2026 effective date", () => {
    assert.equal(version.validFrom, "2026-06-01");
    assert.ok(version.sources.some((source: string) => source.includes("11 mai 2026")));
  });

  for (const [level, minimum] of Object.entries({
    "1": 119.83,
    "2": 138.68,
    "3": 151.30,
    "4-1": 162.32,
    "4-2": 168.30,
    "5-1": 180.16,
    "5-2": 193.05,
    "5-3": 198,
    "6-1": 205.01,
    "6-2": 212.83,
    "7-1": 223.65,
    "7-2": 284.38,
  })) {
    it(`${level} has the sourced minimum daily wage`, () => {
      setSituation(level);
      assert.equal(amount(), minimum);
    });
  }

  it("marks an unknown classification outside the grid", () => {
    setSituation("8");
    assert.equal(amount(), 0);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
  });

  it("is isolated from another convention", () => {
    setSituation("5-1");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum journalier`).nodeValue, null);
  });

  it("does not redefine payroll-wide endpoints or collide with modele-social", () => {
    assert.equal(Object.keys(extension).some((name) => name.includes("cotisations") || name.includes("prévoyance") || name.includes("santé") || name.includes("formation professionnelle") || name.includes("exonération cotisation AT")), false);
    assert.equal(Object.keys(extension).some((name) => name in modeleSocial), false);
  });
});
