import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "1043-gardiens-concierges-employes-immeubles";
const value = "gardiens concierges et employés d'immeubles";
const ns = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[id]?.find((entry: { version: string }) => entry.version === "2026.1");
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

const evaluate = (rule: string) => {
  const v = engine.evaluate(`${ns} . ${rule}`).nodeValue;
  return typeof v === "number" ? Math.round(v * 10000) / 10000 : v;
};

describe("IDCC 1043 — avenant n° 115", () => {
  it("is effective on 1 May 2026 and cites official sources", () => {
    assert.equal(version.validFrom, "2026-05-01");
    assert.ok(version.sources.some((source: string) => source.includes("KALITEXT000054091896")));
    assert.ok(version.sources.some((source: string) => source.includes("KALITEXT000054091896")));
  });

  it("calculates category A salary from coefficient and contract hours", () => {
    setSituation({ [`${ns} . catégorie`]: "'A'", [`${ns} . coefficient hiérarchique`]: 600, [`${ns} . heures contractuelles`]: "151.67 heures/mois" });
    assert.equal(evaluate("salaire minimum conventionnel"), 1910);
  });

  it("calculates category B salary from coefficient and units of value", () => {
    setSituation({ [`${ns} . catégorie`]: "'B'", [`${ns} . coefficient hiérarchique`]: 600, [`${ns} . unités de valeur`]: 10000 });
    assert.equal(evaluate("salaire minimum conventionnel"), 1994);
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
    assert.equal(evaluate("valeur électricité"), 0.1952);
    assert.equal(evaluate("avantage en nature logement"), 170.22);
  });

  it("blocks missing classification data and stays isolated from unrelated agreements", () => {
    setSituation({ [`${ns} . coefficient hiérarchique`]: 0 });
    assert.equal(evaluate("salaire minimum conventionnel"), null);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, null);
  });

  it("covers other coefficients, part-time hours and the other housing categories", () => {
    setSituation({ [`${ns} . catégorie`]: "'A'", [`${ns} . coefficient hiérarchique`]: 300 });
    assert.equal(evaluate("salaire minimum conventionnel"), 1415);
    setSituation({ [`${ns} . catégorie`]: "'A'", [`${ns} . coefficient hiérarchique`]: 600, [`${ns} . heures contractuelles`]: "75.835 heures/mois" });
    assert.equal(evaluate("salaire minimum conventionnel"), 955);
    setSituation({ [`${ns} . catégorie`]: "'B'", [`${ns} . coefficient hiérarchique`]: 300 });
    assert.equal(evaluate("salaire minimum conventionnel"), 1457);
    setSituation({ [`${ns} . catégorie`]: "'B'", [`${ns} . coefficient hiérarchique`]: 300, [`${ns} . unités de valeur`]: 5000 });
    assert.equal(evaluate("salaire minimum conventionnel"), 728.5);
    setSituation({ [`${ns} . catégorie logement`]: "'1'", [`${ns} . surface logement`]: "50 m²" });
    assert.equal(evaluate("avantage en nature logement"), 179.65);
    setSituation({ [`${ns} . catégorie logement`]: "'3'", [`${ns} . surface logement`]: "40 m²" });
    assert.equal(evaluate("avantage en nature logement"), 83.8);
  });
});
