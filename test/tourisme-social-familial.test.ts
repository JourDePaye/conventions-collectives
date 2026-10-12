import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const name = "1316-tourisme-social-familial";
const namespace = "salarié . convention collective . tourisme social et familial";

const engineFor = async (niveau: string, date: string, quotient = "100%") => {
  const version = COMPILED_VERSIONS[name]?.find((item: { version: string }) => item.version === "2026.1");
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], "tourisme social et familial"],
  } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    "salarié . convention collective": "'tourisme social et familial'",
    [`${namespace} . niveau`]: `'${niveau}'`,
    [`${namespace} . date de calcul`]: date,
    "salarié . contrat . temps de travail . quotité": quotient,
    "salarié . contrat . statut cadre": "non",
  });
  return engine;
};

describe("IDCC 1316 — tourisme social et familial", () => {
  it("uses the January 2026 extended grid", async () => {
    const engine = await engineFor("G", "01/01/2026");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 3261.88);
  });

  it("uses the February 2026 first-level correction", async () => {
    const engine = await engineFor("A", "01/02/2026");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1823.10);
  });

  it("uses the May 2026 extended grid and prorates part-time work", async () => {
    const engine = await engineFor("D", "01/05/2026", "50%");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 996.405);
  });

  it("returns zero and flags an unknown level", async () => {
    const engine = await engineFor("H", "01/05/2026");
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0);
  });
});
