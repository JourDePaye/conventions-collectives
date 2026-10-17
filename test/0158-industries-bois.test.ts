import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const namespace = "salarié . convention collective . industries du bois";

async function createEngine(classification = "ACT 6.1", situation: Record<string, string> = {}) {
  const version = COMPILED_VERSIONS["0158-industries-bois"]?.find((item) => item.version === "2026.2");
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
