import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "1043-gardiens-concierges-employes-immeubles";
const value = "gardiens concierges et employés d'immeubles";
const ns = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[id]?.find((entry: { version: string }) => entry.version === "2025.1");
assert.ok(version, "IDCC 1043 must be exported");
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(overrides: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${ns} . coefficient hiérarchique`]: 600,
    [`${ns} . heures contractuelles`]: "151.67 heures/mois",
    [`${ns} . unités de valeur`]: 10000,
    [`${ns} . catégorie`]: "'A'",
    [`${ns} . lots principaux`]: 20,
    [`${ns} . catégorie logement`]: "'1'",
    [`${ns} . surface logement`]: "60 m²",
    "salarié . contrat . temps de travail . quotité": "100%",
    ...overrides,
  });
}

const evaluate = (rule: string) => engine.evaluate(`${ns} . ${rule}`).nodeValue;

describe("IDCC 1043 — avenant n° 110", () => {
  it("is effective on 1 May 2025 and cites official sources", () => {
    assert.equal(version.validFrom, "2025-05-01");
    assert.ok(version.sources.some((source: string) => source.includes("KALITEXT000051447059")));
    assert.ok(version.sources.some((source: string) => source.includes("KALIARTI000051447068")));
  });

  it("calculates category A salary from coefficient and contract hours", () => {
    setSituation({ [`${ns} . catégorie`]: "'A'", [`${ns} . coefficient hiérarchique`]: 600, [`${ns} . heures contractuelles`]: "151.67 heures/mois" });
    assert.equal(evaluate("salaire minimum conventionnel"), 1887);
  });

  it("calculates category B salary from coefficient and units of value", () => {
    setSituation({ [`${ns} . catégorie`]: "'B'", [`${ns} . coefficient hiérarchique`]: 600, [`${ns} . unités de valeur`]: 10000 });
    assert.equal(evaluate("salaire minimum conventionnel"), 1971);
  });

  it("calculates the selective-sorting premium with the legal floor and cap", () => {
    setSituation({ [`${ns} . lots principaux`]: 10 });
    assert.equal(evaluate("prime de tri sélectif"), 28);
    setSituation({ [`${ns} . lots principaux`]: 100 });
    assert.equal(evaluate("prime de tri sélectif"), 140);
    setSituation({ [`${ns} . lots principaux`]: 200 });
    assert.equal(evaluate("prime de tri sélectif"), 224);
  });

  it("calculates sourced benefits in kind and caps housing surface at 60 m²", () => {
    setSituation({ [`${ns} . catégorie logement`]: "'2'", [`${ns} . surface logement`]: "80 m²" });
    assert.equal(evaluate("valeur électricité"), 0.2516);
    assert.equal(evaluate("avantage en nature logement"), 168.9);
  });

  it("blocks missing classification data and stays isolated from unrelated agreements", () => {
    setSituation({ [`${ns} . coefficient hiérarchique`]: 0 });
    assert.equal(evaluate("salaire minimum conventionnel"), null);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, null);
  });
});
