import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2198-commerce-distance";
const value = "commerce à distance";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const MONTHLY: Record<string, number> = {
  "A débutant": 1823.03, "A maîtrisant": 1859, "A référent/polyvalent": 1932,
  "B débutant": 1861, "B maîtrisant": 1898, "B référent/polyvalent": 1973,
  "C débutant": 1899, "C maîtrisant": 1937, "C référent/polyvalent": 2013,
  "D débutant": 2042, "D maîtrisant": 2083, "D référent": 2165,
  "E débutant": 2473, "E maîtrisant": 2522, "E référent": 2621,
  "F débutant": 2731, "F maîtrisant": 2786, "F référent": 2895,
  "G débutant": 3422, "G maîtrisant": 3490, "G référent": 3627,
  "H maîtrisant": 4566, "H référent": 4743,
};

function setSituation(niveau: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(niveau === undefined ? {} : { [`${namespace} . niveau`]: `'${niveau}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

const amount = () => engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 2198 — 2026.1 minimum salaries", () => {
  it("is in force from 1 April 2026 and cites the official salary agreement", () => {
    assert.equal(version.validFrom, "2026-04-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 9 février 2026")));
    assert.ok(version.sources.some((source) => source.includes("arrêté du 4 mai 2026")));
  });

  for (const [niveau, minimum] of Object.entries(MONTHLY)) {
    it(`${niveau}: ${minimum} € monthly`, () => {
      setSituation(niveau);
      assert.equal(amount(), minimum);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the monthly minimum for part-time work", () => {
    setSituation("G référent", "50%");
    assert.equal(amount(), 1813.5);
  });

  it("rejects levels outside the grid", () => {
    for (const niveau of ["A expert", "H débutant", "I référent", "non renseigné"]) {
      setSituation(niveau);
      assert.equal(outOfGrid(), true, niveau);
      assert.equal(amount(), 0, niveau);
    }
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("G référent");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
