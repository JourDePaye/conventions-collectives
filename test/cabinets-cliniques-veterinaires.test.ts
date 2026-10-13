import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1875-cabinets-cliniques-veterinaires";
const value = "cabinets et cliniques vétérinaires";
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

const MONTHLY: Record<number, number> = {
  105: 1885.8,
  108: 1939.68,
  110: 1975.6,
  113: 2029.48,
  120: 2155.2,
};

function setSituation(coefficient: number | undefined, quota?: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(coefficient === undefined ? {} : { [`${namespace} . coefficient`]: coefficient }),
    ...(quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": quota }),
  });
}

function amount() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

function outOfGrid() {
  return engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue;
}

describe("IDCC 1875 — 2026.1 minimum salaries", () => {
  it("is effective on 1 January 2026 and cites the 2026 point agreement", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 91 du 6 janvier 2026")));
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000054066637")));
  });

  for (const [coefficient, monthly] of Object.entries(MONTHLY)) {
    it(`coefficient ${coefficient}: ${monthly} € a month`, () => {
      setSituation(Number(coefficient));
      assert.equal(amount(), monthly);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation(120, "50%");
    assert.equal(amount(), 1077.6);
    setSituation(108, "80%");
    assert.equal(amount(), 1551.74);
  });

  it("rejects coefficients outside the modeled grid", () => {
    for (const coefficient of [1, 104, 106, 109, 111, 112, 114, 119, 121, 200]) {
      setSituation(coefficient);
      assert.equal(outOfGrid(), true, String(coefficient));
      assert.equal(amount(), 0, String(coefficient));
    }
  });

  it("reports a missing coefficient as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(amount(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation(110);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, null);
  });
});
