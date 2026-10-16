import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2121-edition";
const value = "édition";
const namespace = `salarié . convention collective . ${value}`;
// Monthly minima of the avenant n° 18 du 26 juin 2026 (KALITEXT000054951908), article 3, hard-coded.
const GRID: readonly [string, number][] = [
  ["E5", 1868], ["E6", 1883], ["E7", 1898], ["E8", 1913], ["E9", 1928],
  ["AM/T 1", 1958], ["AM/T 2", 2025], ["AM/T 3", 2094], ["AM/T 4", 2165],
  ["Cl A", 2241], ["Cl B", 2327], ["C2A", 2494], ["C2 B", 2678],
  ["C3A", 2964], ["C3 B", 3341], ["C4", 3847],
];

describe("IDCC 2121 — edition 2026.2 (effective 1 June 2026)", async () => {
  const versions = COMPILED_VERSIONS[agreement];
  const version = versions?.find((entry) => entry.version === "2026.2");
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  const set = (niveau: string, quota = "100%") =>
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . niveau`]: `'${niveau}'`,
      "salarié . contrat . temps de travail . quotité": quota,
    });
  const minimum = () => {
    const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
    assert.equal(typeof result, "number");
    return Math.round((result as number) * 100) / 100;
  };

  it("applies from 1 June 2026 and cites the extended avenant n° 18 of 26 June 2026", () => {
    assert.equal(version.validFrom, "2026-06-01");
    assert.ok(version.sources.some((s) => s.includes("KALITEXT000054951908")));
    assert.ok(version.sources.some((s) => s.includes("26 juin 2026")));
    assert.ok(version.sources.some((s) => s.includes("7 septembre 2026")));
    assert.ok(versions?.some((v) => v.version === "2026.1" && v.validFrom === "2026-07-01"));
  });

  for (const [niveau, expected] of GRID) {
    it(`returns ${expected} €/month for ${niveau}`, () => {
      set(niveau);
      assert.equal(minimum(), expected);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, false);
    });
  }

  it("prorates once for part-time work", () => {
    set("C3A", "50%");
    assert.equal(minimum(), 1482);
    set("E5", "80%");
    assert.equal(minimum(), 1494.4);
  });

  it("flags the blank categories E4 and C5 and unknown values", () => {
    for (const niveau of ["E4", "C5", "non renseigné"]) {
      set(niveau);
      assert.equal(minimum(), 0, niveau);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true, niveau);
    }
  });
});
