import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const name = "1611-logistique-communication-ecrite-directe";
const namespace = "salarié . convention collective . logistique communication écrite directe";

const engineFor = async (group: string, quotient = "1") => {
  const version = COMPILED_VERSIONS[name]?.find((item: { version: string }) => item.version === "2026.1");
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], "logistique communication écrite directe"],
  } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    "salarié . convention collective": "'logistique communication écrite directe'",
    [`${namespace} . groupe`]: `'${group}'`,
    "salarié . contrat . temps de travail . quotité": quotient,
    "salarié . contrat . statut cadre": "non",
  });
  return engine;
};

describe("IDCC 1611 — logistique de communication écrite directe", () => {
  it("proratise the sourced monthly minimum", async () => {
    const engine = await engineFor("III-A", "50%");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1250.525);
  });

  it("keeps an unknown group outside the convention grid", async () => {
    const engine = await engineFor("IV-A");
    assert.equal(engine.evaluate(`${namespace} . groupe hors grille`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0);
  });
});
