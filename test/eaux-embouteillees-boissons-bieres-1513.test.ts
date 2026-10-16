import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1513-eaux-embouteillees-boissons-bieres";
const value = "eaux embouteillées boissons sans alcool et bière";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

// Avenant n° 46 du 3 février 2026, article 1er (Légifrance KALITEXT000054091953), 35 h, from 1 Feb 2026.
const GRID: Record<string, number> = {
  "1-1": 1839.80, "1-2": 1848.39, "1-3": 1901.31,
  "2-1": 1952.39, "2-2": 2003.91, "2-3": 2055.35,
  "3-1": 2124.22, "3-2": 2174.82, "3-3": 2227.84,
  "4-1": 2366.10, "4-2": 2435.18,
  "4-10": 2366.10, "4-20": 2435.18,
  "5-10": 2607.79, "5-20": 2676.92, "5-30": 2746.04,
  "6-10": 2918.55, "6-20": 3056.73, "6-30": 3264.75,
  "6-2": 3056.73, "6-3": 3264.75,
  "7-1": 3505.55, "7-2": 3747.26, "7-3": 3988.95,
  "8-1": 4299.70, "8-2": 4610.49, "8-3": 5180.31,
};

function setSituation(classification: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(classification === undefined ? {} : { [`${namespace} . classification`]: `'${classification}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}
function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 1513 — 2026.1 minimum salaries", () => {
  it("is effective from 1 February 2026 and cites the extended avenant n° 46", () => {
    assert.equal(version.validFrom, "2026-02-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 46 du 3 février 2026")));
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000054091953")));
    assert.ok(version.sources.some((source) => source.includes("JORF du 17 avril 2026")));
  });
  for (const [key, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for ${key}`, () => {
      setSituation(key);
      assert.equal(minimum(), expected);
      assert.equal(engine.evaluate(`${namespace} . classification hors grille`).nodeValue, false);
    });
  }
  it("covers the 27 positions of the grid", () => {
    assert.equal(Object.keys(GRID).length, 27);
  });
  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("5-20", "50%");
    assert.equal(minimum(), 1338.46);
    setSituation("7-1", "80%");
    assert.equal(minimum(), 2804.44);
  });
  it("rejects classifications outside the grid", () => {
    for (const key of ["0-1", "1-4", "4-3", "5-1", "9-1", "1.1", "non renseigné"]) {
      setSituation(key);
      assert.equal(engine.evaluate(`${namespace} . classification hors grille`).nodeValue, true, key);
      assert.equal(minimum(), 0, key);
    }
    setSituation(undefined);
    assert.equal(engine.evaluate(`${namespace} . classification hors grille`).nodeValue, true);
  });
  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("1-1");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
