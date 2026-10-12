import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1404-maintenance-distribution-location";
const value = "maintenance distribution location";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = {
  ...choice,
  "une possibilité": [...choice["une possibilité"], value],
} as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const MONTHLY: Record<string, number> = {
  A10: 1851.43,
  A20: 1879.19,
  A30: 1907.42,
  A40: 1936.01,
  A50: 1965.04,
  A60: 2020.06,
  A70: 2076.62,
  A80: 2134.76,
  B10: 2198.81,
  B20: 2297.75,
  B30: 2401.16,
  B40: 2509.2,
  B50: 2622.12,
  B60: 2740.11,
  B70: 2863.42,
  B80: 2992.28,
  C10: 3141.9,
  C20: 3456.1,
  C30: 3974.52,
  C40: 4570.68,
  C50: 5256.27,
  C60: 6044.71,
};

function setSituation(level: string | undefined, quota?: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    ...(quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": quota }),
  });
}

const amount = () => {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
};

const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 1404 — 2026.1 minimum salaries", () => {
  it("is in force from 1 March 2026 and cites the accord and extension order", () => {
    assert.equal(version.validFrom, "2026-03-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 16 du 18 février 2026")));
    assert.ok(version.sources.some((source) => source.includes("TRST2612649A")));
  });

  it("has 22 positions", () => {
    assert.equal(Object.keys(MONTHLY).length, 22);
  });

  for (const [level, monthly] of Object.entries(MONTHLY)) {
    it(`${level}: ${monthly} € a month`, () => {
      setSituation(level);
      assert.equal(amount(), monthly);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("A50", "50%");
    assert.equal(amount(), 982.52);
    setSituation("C20", "80%");
    assert.equal(amount(), 2764.88);
  });

  it("rejects positions outside the grid", () => {
    for (const level of ["A00", "A90", "B10 ", "C70", "a10", "A 10", "non renseigné"]) {
      setSituation(level);
      assert.equal(outOfGrid(), true, level);
      assert.equal(amount(), 0, level);
    }
  });

  it("reports a missing position as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(amount(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("A50");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "niveau hors grille"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
