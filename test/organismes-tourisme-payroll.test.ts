import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1909-organismes-tourisme";
const value = "organismes de tourisme";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.2");
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

function setSituation(status: "cadre" | "non-cadre" = "non-cadre") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: "'3.3'",
    [`${namespace} . date de calcul`]: "11/10/2026",
    "salarié . contrat . temps de travail . quotité": "100%",
    "salarié . contrat . salaire brut": "5000 €/mois",
    "salarié . contrat . statut cadre": status === "cadre" ? "oui" : "non",
  });
}

function evaluate(rule: string) {
  return engine.evaluate(`${namespace} . ${rule}`).nodeValue;
}

describe("IDCC 1909 — 2026.2 payroll rubrics", () => {
  it("keeps the identity and salary source while adding the two convention regimes", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source) => source.includes("Accord n° 48 du 26 janvier 2026")));
    assert.ok(version.sources.some((source) => source.includes("Accord n° 41 du 30 août 2023") && source.includes("KALITEXT000048558715")));
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 34 du 2 novembre 2021") && source.includes("KALITEXT000045139544")));
    setSituation();
    assert.equal(evaluate("salaire minimum conventionnel"), 4281.53);
  });

  it("applies the 1.40% PMSS health contribution equally", () => {
    setSituation();
    const pmss = engine.evaluate("plafond sécurité sociale").nodeValue as number;
    assert.equal(evaluate("santé . employeur"), pmss * 1.4 / 100 / 2);
    assert.equal(evaluate("santé . salarié"), pmss * 1.4 / 100 / 2);
  });

  it("applies the non-cadre employer-only prévoyance rates on T1 and T2", () => {
    setSituation("non-cadre");
    const pmss = engine.evaluate("plafond sécurité sociale").nodeValue as number;
    const expected = Math.min(5000, pmss) * 0.86 / 100 + (5000 - pmss) * 0.86 / 100;
    assert.equal(evaluate("prévoyance . employeur"), expected);
    assert.equal(evaluate("prévoyance . salarié"), 0);
  });

  it("applies the cadre employer-only rates on T1 and T2", () => {
    setSituation("cadre");
    const pmss = engine.evaluate("plafond sécurité sociale").nodeValue as number;
    const expected = Math.min(5000, pmss) * 1.74 / 100 + (5000 - pmss) * 2.87 / 100;
    assert.equal(evaluate("prévoyance . employeur"), expected);
    assert.equal(evaluate("prévoyance . salarié"), 0);
  });

  it("does not apply the convention regimes to another agreement", () => {
    setSituation();
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(evaluate("santé . employeur"), null);
    assert.equal(evaluate("prévoyance . employeur"), null);
  });
});

// Accord n° 42 du 21 août 2023 (KALITEXT000048557957), article 11: the base health contribution is
// shared equally, with no rate; revision 2026.3 no longer sets the 1,40 % of avenant n° 34 (2021).
describe("IDCC 1909 — 2026.3 without a conventional health rate", async () => {
  const revision = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.3");
  assert.ok(revision);
  // From modele-social alone: `rules` already holds revision 2026.2.
  const revisionEngine = new Engine(
    { ...modeleSocial, "salarié . convention collective": rules["salarié . convention collective"], ...(await revision.loadRules()) } as Record<string, Rule>,
    { logger: { log() {}, warn() {}, error() {} } },
  );
  const situation = {
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: "'3.3'",
    [`${namespace} . date de calcul`]: "11/10/2026",
    "salarié . contrat . temps de travail . quotité": "100%",
    "salarié . contrat . salaire brut": "5000 €/mois",
    "salarié . contrat . statut cadre": "non",
  };

  it("leaves the health contribution to the company's insurance", () => {
    revisionEngine.setSituation(situation);
    const withAgreement = revisionEngine.evaluate("salarié . cotisations . prévoyances . santé . employeur").nodeValue;
    revisionEngine.setSituation({ ...situation, "salarié . convention collective": "'droit commun'" });
    assert.equal(withAgreement, revisionEngine.evaluate("salarié . cotisations . prévoyances . santé . employeur").nodeValue);
    assert.equal(Object.keys(revisionEngine.getParsedRules()).some((name) => name.startsWith(`${namespace} . santé`)), false);
  });

  it("keeps the employer-funded provident scheme of accord n° 41", () => {
    revisionEngine.setSituation(situation);
    // Non-cadre: 0,86 % of the salary (tranches 1 and 2), all on the employer.
    assert.equal(Math.round((revisionEngine.evaluate(`${namespace} . prévoyance . employeur`).nodeValue as number) * 100) / 100, 43);
    assert.equal(revisionEngine.evaluate(`${namespace} . prévoyance . salarié`).nodeValue, 0);
  });
});

