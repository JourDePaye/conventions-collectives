import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const model = "1486-syntec";
const value = "syntec";
const namespace = `salarié . convention collective . ${value}`;

async function engineOf(revision: string) {
  const version = COMPILED_VERSIONS[model]?.find((entry) => entry.version === revision);
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
  const setSituation = (context: Record<string, string | number> = {}) => {
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      "salarié . contrat . statut cadre": "non",
      [`${namespace} . coefficient`]: 355,
      "salarié . contrat . salaire brut": "3000 €/mois",
      "entreprise . salariés . effectif": 20,
      ...context,
    });
  };
  return { version, engine, setSituation };
}

const formation = "salarié . cotisations . formation professionnelle";

describe("IDCC 1486 — 2026.1", async () => {
  const { version, engine, setSituation } = await engineOf("2026.1");

  it("keeps the 2025 salary grid and exposes the legal sources", () => {
    assert.equal(version.validFrom, "2026-01-01");
    setSituation();
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2045);
    assert.ok(version.sources.some((source) => source.includes("formation professionnelle")));
    assert.ok(version.sources.some((source) => source.includes("prévoyance lourde")));
  });

  it("replaces the legal formation rate below and at the 50-employee threshold", () => {
    setSituation({ "entreprise . salariés . effectif": 20 });
    assert.equal(engine.evaluate(formation).nodeValue, 1.5);
    setSituation({ "entreprise . salariés . effectif": 50 });
    assert.equal(engine.evaluate(formation).nodeValue, 3);
  });

  it("does not alter the standard formation endpoint for another agreement", () => {
    setSituation({ "salarié . convention collective": "'droit commun'", "entreprise . salariés . effectif": 50 });
    assert.equal(engine.evaluate(formation).nodeValue, 30);
  });
});

// 2026.1 replaced the legal contribution with the agreement's own rate, which the agreement adds
// to it: 2026.2 adds the 0.05 % (0.10 % from 50 employees) to the legal 0.55 % (1 % from 11).
describe("IDCC 1486 — 2026.2", async () => {
  const { version, engine, setSituation } = await engineOf("2026.2");

  it("keeps the 2026.1 grid, effective date and sources", () => {
    assert.equal(version.validFrom, "2026-01-01");
    setSituation();
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2045);
    assert.ok(version.sources.some((source) => source.includes("formation professionnelle")));
  });

  it("adds the agreement contribution to the legal formation contribution", () => {
    // 3 000 € × (0.55 % + 0.05 %), 3 000 € × (1 % + 0.05 %), 3 000 € × (1 % + 0.10 %).
    for (const [effectif, expected] of [[5, 18], [20, 31.5], [50, 33]] as const) {
      setSituation({ "entreprise . salariés . effectif": effectif });
      const amount = engine.evaluate(formation).nodeValue as number;
      assert.equal(Math.round(amount * 100) / 100, expected, `effectif ${effectif}`);
    }
  });

  it("does not alter the standard formation endpoint for another agreement", () => {
    setSituation({ "salarié . convention collective": "'droit commun'", "entreprise . salariés . effectif": 50 });
    assert.equal(engine.evaluate(formation).nodeValue, 30);
  });
});
