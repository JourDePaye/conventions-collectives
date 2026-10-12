import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const model = "1486-syntec";
const value = "syntec";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[model]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
for (const name of Object.keys(extension)) {
  assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
  assert.ok(!(name in rules), `Duplicate modele-social rule: ${name}`);
}
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = {
  ...choice,
  "une possibilité": [...new Set([...choice["une possibilité"], value])],
} as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(context: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    "salarié . contrat . statut cadre": "non",
    [`${namespace} . coefficient`]: 355,
    "salarié . contrat . salaire brut": "3000 €/mois",
    "entreprise . salariés . effectif": 20,
    ...context,
  });
}

describe("IDCC 1486 — 2026.1", () => {
  it("keeps the 2025 salary grid and exposes the legal sources", () => {
    assert.equal(version.validFrom, "2026-01-01");
    setSituation();
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2045);
    assert.ok(version.sources.some((source) => source.includes("formation professionnelle")));
    assert.ok(version.sources.some((source) => source.includes("prévoyance lourde")));
  });

  it("replaces the legal formation rate below and at the 50-employee threshold", () => {
    setSituation({ "entreprise . salariés . effectif": 20 });
    assert.equal(engine.evaluate("salarié . cotisations . formation professionnelle").nodeValue, 1.5);
    setSituation({ "entreprise . salariés . effectif": 50 });
    assert.equal(engine.evaluate("salarié . cotisations . formation professionnelle").nodeValue, 3);
  });

  it("does not alter the standard formation endpoint for another agreement", () => {
    setSituation({ "salarié . convention collective": "'droit commun'", "entreprise . salariés . effectif": 50 });
    assert.equal(engine.evaluate("salarié . cotisations . formation professionnelle").nodeValue, 30);
  });
});
