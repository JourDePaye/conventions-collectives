import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const name = "2717-creation-evenement";
const value = "création événement";
const namespace = `salarié . convention collective . ${value}`;

async function engine(situation: Record<string, string | number>, agreement = value) {
  const version = COMPILED_VERSIONS[name]?.find((candidate) => candidate.version === "2024.1");
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], value],
  } as Rule;
  Object.assign(rules, extension);
  const result = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  result.setSituation({ "salarié . convention collective": `'${agreement}'`, ...situation });
  return result;
}

describe("IDCC 2717 — doublage", () => {
  it("calculates the sourced 1-to-6-lines, half-day, one-role minimum", async () => {
    const result = await engine({
      [`${namespace} . prestation`]: "'1 à 6 lignes — demi-journée — 1 rôle'",
    });
    assert.equal(result.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 112.40);
  });

  it("leaves unsupported classifications outside the grid", async () => {
    const result = await engine({
      [`${namespace} . prestation`]: "'classification inconnue'",
    });
    assert.equal(result.evaluate(`${namespace} . classification hors grille`).nodeValue, true);
  });

  it("is not applicable to another collective agreement", async () => {
    const result = await engine({
      [`${namespace} . prestation`]: "'1 à 6 lignes — demi-journée — 1 rôle'",
    }, "syntec");
    assert.equal(result.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
