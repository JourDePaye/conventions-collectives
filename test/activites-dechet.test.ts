import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2149-activites-dechet";
const value = "activités du déchet";
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

/** Monthly minimums published for 1 January 2026 (point of 18.90 €), by coefficient. */
const MONTHLY: Record<number, number> = {
  100: 1890.00,
  104: 1965.60,
  107: 2022.30,
  110: 2079.00,
  114: 2154.60,
  118: 2230.20,
  125: 2362.50,
  132: 2494.80,
  150: 2835.00,
  167: 3156.30,
  170: 3213.00,
};

function setSituation(coefficient: number | undefined, quota?: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(coefficient === undefined ? {} : { [`${namespace} . coefficient`]: coefficient }),
    ...(quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": quota }),
  });
}

const minimum = () => {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
};

const outOfGrid = () => engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue;

describe("IDCC 2149 — 2026.1 minimum salaries", () => {
  it("is in force from 1 January 2026 and cites the point value", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source) => source.includes("18,90 €")));
  });

  it("has 11 coefficients", () => {
    assert.equal(Object.keys(MONTHLY).length, 11);
  });

  for (const [coefficient, monthly] of Object.entries(MONTHLY)) {
    it(`coefficient ${coefficient}: ${monthly} € a month`, () => {
      setSituation(Number(coefficient));
      assert.equal(minimum(), monthly);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setSituation(125, "50%");
    assert.equal(minimum(), 1181.25);
    setSituation(150, "80%");
    assert.equal(minimum(), 2268);
  });

  it("rejects coefficients outside the grid", () => {
    for (const coefficient of [0, 99, 101, 105, 115, 133, 160, 171, 200]) {
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
    setSituation(125);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, null);
  });
});
