import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

// Amounts read in the accords du 4 mars 2025, independently of the YAML:
// grille générale KALITEXT000051694872, grille ouvriers KALITEXT000051694880.
const agreement = "1557-commerce-articles-sports-loisirs";
const value = "commerce articles sports loisirs";
const namespace = `salarié . convention collective . ${value}`;

const GRID: Record<string, number> = {
  "130": 1801.8, "140": 1834, "150": 1840, "160": 1859, "170": 1900, "180": 1902, "190": 1908, "200": 1921,
  "220": 2034, "240": 2086, "250": 2152, "280": 2276,
  "320": 2559, "350": 2681, "380": 2846, "390": 2960, "420": 3141, "450": 3414, "500": 3649, "550": 3909,
  O1: 1801.8, O2: 1840, O3: 1874, O4: 1914,
};

const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2025.2");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function evaluate(classification: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(classification === undefined ? {} : { [`${namespace} . classification`]: `'${classification}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
  const amount = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof amount, "number");
  return {
    amount: Math.round((amount as number) * 100) / 100,
    outOfGrid: engine.evaluate(`${namespace} . classification hors grille`).nodeValue,
  };
}

describe("IDCC 1557 — 2025.2 corrected grids of the accords du 4 mars 2025", () => {
  it("keeps the effective date and cites the resolving general-grid text", () => {
    assert.equal(version.validFrom, "2025-03-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000051694872")));
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000051694880")));
    assert.ok(!version.sources.some((source) => source.includes("KALITEXT000051694875")));
  });

  it("selects 2025.2 over 2025.1 for the same effective date", () => {
    const entries = COMPILED_VERSIONS[agreement]!.filter((entry) => entry.validFrom === "2025-03-01");
    assert.deepEqual(entries.map((entry) => entry.version).sort(), ["2025.1", "2025.2"]);
  });

  for (const [classification, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € for classification ${classification}`, () => {
      assert.deepEqual(evaluate(classification), { amount: expected, outOfGrid: false });
    });
  }

  it("prorates part-time work once", () => {
    assert.equal(evaluate("130", "50%").amount, 900.9);
    assert.equal(evaluate("550", "80%").amount, 3127.2);
    assert.equal(evaluate("O3", "80%").amount, 1499.2);
  });

  it("flags unknown and missing classifications", () => {
    for (const classification of ["135", "560", "O5", "o1", undefined]) {
      assert.deepEqual(evaluate(classification), { amount: 0, outOfGrid: true });
    }
  });
});
