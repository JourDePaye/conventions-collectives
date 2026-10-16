import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "2336-habitat-logement-accompagnes";
const value = "habitat logement accompagnés";
const ns = `salarié . convention collective . ${value}`;

async function minimum(revision: string, coefficient: number, hours: string, quota = "100%") {
  const version = COMPILED_VERSIONS[id]?.find((v) => v.version === revision);
  assert.ok(version, revision);
  const rules: Record<string, Rule> = { ...modeleSocial, ...(await version.loadRules()) };
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${ns} . coefficient`]: coefficient,
    [`${ns} . temps payé`]: `'${hours}'`,
    "salarié . contrat . statut cadre": "non",
    "salarié . contrat . temps de travail . quotité": quota,
  });
  const result = engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue as number;
  return Math.round(result * 100) / 100;
}

// Avenant n° 70 du 30 septembre 2025, articles 5 and 8: from 1 January 2026,
// point 2,00 / 2,24 EUR, fixed part 887,28 / 979,33 EUR.
describe("IDCC 2336 — PACT ARIM minima at 1 January 2026", () => {
  it("is dated 1 January 2026 and cites avenant n° 70", () => {
    const version = COMPILED_VERSIONS[id]?.find((v) => v.version === "2026.1");
    assert.ok(version);
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((s) => s.includes("KALITEXT000054872078")));
  });

  it("computes fixed part + coefficient x point for 35 hours paid 35 hours", async () => {
    assert.equal(await minimum("2026.1", 0, "35 heures"), 887.28);
    assert.equal(await minimum("2026.1", 300, "35 heures"), 1487.28);
    assert.equal(await minimum("2026.1", 500, "35 heures"), 1887.28);
    assert.equal(await minimum("2026.1", 1000, "35 heures"), 2887.28);
  });

  it("computes fixed part + coefficient x point for 35 hours paid 39 hours", async () => {
    assert.equal(await minimum("2026.1", 0, "39 heures"), 979.33);
    assert.equal(await minimum("2026.1", 300, "39 heures"), 1651.33);
    assert.equal(await minimum("2026.1", 500, "39 heures"), 2099.33);
  });

  it("prorates once for part-time work", async () => {
    assert.equal(await minimum("2026.1", 500, "35 heures", "80%"), 1509.82);
    assert.equal(await minimum("2026.1", 300, "39 heures", "50%"), 825.67);
  });

  it("returns 0 for an unknown paid-hours value", async () => {
    assert.equal(await minimum("2026.1", 500, "37 heures"), 0);
  });

  it("keeps the 2025 values (accord n° 30) in version 2025.1", async () => {
    assert.equal(await minimum("2025.1", 500, "35 heures"), 1875.24);
    assert.equal(await minimum("2025.1", 500, "39 heures"), 2081.56);
  });
});
