import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "1909-organismes-tourisme";
const value = "organismes de tourisme";
const ns = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[id]?.find((entry: { version: string }) => entry.version === "2026.1");
assert.ok(version, "IDCC 1909 must be exported");
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const grid = {
  "1.1/1.2": 1900.65,
  "1.3": 1964.01,
  "2.1": 2090.72,
  "2.2": 2192.08,
  "2.3": 2331.46,
  "2.4": 2748.34,
  "3.1": 3077.79,
  "3.2": 3584.63,
  "3.3": 4281.53,
} as const;
function set(level: string, date = "11/10/2026", quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${ns} . niveau`]: `'${level}'`,
    [`${ns} . date de calcul`]: date,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}
const minimum = () => engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue;

describe("IDCC 1909 — 2026.1 salary minima", () => {
  it("is effective on 1 January 2026 and cites the extended agreement", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source: string) => source.includes("Accord n° 48 du 26 janvier 2026")));
    assert.ok(version.sources.some((source: string) => source.includes("JORFTEXT000053907720")));
  });
  for (const [level, amount] of Object.entries(grid)) {
    it(`returns ${amount} euros for level ${level}`, () => {
      set(level);
      assert.equal(minimum(), amount);
    });
  }
  it("uses the January 2026 table before the July point increase", () => {
    set("1.3", "30/06/2026");
    assert.equal(minimum(), 1959.2);
    set("1.3", "01/07/2026");
    assert.equal(minimum(), 1964.01);
  });
  it("prorates the monthly minimum for part-time work", () => {
    set("3.3", "11/10/2026", "50%");
    assert.equal(minimum(), 2140.765);
  });
  it("rejects levels outside the sourced grid and unrelated agreements", () => {
    set("4.1");
    assert.equal(minimum(), null);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, null);
  });
});
