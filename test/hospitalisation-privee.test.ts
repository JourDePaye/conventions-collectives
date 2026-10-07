import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2264-hospitalisation-privee";
const value = "hospitalisation privée";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2023.1");
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

describe("IDCC 2264 — 2023.1 base salary", () => {
  it("is in force from 1 January 2023 and cites the avenant", () => {
    assert.equal(version.validFrom, "2023-01-01");
    assert.ok(version.sources.some((source) => source.includes("22 février 2023")));
  });

  it("multiplies the coefficient by 7.26 € from 243", () => {
    // Hand-computed with decimals: coefficient × 7.26.
    const expected: [number, number][] = [
      [243, 1764.18], [256, 1858.56], [257, 1865.82], [258, 1873.08],
      [300, 2178], [500, 3630], [1000, 7260],
    ];
    for (const [coefficient, amount] of expected) {
      setSituation(coefficient);
      assert.equal(minimum(), amount, `${coefficient}`);
      assert.equal(outOfGrid(), false);
    }
  });

  it("gives no indexed minimum below 243, where fixed amounts under the SMIC apply", () => {
    for (const coefficient of [176, 200, 242]) {
      setSituation(coefficient);
      assert.equal(minimum(), 0, `${coefficient}`);
      assert.equal(outOfGrid(), false, `${coefficient}`);
    }
  });

  it("prorates the minimum once for part-time work", () => {
    setSituation(600, "50%");
    assert.equal(minimum(), 2178);
    setSituation(600, "80%");
    assert.equal(minimum(), 3484.8);
  });

  it("treats a missing coefficient or one below 176 as outside the grid", () => {
    for (const coefficient of [undefined, 0, 100, 175]) {
      setSituation(coefficient);
      assert.equal(outOfGrid(), true);
      assert.equal(minimum(), 0);
    }
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation(300);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, null);
  });
});
