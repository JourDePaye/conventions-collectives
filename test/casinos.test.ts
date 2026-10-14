import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2257-casinos";
const value = "casinos";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2025.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const GRID: Record<number, number> = {
  100: 1818,
  105: 1829,
  110: 1839,
  120: 1864,
  130: 1879,
  140: 1991,
  150: 2133,
  160: 2276,
  170: 2418,
  175: 2516,
  180: 2578,
  190: 2713,
  200: 2878,
};

function setSituation(indice: number | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(indice === undefined ? {} : { [`${namespace} . indice`]: indice }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 2257 — 2025.1 minimum salaries and payroll isolation", () => {
  it("records the effective date and official salary source", () => {
    assert.equal(version.validFrom, "2025-05-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000051447213")));
    assert.ok(version.sources.some((source) => source.includes("9 avril 2025")));
  });

  for (const [indice, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for index ${indice}`, () => {
      setSituation(Number(indice));
      assert.equal(minimum(), expected);
      assert.equal(engine.evaluate(`${namespace} . indice hors grille`).nodeValue, false);
    });
  }

  it("prorates once for part-time work", () => {
    setSituation(140, "50%");
    assert.equal(minimum(), 995.5);
    setSituation(200, "80%");
    assert.equal(minimum(), 2302.4);
  });

  it("rejects missing and unknown indices", () => {
    for (const indice of [115, 201]) {
      setSituation(indice);
      assert.equal(engine.evaluate(`${namespace} . indice hors grille`).nodeValue, true);
      assert.equal(minimum(), 0);
    }
    setSituation(undefined);
    assert.equal(engine.evaluate(`${namespace} . indice hors grille`).nodeValue, true);
    assert.equal(minimum(), 0);
  });

  it("does not alter standard payroll rules or apply to another agreement", () => {
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
      assert.ok(!(name in modeleSocial), `Duplicate modele-social rule: ${name}`);
    }
    setSituation(130);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
