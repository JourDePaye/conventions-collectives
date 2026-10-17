import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "0478-societes-financieres";
const value = "sociétés financières";
const ns = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[id]?.find((entry: { version: string }) => entry.version === "2026.1");
assert.ok(version, "IDCC 478 must be exported");
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

// Annual amounts of article 1 of the accord of 7 May 2026, hard-coded from the legal text.
const annual: Record<number, number> = {
  230: 22381, 235: 22707, 240: 23033, 245: 23358, 250: 23661, 265: 24637, 280: 25613,
  295: 26589, 310: 27566, 325: 28542, 340: 29518, 350: 30169, 360: 30820, 400: 33423,
  450: 36677, 550: 43186, 625: 48067, 700: 52948, 850: 62710, 900: 65965,
};

function set(coefficient: number, extra: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${ns} . coefficient`]: coefficient,
    ...extra,
  });
}
const annualMinimum = () => engine.evaluate(`${ns} . salaire minimum annuel conventionnel`).nodeValue;
const monthlyMinimum = () => engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue;
const outside = () => engine.evaluate(`${ns} . coefficient hors grille`).nodeValue;

describe("IDCC 478 — 2026.1 minimum guaranteed remuneration", () => {
  it("is effective on 1 June 2026 and cites the official accord", () => {
    assert.equal(version.validFrom, "2026-06-01");
    assert.ok(version.sources.some((source: string) => source.includes("KALITEXT000054825266")));
    assert.ok(version.sources.some((source: string) => source.includes("KALICONT000005635810")));
  });
  for (const [coefficient, amount] of Object.entries(annual)) {
    it(`returns ${amount} euros per year for coefficient ${coefficient}`, () => {
      set(Number(coefficient));
      assert.equal(annualMinimum(), amount);
      assert.equal(outside(), false);
    });
  }
  it("divides the annual minimum by the number of monthly payments", () => {
    set(230);
    assert.equal(monthlyMinimum(), 1865.08);
    set(230, { [`${ns} . nombre de mensualités`]: 13 });
    assert.equal(monthlyMinimum(), 1721.62);
    set(900, { [`${ns} . nombre de mensualités`]: 13 });
    assert.equal(monthlyMinimum(), 5074.23);
  });
  it("prorates the minimum for part-time work", () => {
    set(400, { "salarié . contrat . temps de travail . quotité": "50%" });
    assert.equal(monthlyMinimum(), 1392.63);
  });
  it("flags coefficients outside the grid", () => {
    for (const coefficient of [0, 260, 270, 300, 375, 500, 1000]) {
      set(coefficient);
      assert.equal(outside(), true, String(coefficient));
      assert.equal(annualMinimum(), null, String(coefficient));
    }
  });
  it("does not apply to other agreements", () => {
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, null);
  });
});
