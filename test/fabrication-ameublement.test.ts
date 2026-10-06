import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1411-fabrication-ameublement";
const value = "fabrication ameublement";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = {
  ...choice,
  "une possibilité": [...choice["une possibilité"], value],
} as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

/** Monthly minimums of the accord of 28 May 2026 (151.67 hours). */
const MONTHLY: Record<string, number> = {
  AP11: 1867.02,
  AP21: 1869,
  AP22: 1872,
  AP31: 1874,
  AP32: 1882,
  AP41: 1899,
  AP42: 1919,
  AP43: 1972,
  AP51: 2039,
  AP52: 2117,
  AF1: 1867.02,
  AF3: 1871,
  AF5: 1876,
  AF7: 1879,
  AF9: 1899,
  AF11: 1929,
  AF12: 1945,
  AF14: 2045,
  AF15: 2081,
  AF16: 2149,
  AE1: 1867.02,
  AE2: 1877,
  AE3: 1927,
  AE4: 1957,
  AE5: 2065,
  AE6: 2202,
  AE7: 2640,
  C11: 2489,
  C12: 2723,
  C13: 2870,
  C21: 3298,
  C22: 3516,
  C23: 3806,
  C31: 4236,
  C32: 4516,
  C33: 4956,
};

function setSituation(level: string | undefined, quota?: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    ...(quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": quota }),
  });
}

const amount = () => {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
};

const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 1411 — 2026.1 minimum salaries", () => {
  it("is in force from 1 July 2026 and cites the accord and its extension order", () => {
    assert.equal(version.validFrom, "2026-07-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 28 mai 2026")));
    assert.ok(version.sources.some((source) => source.includes("TRST2621200A")));
  });

  it("has 36 positions", () => {
    assert.equal(Object.keys(MONTHLY).length, 36);
  });

  for (const [level, monthly] of Object.entries(MONTHLY)) {
    it(`${level}: ${monthly} € a month`, () => {
      setSituation(level);
      assert.equal(amount(), monthly);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("AP52", "50%");
    assert.equal(amount(), 1058.5);
    setSituation("C21", "80%");
    assert.equal(amount(), 2638.4);
  });

  it("rejects positions outside the grid", () => {
    for (const level of ["AP12", "AP53", "AF2", "AF17", "AE0", "AE8", "C10", "C34", "ap11", "AP 11", "1", "non renseigné"]) {
      setSituation(level);
      assert.equal(outOfGrid(), true, level);
      assert.equal(amount(), 0, level);
    }
  });

  it("reports a missing position as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(amount(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("AP52");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "niveau hors grille"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
