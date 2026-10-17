import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const namespace = "salarié . convention collective . industries du bois";

async function createEngine(classification = "ACT 6.1", situation: Record<string, string> = {}, revision = "2026.2") {
  const version = COMPILED_VERSIONS["0158-industries-bois"]?.find((item) => item.version === revision);
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], "industries du bois"],
  } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    "salarié . convention collective": "'industries du bois'",
    [`${namespace} . classification`]: `'${classification}'`,
    "salarié . contrat . statut cadre": "non",
    ...situation,
  });
  return engine;
}

describe("IDCC 158 — industries du bois 2026.2", () => {
  it("evaluates the sourced ACT 6.1 minimum", async () => {
    const engine = await createEngine();
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2448);
  });

  it("prorates the minimum once for part-time work", async () => {
    const engine = await createEngine("ACT 6.1", {
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1224);
  });

  it("blocks classifications outside the modelled grid", async () => {
    const engine = await createEngine("tannerie I");
    assert.equal(engine.evaluate(`${namespace} . classification hors grille`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . calcul bloqué`).nodeValue, true);
  });
});

// Avenant n° 6 du 28 novembre 2024, annexe 1 (au 1er janvier 2025), extended on 2 May 2025.
describe("IDCC 158 — industries du bois 2025.1", () => {
  const cases: [string, number][] = [
    ["ouvrier 1 AB", 1802],
    ["ouvrier 4.3 J", 2189],
    ["ACT 2.2", 1826],
    ["ACT 6.1", 2424],
    ["AM 2.1", 2348],
    ["C 1", 2675],
    ["C 8", 4808],
  ];
  for (const [classification, minimum] of cases) {
    it(`${classification}: ${minimum} €`, async () => {
      const engine = await createEngine(classification, {}, "2025.1");
      assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, minimum);
    });
  }

  it("binds members from 1 January 2025 and non-members from 2 May 2025", () => {
    const version = COMPILED_VERSIONS["0158-industries-bois"]?.find((item) => item.version === "2025.1");
    assert.equal(version?.validFrom, "2025-01-01");
    assert.equal(version?.extension, "2025-05-02");
  });
});
