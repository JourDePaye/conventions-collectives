import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const name = "1512-promotion-immobiliere";
const value = "promotion immobilière";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[name]?.find((candidate) => candidate.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = {
  ...choice,
  "une possibilité": [...choice["une possibilité"], value],
} as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function minimum(coefficient: number, forfaitJours = false) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . coefficient`]: coefficient,
    [`${namespace} . forfait annuel en jours`]: forfaitJours ? "oui" : "non",
  });
  return engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
}

describe("IDCC 1512", () => {
  it("applies the point formula to every sourced coefficient", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.deepEqual(
      [100, 110, 123, 143, 163, 176, 203, 300, 390, 457, 590, 723, 787].map((coefficient) => minimum(coefficient)),
      [1885, 1930, 1989, 2079, 2169, 2227, 2349, 2785, 3190, 3492, 4090, 4689, 4977],
    );
  });

  it("uses the annual minimum for levels 4 to 6 on 218-day forfaits", () => {
    minimum(300, true);
    assert.equal(engine.evaluate(`${namespace} . minimum annuel forfait jours`).nodeValue, 36276);
    assert.equal(minimum(203, true), 2349);
  });

  it("returns zero for an unsupported coefficient", () => {
    assert.equal(minimum(999), 0);
  });
});
