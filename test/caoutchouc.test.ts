import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0045-caoutchouc";
const value = "caoutchouc";
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

const GRID: Record<number, number> = {
  130: 1819.67,
  140: 1833.37,
  150: 1847.07,
  160: 1860.78,
  170: 1874.48,
  180: 1888.18,
  190: 1901.88,
  215: 1936.14,
  225: 1949.84,
  240: 1970.39,
  255: 1990.95,
  270: 2011.5,
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

describe("IDCC 45 — 2025.1 minimum salaries", () => {
  it("is in force from 1 May 2025 and cites the salary agreement and extension", () => {
    assert.equal(version.validFrom, "2025-05-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 29 janvier 2025")));
    assert.ok(version.sources.some((source) => source.includes("arrêté du 9 avril 2025")));
  });

  it("exposes the convention point value", () => {
    setSituation(225);
    assert.equal(engine.evaluate(`${namespace} . point mensuel`).nodeValue, 7.45);
  });

  for (const [coefficient, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for coefficient ${coefficient}`, () => {
      setSituation(Number(coefficient));
      assert.equal(minimum(), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setSituation(225, "50%");
    assert.equal(minimum(), 974.92);
    setSituation(270, "80%");
    assert.equal(minimum(), 1609.2);
  });

  it("rejects coefficients outside the sourced grid", () => {
    for (const coefficient of [0, 100, 135, 200, 220, 256, 280, 1000]) {
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
    setSituation(225);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, null);
  });

  it("does not add convention-specific payroll contributions beyond salary minima", () => {
    const situation = {
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . coefficient`]: 225,
      "salarié . cotisations . assiette": "3000 €/mois",
      "entreprise . salariés . effectif": 5,
      "établissement . taux ATMP": "2%",
    };
    engine.setSituation(situation);
    const baseline = new Engine(modeleSocial, { logger: { log() {}, warn() {}, error() {} } });
    const { [`${namespace} . coefficient`]: _coefficient, ...baselineSituation } = situation;
    baseline.setSituation({ ...baselineSituation, "salarié . convention collective": "'droit commun'" });
    for (const endpoint of [
      "salarié . cotisations . ATMP",
      "salarié . cotisations . formation professionnelle",
      "salarié . cotisations . prévoyances . conventionnelle . employeur",
      "salarié . cotisations . prévoyances . conventionnelle . salarié",
      "salarié . cotisations . assiette forfaitaire",
    ]) {
      assert.deepEqual(engine.evaluate(endpoint).nodeValue, baseline.evaluate(endpoint).nodeValue, endpoint);
    }
  });
});
