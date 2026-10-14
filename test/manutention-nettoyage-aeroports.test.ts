import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "1391-manutention-nettoyage-aeroports";
const value = "manutention nettoyage aéroports";
const ns = `salarié . convention collective . ${value}`;

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((v) => v.version === "2026.1");
  assert.ok(version, "IDCC 1391 must be exported");
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], value],
  } as Rule;
  for (const name of Object.keys(extension)) assert.equal(name in rules, false, `Unexpected collision: ${name}`);
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

function set(engine: Engine, category: string | undefined = "C", extra: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${ns} . catégorie`]: category === undefined ? "'non renseigné'" : `'${category}'`,
    "salarié . contrat . statut cadre": "non",
    ...extra,
  });
}

const get = (engine: Engine, rule: string) => engine.evaluate(`${ns} . ${rule}`);

describe("IDCC 1391 — personnel au sol des entreprises de transport aérien", () => {
  it("exports the sourced category grid", async () => {
    const engine = await makeEngine();
    set(engine, "C");
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 2602);
  });

  it("prorates the monthly minimum by working-time quota", async () => {
    const engine = await makeEngine();
    set(engine, "E", { "salarié . contrat . temps de travail . quotité": "50%" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 1824.5);
  });

  it("rejects a category outside the sourced grid", async () => {
    const engine = await makeEngine();
    set(engine, "Z");
    assert.equal(get(engine, "catégorie hors grille").nodeValue, true);
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, null);
  });

  it("keeps the contribution namespace inherited and isolated", async () => {
    const engine = await makeEngine();
    set(engine, "A");
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 2384);
    assert.equal(Object.keys(engine.getParsedRules()).some((name) => name.includes("manutention nettoyage aéroports . cotisations")), false);
  });
});
