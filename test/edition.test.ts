import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2121-edition";
const value = "édition";
const namespace = `salarié . convention collective . ${value}`;
const GRID: readonly [string, number][] = [
  ["E5", 1868], ["E6", 1883], ["E7", 1898], ["E8", 1913], ["E9", 1928],
  ["AM/T 1", 1958], ["AM/T 2", 2025], ["AM/T 3", 2094], ["AM/T 4", 2165],
  ["Cl A", 2241], ["Cl B", 2327], ["C2A", 2494], ["C2 B", 2678],
  ["C3A", 2964], ["C3 B", 3341], ["C4", 3847],
];

async function engineOf() {
  const version = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === "2026.1");
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  return { version, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
}

function setSituation(engine: Engine, niveau: string, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: `'${niveau}'`,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum(engine: Engine): number {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return result as number;
}

describe("IDCC 2121 — edition salary minima", async () => {
  const { version, engine } = await engineOf();

  it("is effective on 1 July 2026 and cites the extended Avenant 18", () => {
    assert.equal(version.validFrom, "2026-07-01");
    assert.ok(version.sources.some((source: string) => source.includes("Avenant n° 18 du 18 juin 2026")));
    assert.ok(version.sources.some((source: string) => source.includes("arrêté du 24 août 2026")));
  });

  for (const [niveau, expected] of GRID) {
    it(`returns ${expected} €/month for ${niveau}`, () => {
      setSituation(engine, niveau);
      assert.equal(minimum(engine), expected);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, false);
    });
  }

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation(engine, "C3A", "50%");
    assert.equal(minimum(engine), 1482);
  });

  it("returns zero and flags an unknown category", () => {
    setSituation(engine, "E4");
    assert.equal(minimum(engine), 0);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
  });

  it("is inapplicable to another collective agreement", () => {
    setSituation(engine, "C3A");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, null);
  });
});
