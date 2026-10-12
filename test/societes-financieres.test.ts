import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const name = "0478-societes-financieres";
const namespace = "salarié . convention collective . sociétés financières";

const engineFor = async (coefficient: number, overrides: Record<string, string> = {}) => {
  const version = COMPILED_VERSIONS[name]?.find((item: { version: string }) => item.version === "2026.1");
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], "sociétés financières"],
  } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    "salarié . convention collective": "'sociétés financières'",
    [`${namespace} . coefficient`]: String(coefficient),
    [`${namespace} . champ juridique`]: "'employeur signataire ou adhérent'",
    [`${namespace} . date de calcul`]: "01/07/2026",
    "salarié . contrat . temps de travail . quotité": "100%",
    "salarié . contrat . statut cadre": "non",
    ...overrides,
  });
  return engine;
};

describe("IDCC 478 — sociétés financières", () => {
  it("evaluates the sourced monthly minimum for a coefficient", async () => {
    const engine = await engineFor(200);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2154);
  });

  it("proratizes the monthly minimum", async () => {
    const engine = await engineFor(200, {
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1077);
  });

  it("blocks the model outside the signatory or adherent scope", async () => {
    const engine = await engineFor(200, {
      [`${namespace} . champ juridique`]: "'autre employeur'",
    });
    assert.ok(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue == null);
  });

  it("blocks the model before the agreement effective date", async () => {
    const engine = await engineFor(200, {
      [`${namespace} . date de calcul`]: "30/06/2026",
    });
    assert.ok(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue == null);
  });

  it("reports a coefficient outside the sourced grid", async () => {
    const engine = await engineFor(201);
    assert.ok(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue == null);
  });
});
