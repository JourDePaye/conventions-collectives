import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2149-activites-dechet";
const value = "activités du déchet";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.2");
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

/** Monthly minimums retained from the latest official point value (18.67 €), by coefficient. */
const MONTHLY: Record<number, number> = {
  100: 1867.00,
  104: 1941.68,
  107: 1997.69,
  110: 2053.70,
  114: 2128.38,
  118: 2203.06,
  125: 2333.75,
  132: 2464.44,
};

const ANNUAL: Record<number, number> = {
  150: 33606,
  167: 37414.68,
  170: 38086.8,
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

describe("IDCC 2149 — 2026.2 minimum salaries", () => {
  it("is in force from 1 January 2026 and cites the official point-value sources", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000039313034")));
  });

  it("has 11 coefficients", () => {
    assert.equal(Object.keys(MONTHLY).length + Object.keys(ANNUAL).length, 11);
  });

  for (const [coefficient, monthly] of Object.entries(MONTHLY)) {
    it(`coefficient ${coefficient}: ${monthly} € a month`, () => {
      setSituation(Number(coefficient));
      assert.equal(minimum(), monthly);
      assert.equal(outOfGrid(), false);
    });
  }

  for (const [coefficient, annual] of Object.entries(ANNUAL)) {
    it(`coefficient ${coefficient}: ${annual} € a year`, () => {
      setSituation(Number(coefficient));
      assert.equal(Math.round((engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue as number) * 100) / 100, annual);
      assert.equal(minimum(), 0);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setSituation(125, "50%");
    assert.equal(minimum(), 1166.88);
    setSituation(150, "80%");
    assert.equal(Math.round((engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue as number) * 100) / 100, 26884.8);
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
