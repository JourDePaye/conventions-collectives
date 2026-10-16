import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2707-batiment-etam-ile-de-france";
const value = "bâtiment ETAM Île-de-France";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2018.2");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

// Avenant n° 9 du 5 décembre 2017, article 2 (KALITEXT000037172865): 8 levels A to H.
const GRID: Record<string, number> = { A: 1500, B: 1580, C: 1690, D: 1895, E: 2055, F: 2435, G: 2690, H: 2915 };

function setSituation(niveau: string, quotité = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: `'${niveau}'`,
    "salarié . contrat . temps de travail . quotité": quotité,
  });
}

function minimum() {
  return engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
}

describe("IDCC 2707 — 2018.2 salaires et audit paie", () => {
  it("uses the official salary text, convention and extension references", () => {
    assert.equal(version.validFrom, "2018-01-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000037172865")));
    assert.ok(version.sources.some((source) => source.includes("KALICONT000024794551")));
    assert.ok(version.sources.some((source) => source.includes("2018/12/30/0302")));
  });

  for (const [niveau, expected] of Object.entries(GRID)) {
    it(`calculates ${expected} € for level ${niveau}`, () => {
      setSituation(niveau);
      assert.equal(minimum(), expected);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, false);
    });
  }

  it("prorates the minimum for part-time work", () => {
    setSituation("H", "50%");
    assert.equal(minimum(), 1457.5);
    setSituation("G", "50%");
    assert.equal(minimum(), 1345);
  });

  it("rejects classifications outside the sourced grid", () => {
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . niveau`]: "'I'",
    });
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
    assert.equal(minimum(), null);
  });

  it("exposes the complete payroll audit and isolates modele-social contributions", () => {
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
    assert.equal(Object.keys(extension).some((name) => name in modeleSocial), false);
    assert.equal(Object.keys(extension).some((name) => /cotisations|prévoyance|santé|formation professionnelle|retraite|AT/.test(name)), false);
  });

  it("supersedes 2018.1 for the same validFrom", () => {
    const first = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2018.1");
    assert.ok(first);
    assert.equal(first.validFrom, version.validFrom);
  });

  it("is inapplicable for another collective agreement", () => {
    setSituation("A");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
