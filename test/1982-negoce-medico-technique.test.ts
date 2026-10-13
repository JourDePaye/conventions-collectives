import assert from "node:assert/strict";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { describe, it } from "node:test";
import { COMPILED_VERSIONS } from "../src/index.ts";

const model = "1982-negoce-medico-technique";
const value = "négoce médico-technique";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[model]?.find((entry) => entry.version === "2026.1");
assert.ok(version, "IDCC 1982 version 2026.1 must be compiled");
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = {
  ...choice,
  "une possibilité": [...new Set([...choice["une possibilité"], value])],
} as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const MONTHLY: Record<string, number> = {
  E1: 1837,
  E2: 1857,
  E3: 1879,
  E4: 1909,
  TAM5: 1967,
  TAM6: 2050,
  TAM7: 2174,
  TAM8: 2278,
  C9: 2536,
  C10: 2744,
  C11: 3074,
  C12: 3365,
  C13: 3727,
  D14: 4141,
};

function setSituation(level: string | undefined, quota?: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    ...(quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": quota }),
  });
}

function amount() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 1982 — 2026.1 négoce médico-technique", () => {
  it("is effective from 1 June 2026 and cites the extended salary amendment", () => {
    assert.equal(version.validFrom, "2026-06-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 2 du 20 février 2026")));
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000054177346")));
    assert.ok(version.sources.some((source) => source.includes("JORFTEXT000054149339")));
  });

  for (const [level, monthly] of Object.entries(MONTHLY)) {
    it(`${level}: ${monthly} € per month`, () => {
      setSituation(level);
      assert.equal(amount(), monthly);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, false);
    });
  }

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("TAM7", "60%");
    assert.equal(amount(), 1304.4);
  });

  it("rejects levels outside the 2026 grid and reports missing input", () => {
    for (const level of ["E0", "TAM4", "C8", "D15"]) {
      setSituation(level);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true, level);
      assert.equal(amount(), 0, level);
    }
    setSituation(undefined);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
    assert.equal(amount(), 0);
  });

  it("is inapplicable outside the agreement", () => {
    setSituation("E1");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, null);
  });
});
