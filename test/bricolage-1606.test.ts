import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1606-bricolage";
const value = "bricolage";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === "2025.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setCoefficient(coefficient: number, quotity = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . coefficient`]: coefficient,
    "salarié . contrat . temps de travail . quotité": quotity,
  });
}

function minimum() {
  return engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
}

describe("IDCC 1606 — 2025.1 salary minimums and payroll audit", () => {
  it("uses the official 1 July 2025 general effective date", () => {
    assert.equal(version.validFrom, "2025-07-01");
    assert.ok(version.sources.some((source: string) => source.includes("31 mars 2025")));
    assert.ok(version.sources.some((source: string) => source.includes("2 juin 2025")));
  });

  for (const [coefficient, expected] of Object.entries({
    120: 1810,
    140: 1825,
    150: 1837,
    160: 1855,
    190: 1885,
    200: 1945,
    220: 2045,
    250: 2111,
    280: 2250,
    320: 2818,
    400: 2950,
    500: 3305,
    600: 3560,
  })) {
    it(`coefficient ${coefficient} evaluates the sourced monthly minimum`, () => {
      setCoefficient(Number(coefficient));
      assert.equal(minimum(), expected);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setCoefficient(250, "50%");
    assert.equal(minimum(), 1055.5);
  });

  it("marks an unknown coefficient outside the grid", () => {
    setCoefficient(999);
    assert.equal(minimum(), 0);
  });

  it("is isolated from another convention", () => {
    setCoefficient(250);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });

  it("does not redefine payroll-wide endpoints or collide with modele-social", () => {
    assert.equal(Object.keys(extension).some((name) => name.includes("cotisations") || name.includes("prévoyance") || name.includes("santé") || name.includes("formation professionnelle") || name.includes("exonération cotisation AT")), false);
    assert.equal(Object.keys(extension).some((name) => name in modeleSocial), false);
  });
});
