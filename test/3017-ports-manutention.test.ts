import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3017-ports-manutention";
const value = "ports et manutention";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === "2024.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(classification: string, seniority: number, quotité = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . classification`]: `'${classification}'`,
    [`${namespace} . ancienneté dans la classification`]: `${seniority} années`,
    "salarié . contrat . temps de travail . quotité": quotité,
  });
}

describe("IDCC 3017 — 2024.1 salaires et audit paie", () => {
  it("uses the official extended salary agreement", () => {
    assert.equal(version.validFrom, "2024-01-01");
    assert.ok(version.sources.some((source: string) => source.includes("KALITEXT000049508746")));
  });

  it("calculates the published B grid and seniority step", () => {
    setSituation("B", 0);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1914);
    setSituation("B", 33, "50%");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1291.5);
  });

  it("marks other classifications outside this deliberately scoped model", () => {
    setSituation("C.1", 0);
    assert.equal(engine.evaluate(`${namespace} . classification hors grille`).nodeValue, true);
  });

  it("keeps payroll-wide rules isolated and exposes the audit marker", () => {
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
    assert.equal(Object.keys(extension).some((name) => name in modeleSocial), false);
    assert.equal(Object.keys(extension).some((name) => name.includes("cotisations") || name.includes("prévoyance") || name.includes("santé") || name.includes("formation professionnelle") || name.includes("exonération cotisation AT")), false);
    setSituation("B", 0);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
