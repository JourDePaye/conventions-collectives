import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "3090-spectacle-vivant-prive";
const ns = "salarié . convention collective . spectacle vivant privé";

// Avenant du 21 juillet 2025 (KALITEXT000053721738), grille emplois techniques, 151,67 h.
const technical = [
  ["cadres groupe 2", 2658.78],
  ["cadres groupe 3", 2361.5],
  ["agents de maîtrise", 2115.8],
  ["employés qualifiés groupe 1", 1906.49],
  ["employés qualifiés groupe 2", 1821.56],
  ["employés", 1801.8],
] as const;

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((candidate) => candidate.version === "2025.3");
  assert.ok(version, "IDCC 3090 2025.3 must be exported");
  assert.equal(version.validFrom, "2025-09-01");
  assert.ok(version.sources.some((source) => source.includes("KALITEXT000053721738")));
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "spectacle vivant privé"] } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

const situation = (extra: Record<string, string>, quotité = "100%") => ({
  salarié: "oui",
  dirigeant: "non",
  "salarié . convention collective": "'spectacle vivant privé'",
  "salarié . contrat . temps de travail . quotité": quotité,
  ...extra,
});

describe("IDCC 3090 — 2025.3", () => {
  it("shares its validFrom with 2025.4", () => {
    const versions = COMPILED_VERSIONS[id] ?? [];
    const dates = new Set(versions.filter((v) => ["2025.3", "2025.4"].includes(v.version)).map((v) => v.validFrom));
    assert.deepEqual([...dates], ["2025-09-01"]);
  });

  for (const [category, expected] of technical) {
    it(`technical ${category}: ${expected} €`, async () => {
      const engine = await makeEngine();
      engine.setSituation(situation({ [`${ns} . catégorie technique`]: `'${category}'` }));
      assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, expected);
      assert.equal(engine.evaluate(`${ns} . classification hors grille`).nodeValue, false);
    });
  }

  it("prorates the technical cadres groupe 3 minimum for part-time work", async () => {
    const engine = await makeEngine();
    engine.setSituation(situation({ [`${ns} . catégorie technique`]: "'cadres groupe 3'" }, "50%"));
    assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, 1180.75);
  });

  it("keeps the administrative grid: lowest, middle, highest", async () => {
    const engine = await makeEngine();
    for (const [category, échelon, expected] of [
      ["employés", "1", 1801.8],
      ["agents de maîtrise", "3", 2256.89],
      ["cadres groupe 1", "1", 3578.18],
      ["cadres groupe 3", "5", 2952.77],
    ] as const) {
      engine.setSituation(situation({ [`${ns} . catégorie administrative`]: `'${category}'`, [`${ns} . échelon`]: `'${échelon}'` }));
      assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, expected, category);
    }
  });

  it("flags a technical category absent from the grid (cadres groupe 1)", async () => {
    const engine = await makeEngine();
    engine.setSituation(situation({ [`${ns} . catégorie technique`]: "'cadres groupe 1'" }));
    assert.equal(engine.evaluate(`${ns} . classification hors grille`).nodeValue, true);
    assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, null);
  });
});
