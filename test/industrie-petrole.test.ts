import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1388-industrie-petrole";
const value = "industrie pétrole";
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

/** Monthly minimums published for the accord of 27 November 2025, by coefficient. */
const PUBLISHED: Record<number, number> = {
  150: 1887.03, 200: 2213.92, 215: 2311.98, 310: 3235.69, 400: 4110.78, 550: 5569.26, 880: 8777.91,
};

function setSituation(coefficient: number | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(coefficient === undefined ? {} : { [`${namespace} . coefficient`]: coefficient }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

const outOfGrid = () => engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue;

describe("IDCC 1388 — 2026.1 minimum salaries", () => {
  it("is in force from 1 January 2026 and cites the accord and its extension order", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 27 novembre 2025")));
    assert.ok(version.sources.some((source) => source.includes("arrêté du 27 janvier 2026")));
  });

  for (const [coefficient, expected] of Object.entries(PUBLISHED)) {
    it(`gives ${expected} € a month for coefficient ${coefficient}`, () => {
      setSituation(Number(coefficient));
      assert.equal(minimum(), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  it("applies the over-adjustment below coefficient 215 only", () => {
    // 214: 214 × 9.9749 + 666 × 0.2517 + 1 × 3.1855 = 2134.6 + 167.63 + 3.19 (rounded to the cent).
    setSituation(214);
    assert.equal(minimum(), 2305.45);
    // 130: 1296.737 + 750 × 0.2517 + 85 × 3.1855 = 1296.74 + 188.78 + 270.77 (rounded).
    setSituation(130);
    assert.equal(minimum(), 1756.28);
  });

  it("prorates the minimum once for part-time work", () => {
    setSituation(200, "50%");
    assert.equal(minimum(), 1106.96);
    setSituation(400, "80%");
    assert.equal(minimum(), 3288.62);
  });

  it("rejects coefficients outside 130 to 880", () => {
    for (const coefficient of [0, 100, 129, 881, 1000]) {
      setSituation(coefficient);
      assert.equal(outOfGrid(), true, `${coefficient}`);
      assert.equal(minimum(), 0, `${coefficient}`);
    }
  });

  it("reports a missing coefficient as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(minimum(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation(200);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, null);
  });
});
