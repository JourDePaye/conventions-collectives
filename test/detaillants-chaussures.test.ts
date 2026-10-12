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

function setSituation(niveau: string | number | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(niveau === undefined ? {} : { [`${namespace} . niveau`]: typeof niveau === "number" ? niveau : `'${niveau}'` }),
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
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 108 du 9 mars 2026")));
    assert.ok(version.sources.some((source) => source.includes("Arrêté du 11 juin 2026")));
  });

  it("evaluates sourced classifications", () => {
    for (const [niveau, expected] of [[1, 1828], [2, 1838], [3, 1869], [4, 1935], [5, 2033], [6, 2407], [7, 2710], [8, 3732], [9, 4302]] as const) {
      setSituation(niveau);
      assert.equal(minimum(), expected, String(niveau));
    }
  });

  it("prorates the minimum once for part-time work", () => {
    setSituation(3, "50%");
    assert.equal(minimum(), 934.5);
  });

  it("reports classifications outside the grid and missing classifications", () => {
    for (const niveau of ["0", "10", "unknown"]) {
      setSituation(niveau);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true, niveau);
      assert.equal(minimum(), 0, niveau);
    }
    setSituation(undefined);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
    assert.equal(minimum(), 0);
  });

  it("leaves the model inapplicable for another agreement", () => {
    setSituation("1");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
