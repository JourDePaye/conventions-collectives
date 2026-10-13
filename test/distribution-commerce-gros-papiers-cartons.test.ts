import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "distribution commerce gros papiers cartons";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS["3224-distribution-commerce-gros-papiers-cartons"]?.find((entry) => entry.version === "2025.1");
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

function setSituation(classification: string, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau et échelon`]: `'${classification}'`,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function amount() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 3224 — distribution et commerce de gros des papiers-cartons 2025.1", () => {
  it("is in force from the agreement date and cites official sources", () => {
    assert.equal(version.validFrom, "2025-03-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000051947672")));
    assert.ok(version.sources.some((source) => source.includes("JORFTEXT000052020326")));
  });

  it("evaluates monthly and annual guarantees", () => {
    setSituation("III.2");
    assert.equal(amount(), 1961.8);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, 24603.26);
    setSituation("V.3");
    assert.equal(amount(), 4516.8);
  });

  it("prorates the monthly and annual minima once", () => {
    setSituation("IV.2", "50%");
    assert.equal(amount(), 1067.9);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, 13327.39);
  });

  it("exposes audited health and night-meal terms without inferring eligibility", () => {
    setSituation("I.1");
    assert.equal(engine.evaluate(`${namespace} . financement patronal frais de santé`).nodeValue, 55);
    assert.equal(engine.evaluate(`${namespace} . prime panier de nuit`).nodeValue, 6.3);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
  });

  it("reports an unknown classification and leaves another agreement untouched", () => {
    setSituation("VI.1");
    assert.equal(engine.evaluate(`${namespace} . niveau et échelon hors grille`).nodeValue, true);
    assert.equal(amount(), 0);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
