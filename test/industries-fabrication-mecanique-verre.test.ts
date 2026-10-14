import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const name = "0669-industries-fabrication-mecanique-verre";
const value = "industries fabrication mecanique verre";
const namespace = `salarié . convention collective . ${value}`;

const engineFor = async (coefficient: number, quotient = "1") => {
  const version = COMPILED_VERSIONS[name]?.find((item: { version: string }) => item.version === "2025.1");
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  for (const key of Object.keys(extension)) assert.equal(key in rules, false, `Unexpected modele-social collision: ${key}`);
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . coefficient`]: String(coefficient),
    "salarié . contrat . temps de travail . quotité": quotient,
    "salarié . contrat . statut cadre": "non",
  });
  return engine;
};

describe("IDCC 669 — industries de fabrication mécanique du verre", () => {
  it("proratise the sourced monthly minimum", async () => {
    const engine = await engineFor(250, "50%");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1126.115);
  });

  it("exposes the sourced hourly SMP", async () => {
    const engine = await engineFor(250);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum professionnel horaire`).nodeValue, 5.265);
  });

  it("rejects coefficients outside the published grid and remains isolated", async () => {
    const engine = await engineFor(120);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0);
  });
});
