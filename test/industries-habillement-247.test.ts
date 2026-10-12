import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0247-industries-habillement";
const value = "industries habillement";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.2");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(situation: Record<string, string>) {
  engine.setSituation({ "salarié . convention collective": `'${value}'`, ...situation });
}
function amount(rule = "salaire minimum conventionnel") {
  const result = engine.evaluate(`${namespace} . ${rule}`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 247 — industries de l'habillement 2026.1", () => {
  it("is effective in March 2026 and cites the extended S 69 amendment", () => {
    assert.equal(version.validFrom, "2026-03-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° S 69 du 3 mars 2026")));
    assert.ok(version.sources.some((source) => source.includes("JORF n° 0108 du 8 mai 2026")));
  });

  it("calculates the worker monthly minimum and part-time prorating", () => {
    setSituation({ [`${namespace} . annexe`]: "'ouvriers'", [`${namespace} . niveau`]: "'I.1'" });
    assert.equal(amount(), 1833);
    setSituation({ [`${namespace} . annexe`]: "'ouvriers'", [`${namespace} . niveau`]: "'III.2'", "salarié . contrat . temps de travail . quotité": "50%" });
    assert.equal(amount(), 958.5);
  });

  it("applies employee seniority bands", () => {
    setSituation({ [`${namespace} . annexe`]: "'employés'", [`${namespace} . niveau`]: "'I.1'", [`${namespace} . ancienneté en années`]: "6 an" });
    assert.equal(amount(), 1858);
    setSituation({ [`${namespace} . annexe`]: "'employés'", [`${namespace} . niveau`]: "'III.4'", [`${namespace} . ancienneté en années`]: "15 an" });
    assert.equal(amount(), 2001);
  });

  it("calculates annual cadre minimums without converting them to a monthly guarantee", () => {
    setSituation({ [`${namespace} . annexe`]: "'cadres'", [`${namespace} . niveau`]: "'V.2'" });
    assert.equal(amount("salaire minimum annuel conventionnel"), 35953);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });

  it("rejects an unknown classification and is isolated from another convention", () => {
    setSituation({ [`${namespace} . annexe`]: "'ouvriers'", [`${namespace} . niveau`]: "'VII.1'" });
    assert.equal(amount(), 0);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, null);
  });
});
