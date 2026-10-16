import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3250-commissaires-justice";
const value = "commissaires de justice et sociétés de ventes volontaires";
const namespace = `salarié . convention collective . ${value}`;

async function engineOf(versionName: string) {
  const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === versionName);
  assert.ok(version, versionName);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  return { version, extension, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
}

// Amounts copied from the annex of each avenant (151.67 hours, euros a month).
const GRIDS: Record<string, Record<string, number>> = {
  // Avenant n° 8 du 19 décembre 2024, from 1 January 2025 (point 8.65 EUR).
  "2025.1": {
    "I-214": 1851.1, "I-215": 1859.29, "I-270": 2309.74, "I-345": 2923.99, "I-410": 3456.34,
    "II-214": 1851.1, "II-221": 1908.43, "II-296": 2522.68, "II-365": 3087.79, "II-456": 3833.08,
    "IIbis-217": 1875.67, "IIbis-230": 1982.14,
    "III-393": 3317.11, "III-470": 3947.74, "III-542": 4537.42,
  },
  // Avenant n° 12 du 16 mars 2026, from 1 April 2026 (point 8.87 EUR).
  "2026.1": {
    "I-214": 1898.18, "I-215": 1906.37, "I-219": 1939.13, "I-223": 1971.89, "I-270": 2356.82, "I-283": 2463.29,
    "I-299": 2594.33, "I-300": 2602.52, "I-302": 2618.9, "I-317": 2741.75, "I-331": 2856.41, "I-345": 2971.07,
    "I-360": 3093.92, "I-410": 3503.42,
    "II-214": 1898.18, "II-221": 1955.51, "II-231": 2037.41, "II-240": 2111.12, "II-246": 2160.26, "II-258": 2258.54,
    "II-250": 2193.02, "II-270": 2356.82, "II-296": 2569.76, "II-302": 2618.9, "II-315": 2725.37, "II-317": 2741.75,
    "II-365": 3134.87, "II-400": 3421.52, "II-447": 3806.45, "II-456": 3880.16,
    "IIbis-217": 1922.75, "IIbis-230": 2029.22,
    "III-393": 3364.19, "III-403": 3446.09, "III-441": 3757.31, "III-460": 3912.92, "III-542": 4584.5, "III-470": 3994.82,
  },
};

function evaluate(engine: Engine, classification: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(classification === undefined ? {} : { [`${namespace} . classification`]: `'${classification}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}
function minimum(engine: Engine) {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}
const outside = (engine: Engine) => engine.evaluate(`${namespace} . classification hors grille`).nodeValue;

describe("IDCC 3250 — minimum salaries", () => {
  it("selects versions on their legal effective dates", () => {
    const versions = COMPILED_VERSIONS[agreement];
    assert.ok(versions);
    assert.equal(versions.find((v) => v.version === "2025.1")?.validFrom, "2025-01-01");
    const v2026 = versions.find((v) => v.version === "2026.1");
    assert.equal(v2026?.validFrom, "2026-04-01");
    assert.ok(v2026.sources.some((s) => s.includes("KALITEXT000054177556") && s.includes("Avenant n° 12 du 16 mars 2026")));
    assert.ok(v2026.sources.some((s) => s.includes("arrêté du 18 mai 2026")));
    assert.ok(versions.find((v) => v.version === "2025.1")?.sources.some((s) => s.includes("KALITEXT000051352624")));
  });

  for (const [versionName, grid] of Object.entries(GRIDS)) {
    describe(versionName, () => {
      for (const [key, expected] of Object.entries(grid)) {
        it(`gives ${expected} € a month for ${key}`, async () => {
          const { engine } = await engineOf(versionName);
          evaluate(engine, key);
          assert.equal(minimum(engine), expected);
          assert.equal(outside(engine), false);
        });
      }
      it("prorates the monthly minimum once for part-time work", async () => {
        const { engine } = await engineOf(versionName);
        evaluate(engine, "II-296", "50%");
        assert.equal(minimum(engine), Math.round(grid["II-296"]! * 50) / 100);
      });
      it("flags classifications outside the grid", async () => {
        const { engine } = await engineOf(versionName);
        for (const key of ["I-1", "II-999", "III-300", "IIbis-215", "IV-410", "214", "non renseigné"]) {
          evaluate(engine, key);
          assert.equal(outside(engine), true, key);
          assert.equal(minimum(engine), 0, key);
        }
        evaluate(engine, undefined);
        assert.equal(outside(engine), true);
        assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, false);
      });
    });
  }

  it("prorates 2026.1 at 80 % hard-coded", async () => {
    const { engine } = await engineOf("2026.1");
    evaluate(engine, "III-470", "80%");
    assert.equal(minimum(engine), 3195.86);
  });

  it("stays isolated from modele-social and other agreements", async () => {
    const { engine, extension } = await engineOf("2026.1");
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
      assert.ok(!(name in modeleSocial), `Duplicate modele-social rule: ${name}`);
    }
    evaluate(engine, "II-296");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
