import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

// Avenant n° 67 du 1er juillet 2025 (KALITEXT000052326768), article 16.2: minimum = coefficient
// × point + base; article 7.2: base 1 218 € and point 2,03 €. Accord n° 30 (KALITEXT000051163225):
// PACT ARIM 880,24 € + 1,99 € (35 h paid 35 h), 971,56 € + 2,22 € (paid 39 h). Avenant n° 70
// (KALITEXT000054872078), articles 5 and 6: HLA 1 227,74 € + 2,05 €, PACT ARIM 887,28 € + 2,00 €
// and 979,33 € + 2,24 €.
const id = "2336-habitat-logement-accompagnes";
const value = "habitat logement accompagnés";
const ns = `salarié . convention collective . ${value}`;

async function engineOf(revision: string) {
  const version = COMPILED_VERSIONS[id]?.find((entry) => entry.version === revision);
  assert.ok(version, revision);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, await version.loadRules());
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  const evaluate = (name: string, system: string, coefficient: number, extra: Record<string, string> = {}) => {
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${ns} . système de rémunération`]: `'${system}'`,
      [`${ns} . coefficient`]: `${coefficient} coefficient`,
      date: "01/06/2026",
      ...extra,
    });
    const result = engine.evaluate(`${ns} . ${name}`).nodeValue;
    return typeof result === "number" ? Math.round(result * 100) / 100 : result;
  };
  return { version, evaluate };
}

describe("IDCC 2336 — 2026.2 (avenant n° 67)", async () => {
  const { version, evaluate } = await engineOf("2026.2");

  it("is in force from 21 December 2025, the day after the extension", () => {
    assert.equal(version.validFrom, "2025-12-21");
    assert.equal(version.extension, "2025-12-20");
  });

  it("computes the HLA and PACT ARIM minimums", () => {
    // 300 × 2,03 + 1 218 = 1 827 €; 880,24 + 300 × 1,99 = 1 477,24 €; 971,56 + 300 × 2,22 = 1 637,56 €.
    assert.equal(evaluate("salaire minimum conventionnel", "HLA", 300), 1827);
    assert.equal(evaluate("salaire minimum conventionnel", "PACT ARIM 35 heures payées 35", 300), 1477.24);
    assert.equal(evaluate("salaire minimum conventionnel", "PACT ARIM 35 heures payées 39", 300), 1637.56);
  });
});

describe("IDCC 2336 — 2026.3 (avenant n° 70)", async () => {
  const { version, evaluate } = await engineOf("2026.3");

  it("is in force from 1 January 2026, extended on 10 July 2026", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.equal(version.extension, "2026-07-10");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000054872078")));
  });

  it("computes the HLA and PACT ARIM minimums, prorated by working time", () => {
    // 300 × 2,05 + 1 227,74 = 1 842,74 €; 887,28 + 600 = 1 487,28 €; 979,33 + 672 = 1 651,33 €.
    assert.equal(evaluate("salaire minimum conventionnel", "HLA", 300), 1842.74);
    assert.equal(evaluate("salaire minimum conventionnel", "PACT ARIM 35 heures payées 35", 300), 1487.28);
    assert.equal(evaluate("salaire minimum conventionnel", "PACT ARIM 35 heures payées 39", 300), 1651.33);
    assert.equal(
      evaluate("salaire minimum conventionnel", "HLA", 300, { "salarié . contrat . temps de travail . quotité": "50%" }),
      921.37,
    );
  });

  it("computes no minimum for the former FSJT system", () => {
    assert.equal(evaluate("salaire minimum conventionnel", "FSJT", 0), 0);
    assert.equal(evaluate("classification hors grille", "FSJT", 0), false);
    assert.equal(evaluate("grille applicable", "FSJT", 0), false);
  });

  it("requires a coefficient where a minimum is computed", () => {
    assert.equal(evaluate("classification hors grille", "HLA", 0), true);
    assert.equal(evaluate("classification hors grille", "HLA", 300), false);
  });

  it("refuses the former systems from 21 September 2026", () => {
    for (const system of ["PACT ARIM 35 heures payées 35", "PACT ARIM 35 heures payées 39", "FSJT"]) {
      assert.equal(evaluate("classification hors grille", system, 300, { date: "20/09/2026" }), false, system);
      assert.equal(evaluate("classification hors grille", system, 300, { date: "01/10/2026" }), true, system);
    }
    assert.equal(evaluate("classification hors grille", "HLA", 300, { date: "01/10/2026" }), false);
  });
});
