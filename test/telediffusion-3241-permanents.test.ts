/**
 * IDCC 3241, versions 2026.3 and 2026.4: the monthly minimums of the permanent employees. Expected
 * amounts come from the barème of the accord of 15 December 2023 (from 1 February 2024,
 * KALITEXT000049271441) and annex 1 of the accord of 11 May 2026 (from 1 June 2026,
 * KALITEXT000054880861), independently of the YAML.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3241-telediffusion";
const value = "télédiffusion";
const namespace = `salarié . convention collective . ${value}`;

async function engineOf(versionNumber: string) {
  const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === versionNumber);
  assert.ok(version, versionNumber);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, await version.loadRules());
  return { version, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
}

const LEVELS = ["I-A", "I-B", "I-C", "II-A", "II-B", "II-C", "III-A", "III-B", "III-C", "IV-A", "IV-B", "IV-C", "V-A", "V-B", "V-C", "VI"];

/** Barème au 1er février 2024: fewer than 50 employees, then 50 or more or a group. */
const FEBRUARY_2024 = {
  small: [1802.5, 1812.8, 1828.25, 1843.7, 1874.6, 1895.2, 1931.25, 1982.75, 2034.25, 2250.55, 2332.95, 2441.1, 3023.05, 3234.2, 3450.5, 3713.15],
  large: [1802.5, 1817.95, 1874.6, 1982.75, 2096.05, 2204.2, 2250.55, 2302.05, 2358.7, 2441.1, 2549.25, 2652.25, 3079.7, 3393.85, 3821.3, 4243.6],
};

/** Annex 1 of the accord of 11 May 2026, from 1 June 2026. */
const JUNE_2026 = {
  small: [1870, 1875, 1880, 1890, 1908.49, 1929.47, 1966.17, 2018.6, 2071.03, 2291.24, 2375.13, 2485.24, 3077.71, 3292.67, 3512.89, 3780.28],
  large: [1870, 1875, 1920, 2018.6, 2133.95, 2244.05, 2291.24, 2343.67, 2401.35, 2485.24, 2595.34, 2700.2, 3135.38, 3455.21, 3890.39, 4320.32],
};

function minimum(engine: Engine, classification: string, { headcount = 10, group = false, quota = "100%" } = {}) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . classification`]: `'${classification}'`,
    [`${namespace} . entreprise d'un groupe`]: group ? "oui" : "non",
    "entreprise . salariés . effectif": headcount,
    "salarié . contrat . temps de travail . quotité": quota,
  });
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  return typeof result === "number" ? Math.round(result * 100) / 100 : result;
}

for (const [versionNumber, grid, validFrom, extension] of [
  ["2026.3", FEBRUARY_2024, "2026-01-01", "2026-01-01"],
  ["2026.4", JUNE_2026, "2026-06-01", "2026-07-24"],
] as const) {
  describe(`IDCC 3241 — ${versionNumber}, monthly minimums of the permanent employees`, async () => {
    const { version, engine } = await engineOf(versionNumber);

    it(`applies from ${validFrom}, to every employer from ${extension}`, () => {
      assert.equal(version.validFrom, validFrom);
      assert.equal(version.extension, extension);
    });

    it("applies the grid of article 22.1 below 50 employees", () => {
      LEVELS.forEach((level, i) => assert.equal(minimum(engine, level, { headcount: 49 }), grid.small[i], level));
    });

    it("applies the grid of article 22.2 from 50 employees, or in a group", () => {
      LEVELS.forEach((level, i) => {
        assert.equal(minimum(engine, level, { headcount: 50 }), grid.large[i], level);
        assert.equal(minimum(engine, level, { headcount: 10, group: true }), grid.large[i], level);
      });
    });

    it("prorates by the working time and flags a classification outside the grid", () => {
      assert.equal(minimum(engine, "VI", { headcount: 49, quota: "50%" }), Math.round(grid.small[15]! * 50) / 100);
      for (const classification of ["VI-A", "VII", "non renseigné"]) {
        assert.equal(minimum(engine, classification), 0, classification);
        assert.equal(engine.evaluate(`${namespace} . classification hors grille`).nodeValue, true, classification);
      }
      minimum(engine, "III-B");
      assert.equal(engine.evaluate(`${namespace} . classification hors grille`).nodeValue, false);
    });
  });
}

describe("IDCC 3241 — 2026.4 keeps the daily minimums of the CDDU", async () => {
  const { engine } = await engineOf("2026.4");
  it("5-1, column M1: 180,16 €", () => {
    engine.setSituation({ "salarié . convention collective": `'${value}'`, [`${namespace} . niveau`]: "'5-1'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum journalier`).nodeValue, 180.16);
  });
});
