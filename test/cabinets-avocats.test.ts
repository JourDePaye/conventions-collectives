import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1000-cabinets-avocats";
const value = "cabinets d'avocats";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2025.1");
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

const MINIMUMS: Record<number, number> = {
  207: 1851.23,
  215: 1875,
  225: 1900,
  240: 1930,
  250: 2010,
  265: 2130,
  270: 2170,
  285: 2290,
  300: 2390,
  350: 2748.35,
  385: 2994.11,
  410: 3188.53,
  450: 3499.61,
  480: 3732.92,
  510: 3966.23,
  560: 4355.07,
};

function setSituation(coefficient: number | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(coefficient === undefined ? {} : { [`${namespace} . coefficient`]: coefficient }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

const evaluateNumber = (rule: string) => {
  const result = engine.evaluate(`${namespace} . ${rule}`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
};

describe("IDCC 1000 — 2025.1 minimum salaries", () => {
  it("is in force from 1 January 2025 and cites the extended salary amendment", () => {
    assert.equal(version.validFrom, "2025-01-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 136 du 24 janvier 2025")));
    assert.ok(version.sources.some((source) => source.includes("Arrêté du 9 avril 2025")));
  });

  for (const [coefficient, monthly] of Object.entries(MINIMUMS)) {
    it(`coefficient ${coefficient}: ${monthly} €/month`, () => {
      setSituation(Number(coefficient));
      assert.equal(evaluateNumber("salaire minimum conventionnel"), monthly);
      assert.equal(evaluateNumber("salaire minimum annuel conventionnel"), Math.round(monthly * 13 * 100) / 100);
      assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, false);
    });
  }

  it("prorates the monthly and annual minima once for part-time work", () => {
    setSituation(300, "50%");
    assert.equal(evaluateNumber("salaire minimum conventionnel"), 1195);
    assert.equal(evaluateNumber("salaire minimum annuel conventionnel"), 15535);
  });

  it("rejects coefficients outside the grid and a missing coefficient", () => {
    for (const coefficient of [0, 200, 600]) {
      setSituation(coefficient);
      assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
      assert.equal(evaluateNumber("salaire minimum conventionnel"), 0);
      assert.equal(evaluateNumber("salaire minimum annuel conventionnel"), 0);
    }
    setSituation(undefined);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation(300);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    for (const rule of ["salaire minimum conventionnel", "salaire minimum annuel conventionnel", "coefficient hors grille"]) {
      assert.equal(engine.evaluate(`${namespace} . ${rule}`).nodeValue, null, rule);
    }
  });
});
