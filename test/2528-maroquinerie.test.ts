import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const namespace = "salarié . convention collective . maroquinerie";

async function createEngine(classification = "TAM III", quotity?: string) {
  const version = COMPILED_VERSIONS["2528-maroquinerie"]?.find((item) => item.version === "2026.1");
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], "maroquinerie"],
  } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    "salarié . convention collective": "'maroquinerie'",
    [`${namespace} . classification`]: `'${classification}'`,
    ...(quotity ? { "salarié . contrat . temps de travail . quotité": quotity } : {}),
    "salarié . contrat . statut cadre": "non",
  });
  return engine;
}

describe("IDCC 2528 — maroquinerie 2026.1", () => {
  it("evaluates the sourced TAM III minimum", async () => {
    const engine = await createEngine();
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1953);
  });

  it("prorates the minimum once for part-time work", async () => {
    const engine = await createEngine("TAM III", "50%");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 976.5);
  });

  it("returns zero for a classification outside the modelled grid", async () => {
    const engine = await createEngine("tannerie I");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0);
    assert.equal(engine.evaluate(`${namespace} . classification hors grille`).nodeValue, true);
  });
});
