import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3231-metallurgie-jura";
const value = "métallurgie jura";
const namespace = `salarié . convention collective . ${value}`;

async function engineOf() {
  const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2023.1");
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  return { version, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
}

function setSituation(engine: Engine, coefficient: number, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . coefficient`]: coefficient,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

describe("IDCC 3231 — métallurgie du Jura 2023.1", async () => {
  const { version, engine } = await engineOf();

  it("uses the sourced effective date and extension", () => {
    assert.equal(version.validFrom, "2023-09-08");
    assert.ok(version.sources.some((source) => source.includes("8 septembre 2023")));
    assert.ok(version.sources.some((source) => source.includes("13 novembre 2023")));
  });

  it("returns the annual guarantee for coefficient 240", () => {
    setSituation(engine, 240);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, 22970);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, false);
  });

  it("keeps the annual comparison and prorates once", () => {
    setSituation(engine, 395, "50%");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, 18054);
  });

  it("flags an unknown coefficient", () => {
    setSituation(engine, 241);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, 0);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
  });

  it("is isolated from another agreement", () => {
    setSituation(engine, 240);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, null);
  });
});
