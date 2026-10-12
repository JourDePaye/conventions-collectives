import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1483-commerce-detail-habillement-textiles";
const value = "commerce de détail habillement";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.2");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = {
  ...choice,
  "une possibilité": [...choice["une possibilité"], value],
} as Rule;
Object.assign(rules, extension);
const makeEngine = () => new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
let engine = makeEngine();

function setSituation(level: string, years = 0, department = "Mayotte", quota = "100%") {
  engine = makeEngine();
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: `'${level}'`,
    "salarié . ancienneté": `${years} an`,
    "salarié . contrat . temps de travail . quotité": quota,
    "établissement . commune . département": `'${department}'`,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 1483 — 2026.2 Mayotte salary minima", () => {
  it("starts on 1 October 2026 and cites the Mayotte extension", () => {
    assert.equal(version.validFrom, "2026-10-01");
    assert.ok(version.sources.some((source) => source.includes("Accord de branche du 12 juin 2026")));
    assert.ok(version.sources.some((source) => source.includes("22 septembre 2026")));
  });

  it("uses the Mayotte employee and supervisor grids", () => {
    setSituation("1");
    assert.equal(minimum(), 1450);
    setSituation("A2");
    assert.equal(minimum(), 1884);
    setSituation("D");
    assert.equal(minimum(), 3181);
  });

  it("uses the Mayotte seniority minima for B, C and D", () => {
    setSituation("B", 3);
    assert.equal(minimum(), 2251);
    setSituation("C", 9);
    assert.equal(minimum(), 3102);
    setSituation("D", 18);
    assert.equal(minimum(), 3306);
  });

  it("keeps the national grid outside Mayotte", () => {
    setSituation("3", 6, "La Réunion");
    assert.equal(minimum(), 1893);
    setSituation("B", 3, "La Réunion");
    assert.equal(minimum(), 2629);
  });

  it("still prorates the Mayotte minimum once for part-time work", () => {
    setSituation("3", 6, "Mayotte", "50%");
    assert.equal(minimum(), 757.5);
  });
});
