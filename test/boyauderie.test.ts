import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1543-boyauderie";
const value = "boyauderie";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(coefficient: number, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . coefficient`]: coefficient,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  return Math.round((engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue as number) * 100) / 100;
}

describe("IDCC 1543 — 2026.1", () => {
  it("uses the official agreement and effective date", () => {
    assert.equal(version.validFrom, "2026-02-01");
    assert.ok(version.sources.some((source) => source.includes("KALIARTI000054092006")));
    assert.ok(version.sources.some((source) => source.includes("TRST2609134A")));
  });

  it("evaluates sourced minima and part-time prorating", () => {
    setSituation(125);
    assert.equal(minimum(), 1835.6);
    setSituation(200, "50%");
    assert.equal(minimum(), 1065.1);
    setSituation(700);
    assert.equal(minimum(), 5763.4);
  });

  it("rejects coefficients outside the grid", () => {
    setSituation(126);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
    assert.equal(minimum(), 0);
  });

  it("audits the convention-specific prévoyance endpoints", () => {
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . coefficient`]: 200,
      "salarié . contrat . temps de travail . quotité": "100%",
      "salarié . contrat . salaire brut": "5000 €/mois",
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(engine.evaluate(`${namespace} . prévoyance . employeur`).nodeValue, 26);
    assert.equal(engine.evaluate(`${namespace} . prévoyance . salarié`).nodeValue, 26);
  });

  it("is isolated from another convention", () => {
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
