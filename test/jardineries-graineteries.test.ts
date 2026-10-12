import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1760-jardineries-graineteries";
const value = "jardineries graineteries";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(classification: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(classification === undefined ? {} : { [`${namespace} . classification`]: `'${classification}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 1760 — 2026.1 minimum salaries", () => {
  it("starts on 1 July 2026 for the extended agreement and cites official sources", () => {
    assert.equal(version.validFrom, "2026-07-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 2 avril 2026")));
    assert.ok(version.sources.some((source) => source.includes("Arrêté du 11 juin 2026")));
  });

  it("evaluates sourced classifications", () => {
    for (const [classification, expected] of [
      ["1.1", 1823], ["1.2", 1825], ["1.3", 1827], ["2.1", 1830], ["2.2", 1840],
      ["3.1", 1850], ["3.2", 1915], ["4.1", 1960], ["4.2", 1980], ["4.3", 2000],
      ["5.1", 2050], ["5.2", 2120], ["6.1", 2800], ["6.2", 2900], ["7.1", 3400],
      ["7.2", 3600], ["8.1", 3700], ["8.2", 3900],
    ] as const) {
      setSituation(classification);
      assert.equal(minimum(), expected, classification);
    }
  });

  it("prorates the minimum once for part-time work", () => {
    setSituation("4.2", "50%");
    assert.equal(minimum(), 990);
  });

  it("reports classifications outside the grid and missing classifications", () => {
    for (const classification of ["0.1", "1.0", "8.3", "unknown"] as const) {
      setSituation(classification);
      assert.equal(engine.evaluate(`${namespace} . classification hors grille`).nodeValue, true, classification);
      assert.equal(minimum(), 0, classification);
    }
    setSituation(undefined);
    assert.equal(engine.evaluate(`${namespace} . classification hors grille`).nodeValue, true);
    assert.equal(minimum(), 0);
  });

  it("leaves the model inapplicable for another agreement", () => {
    setSituation("1.1");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
