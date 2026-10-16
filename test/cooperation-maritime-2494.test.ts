import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

// Amounts hard-coded from article 2 of the accord of 31 March 2026
// (KALITEXT000054426738), annual gross minima, 35 h, 12 months.
const agreement = "2494-cooperation-maritime";
const value = "coopération maritime";
const namespace = `salarié . convention collective . ${value}`;

const grid: Record<string, number> = {
  "1.1": 21876.36, "1.2": 22327, "2.1": 22527, "2.2": 23965,
  "3.1": 24961, "3.2": 26273, "3.3": 27251, "4": 28174, "5": 32704,
  "6.A": 34358, "6.B": 38275, "7.A": 37220, "7.B": 42101, "8": 46779, "9": 53161,
};

async function engineOf(revision: string) {
  const version = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === revision);
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  return { version, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
}

function minimum(engine: Engine, classification: string, quota = "100%"): number {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau et échelon`]: `'${classification}'`,
    "salarié . contrat . temps de travail . quotité": quota,
  });
  return engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue as number;
}

describe("IDCC 2494 — revision 2026.2 (level 7.A corrected)", async () => {
  const { version, engine } = await engineOf("2026.2");

  it("keeps the validFrom of 2026.1 (same date, higher revision supersedes it)", () => {
    assert.equal(version.validFrom, "2026-07-01");
    const previous = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === "2026.1");
    assert.equal(previous?.validFrom, version.validFrom);
    assert.ok(version.sources.some((source: string) => source.includes("KALITEXT000054426738")));
  });

  for (const [classification, amount] of Object.entries(grid)) {
    it(`level ${classification} = ${amount} €/an`, () => {
      assert.equal(minimum(engine, classification), amount);
    });
  }

  it("level 7.A is 37 220 (and not 36 220 as in 2026.1)", () => {
    assert.equal(minimum(engine, "7.A"), 37220);
  });

  it("prorates part-time work once", () => {
    assert.equal(minimum(engine, "7.A", "80%"), 29776);
  });

  it("flags an out-of-grid classification", () => {
    assert.equal(minimum(engine, "10"), 0);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
  });
});
