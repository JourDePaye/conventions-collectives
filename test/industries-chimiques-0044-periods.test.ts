import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

// Monthly minima for 35 hours read in Légifrance, independently of the YAML:
// accord du 9 décembre 2024 (KALITEXT000051294779) and accord du 3 décembre 2025 (KALITEXT000053721357).
const agreement = "0044-industries-chimiques";
const value = "industries chimiques";
const namespace = `salarié . convention collective . ${value}`;

const COEFFICIENTS = [130, 140, 150, 160, 175, 190, 205, 225, 235, 250, 275, 300, 325, 350, 360, 400, 460, 480, 510, 550, 660, 770, 880];
const GRID_2025 = [1855.01, 1876.03, 1901.57, 1918.55, 1960.99, 1996.61, 2025.42, 2037.65, 2107.68, 2218.4, 2409.8, 2627.46, 2844.95, 3060.98, 3148.16, 3496.73, 4018.32, 4195.6, 4452.57, 4803.65, 5760.04, 6722.25, 7675.85];
const GRID_2026 = [1877.13, 1898.37, 1924.18, 1941.34, 1984.24, 2020.24, 2049.34, 2061.68, 2132.51, 2244.51, 2438.11, 2658.27, 2878.27, 3096.78, 3184.97, 3537.54, 4065.12, 4244.43, 4504.35, 4859.46, 5826.82, 6800.05, 7764.57];

const VERSIONS = {
  "2025.1": { validFrom: "2025-01-01", grid: GRID_2025, health: false },
  "2026.3": { validFrom: "2025-09-01", grid: GRID_2025, health: true },
  "2026.4": { validFrom: "2026-01-01", grid: GRID_2026, health: true },
} as const;

async function engineOf(revision: string) {
  const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === revision);
  assert.ok(version, revision);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  return { version, extension, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
}

function minimum(engine: Engine, coefficient: number | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(coefficient === undefined ? {} : { [`${namespace} . coefficient`]: coefficient }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

/** Version in force on a date, as an application selects it: latest validFrom <= date, then highest revision. */
function inForce(date: string) {
  const list = COMPILED_VERSIONS[agreement]!.filter((entry) => entry.validFrom <= date);
  return list[list.length - 1]!.version;
}

describe("IDCC 44 — periods: 2025 grid, then 2025 grid with health, then 2026 grid with health", () => {
  it("selects the right version for each period", () => {
    assert.equal(inForce("2025-01-01"), "2025.1");
    assert.equal(inForce("2025-08-31"), "2025.1");
    assert.equal(inForce("2025-09-01"), "2026.3");
    assert.equal(inForce("2025-12-31"), "2026.3");
    assert.equal(inForce("2026-01-01"), "2026.6");
    assert.equal(inForce("2026-10-16"), "2026.6");
  });

  for (const [revision, step] of Object.entries(VERSIONS)) {
    describe(revision, async () => {
      const { version, extension, engine } = await engineOf(revision);

      it("records its effective date and source", () => {
        assert.equal(version.validFrom, step.validFrom);
        const id = step.grid === GRID_2025 ? "KALITEXT000051294779" : "KALITEXT000053721357";
        assert.ok(version.sources.some((source) => source.includes(id)));
      });

      for (const [index, coefficient] of COEFFICIENTS.entries()) {
        it(`gives ${step.grid[index]} € for coefficient ${coefficient}`, () => {
          assert.equal(minimum(engine, coefficient), step.grid[index]);
          assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, false);
        });
      }

      it("prorates part-time work once and flags unknown coefficients", () => {
        assert.equal(minimum(engine, 250, "50%"), Math.round(step.grid[9]! * 50) / 100);
        for (const coefficient of [100, 131, 900, undefined]) {
          assert.equal(minimum(engine, coefficient), 0);
          assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
        }
      });

      it(step.health ? "carries the branch health minimum" : "has no health rules", () => {
        assert.equal(`${namespace} . santé 2025` in extension, step.health);
        if (!step.health) return;
        engine.setSituation({
          "salarié . convention collective": `'${value}'`,
          [`${namespace} . coefficient`]: 250,
          "salarié . cotisations . assiette": "3000 €/mois",
          "plafond sécurité sociale": "4000 €/mois",
          "salarié . contrat . statut cadre": "non",
        });
        assert.equal(engine.evaluate(`${namespace} . santé 2025 . montant contractuel`).nodeValue, 60);
        assert.equal(engine.evaluate("salarié . cotisations . prévoyances . santé . employeur").nodeValue, 30);
        engine.setSituation({
          "salarié . convention collective": `'${value}'`,
          [`${namespace} . coefficient`]: 250,
          "plafond sécurité sociale": "4000 €/mois",
          "salarié . régimes spécifiques . alsace moselle": "oui",
        });
        assert.equal(engine.evaluate(`${namespace} . santé 2025 . montant contractuel`).nodeValue, 32.8);
      });
    });
  }

  it("keeps hard-coded boundary amounts", async () => {
    assert.equal(minimum((await engineOf("2026.3")).engine, 130), 1855.01);
    assert.equal(minimum((await engineOf("2026.3")).engine, 880), 7675.85);
    assert.equal(minimum((await engineOf("2026.4")).engine, 130), 1877.13);
    assert.equal(minimum((await engineOf("2026.4")).engine, 880), 7764.57);
  });
});
