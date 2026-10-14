import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2060-chaines-cafeterias";
const value = "chaînes de cafétérias et assimilés";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === "2024.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setClassification(classification: string, quotité = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau et échelon`]: `'${classification}'`,
    "salarié . contrat . temps de travail": "151.67 heures/mois",
    "salarié . contrat . temps de travail . quotité": quotité,
  });
}

describe("IDCC 2060 — 2024.1 salary minimums and payroll audit", () => {
  it("uses the official extended salary agreement", () => {
    assert.equal(version.validFrom, "2024-09-01");
    assert.ok(version.sources.some((source: string) => source.includes("KALITEXT000050140869")));
  });

  it("evaluates an hourly minimum and monthly conversion", () => {
    setClassification("III.2");
    assert.equal(engine.evaluate(`${namespace} . taux horaire minimum conventionnel`).nodeValue, 12.4);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1880.7079999999999);
  });

  it("keeps the level V guarantee annual", () => {
    setClassification("V.2", "50%");
    assert.equal(engine.evaluate(`${namespace} . rémunération minimum annuelle conventionnelle`).nodeValue, 23184);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });

  it("marks an unknown classification outside the modelled grid", () => {
    setClassification("IV.4");
    assert.equal(engine.evaluate(`${namespace} . niveau et échelon hors grille`).nodeValue, true);
  });

  it("is isolated from another convention and does not redefine payroll-wide rules", () => {
    assert.equal(Object.keys(extension).some((name) => name in modeleSocial), false);
    assert.equal(Object.keys(extension).some((name) => name.includes("cotisations") || name.includes("prévoyance") || name.includes("santé") || name.includes("formation professionnelle") || name.includes("exonération cotisation AT")), false);
    setClassification("II.1");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
