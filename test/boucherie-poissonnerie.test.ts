import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3254-boucherie-poissonnerie";
const value = "boucherie poissonnerie";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const GRID: Record<string, number> = { "I-A": 1938, "II-C": 2037, "III-C": 2293, "IV-D": 2525, V: 2740, "VI-C": 3368, "VII-B": 3933 };

function setSituation(level: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 3254 — 2026.1 minimum salaries and payroll isolation", () => {
  it("records the effective date and official salary sources", () => {
    assert.equal(version.validFrom, "2026-06-01");
    assert.ok(version.sources.some((source) => source.includes("avenant n° 9-B")));
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000054254741")));
    assert.ok(version.sources.some((source) => source.includes("Arrêté du 4 mai 2026")));
  });

  for (const [level, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for level ${level}`, () => {
      setSituation(level);
      assert.equal(minimum(), expected);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, false);
    });
  }

  it("prorates once for part-time work", () => {
    setSituation("IV-D", "50%");
    assert.equal(minimum(), 1262.5);
    setSituation("VII-B", "80%");
    assert.equal(minimum(), 3146.4);
  });

  it("rejects missing and unknown levels", () => {
    for (const level of ["0", "VIII-A", "non renseigné"]) {
      setSituation(level);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true, level);
      assert.equal(minimum(), 0, level);
    }
    setSituation(undefined);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
    assert.equal(minimum(), 0);
  });

  it("does not alter standard payroll rules or apply to another agreement", () => {
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
      assert.ok(!(name in modeleSocial), `Duplicate modele-social rule: ${name}`);
    }
    setSituation("II-C");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
