import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0468-commerce-succursaliste-chaussure";
const value = "commerce succursaliste de la chaussure";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2024.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(classification: string, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau et échelon`]: `'${classification}'`,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function monthly() {
  return Math.round((engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue as number) * 100) / 100;
}

function annual() {
  return Math.round((engine.evaluate(`${namespace} . rémunération minimum annuelle conventionnelle`).nodeValue as number) * 100) / 100;
}

describe("IDCC 468 — 2024.1 minimum salaries and payroll isolation", () => {
  it("records the effective date and official extension source", () => {
    assert.equal(version.validFrom, "2024-07-01");
    assert.ok(version.sources.some((source) => source.includes("JORFTEXT000049630725")));
    assert.ok(version.sources.some((source) => source.includes("KALICONT000005635394")));
  });

  it("models employee and agent de maîtrise monthly minima", () => {
    const grid: Record<string, number> = {
      "1": 1782.14,
      "2.1": 1784.71,
      "2.2": 1789.91,
      "3.1": 1794.06,
      "3.2": 1816.91,
      "4.1": 1837.67,
      "4.2": 1848.06,
      "5.1": 1880.24,
      "5.2": 1890.62,
      "6": 2038.07,
      "7": 2253.02,
    };
    for (const [classification, expected] of Object.entries(grid)) {
      setSituation(classification);
      assert.equal(monthly(), expected, classification);
      assert.equal(engine.evaluate(`${namespace} . niveau et échelon hors grille`).nodeValue, false);
    }
  });

  it("models annual cadre minima without converting them to monthly", () => {
    const grid: Record<string, number> = {
      "8": 28993,
      "8.2": 30300,
      "9": 32263,
      "9.2": 34227,
      "10": 36625,
      "11": 40986,
      "12": 46436,
    };
    for (const [classification, expected] of Object.entries(grid)) {
      setSituation(classification);
      assert.equal(annual(), expected, classification);
      assert.equal(monthly(), 0, classification);
      assert.equal(engine.evaluate(`${namespace} . niveau et échelon hors grille`).nodeValue, false);
    }
  });

  it("prorates monthly and annual minima once", () => {
    setSituation("4.2", "50%");
    assert.equal(monthly(), 924.03);
    setSituation("8.2", "80%");
    assert.equal(annual(), 24240);
  });

  it("rejects unknown classifications and exposes the payroll audit", () => {
    setSituation("99");
    assert.equal(monthly(), 0);
    assert.equal(annual(), 0);
    assert.equal(engine.evaluate(`${namespace} . niveau et échelon hors grille`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
  });

  it("keeps the namespace isolated from modele-social and other agreements", () => {
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
      assert.ok(!(name in modeleSocial), `Duplicate modele-social rule: ${name}`);
    }
    setSituation("5.2");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
