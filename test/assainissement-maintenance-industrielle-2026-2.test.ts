import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2272-assainissement-maintenance-industrielle";
const value = "assainissement et maintenance industrielle";
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

const GRID: Record<number, number> = {
  170: 1863,
  185: 1913.63,
  200: 1978.92,
  215: 2048.4,
  230: 2117.89,
  245: 2187.37,
  260: 2256.85,
  280: 2349.5,
  320: 2534.78,
  430: 3044.32,
  500: 3368.58,
  580: 3739.15,
  760: 4572.99,
  1120: 6240.53,
  1470: 7861.8,
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

describe("IDCC 2272 — 2026.2 minimum salaries", () => {
  it("is in force from 1 April 2026 and cites the extended amendment", () => {
    assert.equal(version.validFrom, "2026-04-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 45 du 20 février 2026")));
    assert.ok(version.sources.some((source) => source.includes("Arrêté du 5 mai 2026")));
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000054303965")));
  });

  for (const [coefficient, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for coefficient ${coefficient}`, () => {
      setSituation(Number(coefficient));
      assert.equal(minimum(), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setSituation(430, "50%");
    assert.equal(minimum(), 1522.16);
    setSituation(1470, "80%");
    assert.equal(minimum(), 6289.44);
  });

  it("rejects coefficients outside the grid and reports a missing coefficient", () => {
    for (const coefficient of [0, 171, 300, 1480]) {
      setSituation(coefficient);
      assert.equal(outOfGrid(), true, String(coefficient));
      assert.equal(minimum(), 0, String(coefficient));
    }
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(minimum(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation(430);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, null);
  });
});
