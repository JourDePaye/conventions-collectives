import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const name = "1821-cristal-verre-vitrail";
const value = "cristal verre vitrail";
const namespace = `salarié . convention collective . ${value}`;

const engineFor = async (coefficient: number, quotient = "1", excluded = "non") => {
  const version = COMPILED_VERSIONS[name]?.find((item: { version: string }) => item.version === "2026.2");
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . coefficient`]: String(coefficient),
    [`${namespace} . annexe B vitrail exclue`]: excluded,
    "salarié . contrat . temps de travail . quotité": quotient,
    "salarié . contrat . statut cadre": "non",
  });
  return engine;
};

describe("IDCC 1821 — cristal, verre et vitrail", () => {
  it("proratise the sourced 2026 monthly minimum", async () => {
    const engine = await engineFor(245, "50%");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1092.795);
  });

  it("rejects coefficients outside the published grid", async () => {
    const engine = await engineFor(120);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0);
  });

  it("makes the salary grid inapplicable to the excluded annexe B", async () => {
    const engine = await engineFor(245, "1", "oui");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
