import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0733-detaillants-chaussures";
const value = "détaillants chaussures";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(niveau: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(niveau === undefined ? {} : { [`${namespace} . niveau`]: `'${niveau}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 733 — 2026.1 minimum salaries", () => {
  it("starts on 1 July 2026 and cites the official agreement and extension", () => {
    assert.equal(version.validFrom, "2026-07-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 108 du 8 avril 2026")));
    assert.ok(version.sources.some((source) => source.includes("Arrêté du 17 juin 2026")));
    assert.ok(version.sources.some((source) => source.includes("TRET2614064A")));
  });

  it("evaluates sourced classifications", () => {
    for (const [niveau, expected] of [["I-A", 1831], ["II-A", 1867], ["III-A", 1940], ["IV-A", 2293], ["V-A", 3197]] as const) {
      setSituation(niveau);
      assert.equal(minimum(), expected, niveau);
    }
  });

  it("prorates the minimum once for part-time work", () => {
    setSituation("III-A", "50%");
    assert.equal(minimum(), 970);
  });

  it("reports classifications outside the grid and missing classifications", () => {
    for (const niveau of ["I-B", "V-B", "unknown"]) {
      setSituation(niveau);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true, niveau);
      assert.equal(minimum(), 0, niveau);
    }
    setSituation(undefined);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
    assert.equal(minimum(), 0);
  });

  it("leaves the model inapplicable for another agreement", () => {
    setSituation("I-A");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
