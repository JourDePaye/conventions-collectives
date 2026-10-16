import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "1431-optique-lunetterie-detail";
const ns = "salarié . convention collective . optique-lunetterie de détail";

// Accord du 14 septembre 2023 (KALITEXT000048638289), article 2.
const nonHealth: Record<string, number> = {
  "1.1": 1830, "1.2": 1850, "1.3": 1870, "1.4": 1900, "1.5": 1930, "1.6": 1950,
  "2.1": 2000, "2.2": 2050, "2.3": 2100, "2.4": 2150,
  "3.1": 2250, "3.2": 2315, "3.3": 2455, "3.4": 2850, "3.5": 3115, "3.6": 3400,
};
const health: Record<string, number> = { A: 1935, B: 2010, C: 2060, D: 2135, E: 2195, F: 2300, G: 2400, H: 2500, I: 3000, J: 3400, K: 3700 };

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((candidate) => candidate.version === "2024.3");
  assert.ok(version, "IDCC 1431 2024.3 must be exported");
  assert.equal(version.validFrom, "2024-01-01");
  assert.ok(version.sources.some((source) => source.includes("KALITEXT000048638289")));
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "optique-lunetterie de détail"] } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

const situation = (classification: string, coefficient: string, quotité = "100%") => ({
  salarié: "oui",
  dirigeant: "non",
  "salarié . convention collective": "'optique-lunetterie de détail'",
  [`${ns} . classification`]: `'${classification}'`,
  [`${ns} . coefficient`]: `'${coefficient}'`,
  "salarié . contrat . temps de travail . quotité": quotité,
});

describe("IDCC 1431 — 2024.3", () => {
  it("supersedes 2024.2 for the same validFrom", () => {
    const dates = (COMPILED_VERSIONS[id] ?? []).filter((v) => ["2024.2", "2024.3"].includes(v.version)).map((v) => v.validFrom);
    assert.deepEqual(dates, ["2024-01-01", "2024-01-01"]);
  });

  it("calculates every non-health-professional level 1.1 to 3.6", async () => {
    const engine = await makeEngine();
    for (const [level, expected] of Object.entries(nonHealth)) {
      engine.setSituation(situation("nouvelle", level));
      assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, expected, level);
      assert.equal(engine.evaluate(`${ns} . coefficient hors grille`).nodeValue, false, level);
    }
  });

  it("keeps the health-professional levels A to K", async () => {
    const engine = await makeEngine();
    for (const [level, expected] of Object.entries(health)) {
      engine.setSituation(situation("nouvelle", level));
      assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, expected, level);
    }
  });

  it("keeps the old classification grid: lowest, middle, highest", async () => {
    const engine = await makeEngine();
    for (const [coefficient, expected] of [["110", 1830], ["220", 2150], ["380", 3400]] as const) {
      engine.setSituation(situation("ancienne", coefficient));
      assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, expected, coefficient);
    }
  });

  it("prorates a level 2.2 minimum for part-time work", async () => {
    const engine = await makeEngine();
    engine.setSituation(situation("nouvelle", "2.2", "50%"));
    assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, 1025);
  });

  it("flags levels absent from the grid", async () => {
    const engine = await makeEngine();
    for (const [classification, coefficient] of [["nouvelle", "3.7"], ["nouvelle", "L"], ["ancienne", "1.1"], ["nouvelle", "non renseigné"]] as const) {
      engine.setSituation(situation(classification, coefficient));
      assert.equal(engine.evaluate(`${ns} . coefficient hors grille`).nodeValue, true, `${classification} ${coefficient}`);
      assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, null);
    }
  });

  it("keeps the non-cadre pension plan of 2024.2", async () => {
    const engine = await makeEngine();
    engine.setSituation({ ...situation("nouvelle", "1.1"), "salarié . contrat . salaire brut": "5000 €/mois", "salarié . contrat . statut cadre": "non" });
    assert.equal(engine.evaluate(`${ns} . prévoyance . employeur`).nodeValue, 16.8);
    assert.equal(engine.evaluate(`${ns} . prévoyance . salarié`).nodeValue, 11.2);
  });
});
