import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0573-commerces-de-gros";
const value = "commerces de gros";
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

/** Monthly minimums of levels I to VI for 151.67 hours, article 1 of the accord of 17 March 2026. */
const MONTHLY: Record<string, number> = {
  "I.1": 1839.81, "I.2": 1850.85, "I.3": 1861.96,
  "II.1": 1873.13, "II.2": 1884.37, "II.3": 1895.67,
  "III.1": 1907.05, "III.2": 1918.49, "III.3": 1930.0,
  "IV.1": 1941.58, "IV.2": 1953.23, "IV.3": 1964.95,
  "V.1": 1973.03, "V.2": 2047.02, "V.3": 2123.78,
  "VI.1": 2203.43, "VI.2": 2286.05, "VI.3": 2371.78,
};

/** Annual minimums of levels VII to X, appraised on 31 December. */
const ANNUAL: Record<string, number> = {
  "VII.1": 30338.3, "VII.2": 31855.22, "VII.3": 33447.98,
  "VIII.1": 38709.35, "VIII.2": 42580.28, "VIII.3": 46838.31,
  "IX.1": 51522.14, "IX.2": 56674.36,
  "X.1": 65175.51, "X.2": 78210.61,
};

function setSituation(level: string | undefined, quota = "100%", salary = "0 €/mois", cadre = "non") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
    "salarié . contrat . salaire brut": salary,
    "salarié . contrat . statut cadre": cadre,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return result as number;
}

const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 573 — 2026.1 minimum salaries", () => {
  it("is in force from 1 July 2026 and cites the accord, extension order, and prévoyance source", () => {
    assert.equal(version.validFrom, "2026-07-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 17 mars 2026")));
    assert.ok(version.sources.some((source) => source.includes("arrêté du 11 juin 2026")));
    assert.ok(version.sources.some((source) => source.includes("prévoyance")));
  });

  it("has 28 positions: 18 monthly and 10 annual", () => {
    assert.equal(Object.keys(MONTHLY).length, 18);
    assert.equal(Object.keys(ANNUAL).length, 10);
  });

  for (const [level, expected] of Object.entries(MONTHLY)) {
    it(`${level}: ${expected} € a month`, () => {
      setSituation(level);
      assert.ok(Math.abs(minimum() - expected) < 1e-9);
      assert.equal(outOfGrid(), false);
    });
  }

  for (const [level, expected] of Object.entries(ANNUAL)) {
    it(`${level}: ${expected} € a year, one twelfth a month`, () => {
      setSituation(level);
      assert.ok(Math.abs(minimum() - expected / 12) < 1e-9);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setSituation("IV.2", "50%");
    assert.ok(Math.abs(minimum() - 1953.23 / 2) < 1e-9);
    setSituation("VIII.1", "80%");
    assert.ok(Math.abs(minimum() - (38709.35 / 12) * 0.8) < 1e-9);
  });

  it("rejects levels and steps outside the grid", () => {
    for (const level of ["I", "I.0", "I.4", "VII.4", "IX.3", "X.3", "XI.1", "1.1", "i.1", "non renseigné"]) {
      setSituation(level);
      assert.equal(outOfGrid(), true, level);
      assert.equal(minimum(), 0, level);
    }
  });

  it("reports a missing level as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(minimum(), 0);
  });

  it("models the extended non-cadre prévoyance rate on four PASS", () => {
    setSituation("IV.2", "100%", "10000 €/mois", "non");
    assert.ok(Math.abs((engine.evaluate(`${namespace} . prévoyance . employeur`).nodeValue as number) - 10000 * 0.00372) < 1e-9);
    assert.ok(Math.abs((engine.evaluate(`${namespace} . prévoyance . salarié`).nodeValue as number) - 10000 * 0.00248) < 1e-9);
    setSituation("IV.2", "100%", "100000 €/mois", "non");
    const pass = engine.evaluate("plafond sécurité sociale").nodeValue as number;
    assert.ok(Math.abs((engine.evaluate(`${namespace} . prévoyance . employeur`).nodeValue as number) - 4 * pass * 0.00372) < 1e-9);
  });

  it("replaces the inherited cadre prévoyance with 1.50% on tranche A", () => {
    setSituation("VII.1", "100%", "10000 €/mois", "oui");
    const pass = engine.evaluate("plafond sécurité sociale").nodeValue as number;
    assert.equal(engine.evaluate(`${namespace} . prévoyance cadre`).nodeValue, pass * 0.015);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("IV.2");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, null);
  });

  it("does not collide with modele-social", () => {
    assert.equal(Object.keys(extension).some((name) => name in modeleSocial), false);
  });
});
