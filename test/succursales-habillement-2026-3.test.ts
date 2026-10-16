import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0675-succursales-habillement";
const value = "succursales habillement";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.3");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);

// Hard-coded from the accord of 16 April 2026, article 1er (A.1, A.2, B.1, B.2).
const MINIMUM: Record<string, number> = { E1: 1824, E2: 1837, E3: 1851, E4: 1900, AM1: 1981, AM2: 2058, C1: 2348, C2: 2581, C3: 3044 };
const BONUS: Record<string, number[]> = {
  E1: [30.76, 61.52, 92.06, 122.8, 153.57, 204.56],
  E2: [31.1, 61.99, 93.07, 124.2, 155.29, 206.92],
  E3: [31.96, 64.13, 96.09, 128.04, 160.2, 213.33],
  E4: [33.3, 66.6, 100.12, 133.43, 166.75, 222.36],
  AM1: [35.06, 70.12, 105.18, 140.24, 175.28, 233.72],
  AM2: [38.24, 76.68, 114.94, 153.18, 191.65, 255.52],
  C1: [44.09, 88.13, 132.07, 176.14, 220.23, 293.71],
  C2: [48.98, 97.81, 147.15, 196.12, 245.09, 326.72],
  C3: [58.93, 117.86, 176.77, 235.7, 294.63, 392.68],
};
const BRACKETS = [3, 6, 9, 12, 15, 20];
const FORFAIT: Record<string, number> = { C1: 32402.4, C2: 35617.8, C3: 42007.2 };

function engineFor(level: string | undefined, seniority = "0 an", forfait = "non", quota = "100%") {
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    "salarié . ancienneté": seniority,
    [`${namespace} . forfait jours`]: forfait,
    "salarié . contrat . temps de travail . quotité": quota,
  });
  return engine;
}

function amount(engine: Engine, rule: string) {
  const result = engine.evaluate(`${namespace} . ${rule}`).nodeValue;
  assert.equal(typeof result, "number", rule);
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 675 — 2026.3 payroll rules", () => {
  it("is in force from 1 May 2026 and cites the accord and the extension order", () => {
    assert.equal(version.validFrom, "2026-05-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000054871910")));
    assert.ok(version.sources.some((source) => source.includes("TRST2616915A")));
  });

  it("supersedes 2026.2 for the same date", () => {
    const versions = (COMPILED_VERSIONS[agreement] ?? []).filter((entry) => entry.validFrom === "2026-05-01").map((entry) => entry.version);
    assert.deepEqual(versions.sort(), ["2026.1", "2026.2", "2026.3"]);
  });

  for (const [level, expected] of Object.entries(MINIMUM)) {
    it(`gives ${expected} € for ${level}`, () => {
      const engine = engineFor(level);
      assert.equal(amount(engine, "salaire minimum conventionnel"), expected);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, false);
    });
  }

  for (const [level, amounts] of Object.entries(BONUS)) {
    BRACKETS.forEach((years, index) => {
      it(`${level} at ${years} years: seniority amount ${amounts[index]} €`, () => {
        const engine = engineFor(level, `${years} an`);
        assert.equal(amount(engine, "montant prime d'ancienneté"), amounts[index]);
        assert.equal(amount(engine, "salaire minimum avec prime d'ancienneté"), Math.round((MINIMUM[level]! + amounts[index]!) * 100) / 100);
        const distinct = level.startsWith("C") ? 0 : amounts[index];
        assert.equal(amount(engine, "prime d'ancienneté"), distinct);
      });
    });
  }

  it("pays no bonus before 3 years, and between brackets keeps the lower one", () => {
    assert.equal(amount(engineFor("E1", "2 an"), "prime d'ancienneté"), 0);
    assert.equal(amount(engineFor("E1", "5 an"), "prime d'ancienneté"), 30.76);
    assert.equal(amount(engineFor("E1", "19 an"), "prime d'ancienneté"), 153.57);
    assert.equal(amount(engineFor("E1", "30 an"), "prime d'ancienneté"), 204.56);
  });

  it("feeds modele-social with the bonus of employés, not of cadres", () => {
    assert.equal(engineFor("E1", "3 an").evaluate("salarié . rémunération . primes . ancienneté").nodeValue, 30.76);
    assert.equal(engineFor("C3", "20 an").evaluate("salarié . rémunération . primes . ancienneté").nodeValue, 0);
  });

  it("prorates the minimum and the bonus once for part-time work", () => {
    const engine = engineFor("E4", "6 an", "non", "50%");
    assert.equal(amount(engine, "salaire minimum conventionnel"), 950);
    assert.equal(amount(engine, "prime d'ancienneté"), 33.3);
    assert.equal(amount(engine, "salaire minimum avec prime d'ancienneté"), 983.3);
  });

  it("gives the forfait jours minimum as 12 x 1.15 x the minimum, bonus excluded", () => {
    for (const [level, expected] of Object.entries(FORFAIT)) {
      assert.equal(amount(engineFor(level, "20 an", "oui"), "salaire minimum annuel forfait jours"), expected, level);
    }
    assert.equal(amount(engineFor("C2", "0 an", "non"), "salaire minimum annuel forfait jours"), 0);
    assert.equal(amount(engineFor("E4", "0 an", "oui"), "salaire minimum annuel forfait jours"), 0);
  });

  it("flags categories outside the grid", () => {
    for (const level of ["E5", "C4", "X"]) {
      const engine = engineFor(level, "5 an");
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true, level);
      assert.equal(amount(engine, "salaire minimum conventionnel"), 0);
      assert.equal(amount(engine, "prime d'ancienneté"), 0);
    }
    assert.equal(engineFor(undefined).evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
  });

  it("stays inapplicable for another agreement", () => {
    const engine = engineFor("E4", "6 an");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . prime d'ancienneté`).nodeValue, null);
  });
});
