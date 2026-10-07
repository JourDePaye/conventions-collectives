import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2247-courtage-assurances";
const value = "courtage assurances";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2025.1");
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

/** Annual minimum salaries of the avenant of 19 June 2025, by class. */
const ANNUAL: Record<string, number> = {
  A: 23076,
  B: 24268,
  C: 25784,
  D: 28704,
  E: 32700,
  F: 38803,
  G: 45050,
  H: 55221,
};

const roundToCents = (amount: number) => Math.round((amount + 1e-9) * 100) / 100;

function setSituation(level: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

const amount = () => {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return roundToCents(result as number);
};

const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 2247 — 2025.1 minimum salaries", () => {
  it("is in force from 1 July 2025 and cites the avenant", () => {
    assert.equal(version.validFrom, "2025-07-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant du 19 juin 2025")));
    assert.ok(version.sources.some((source) => source.includes("arrêté du 2 septembre 2025")));
  });

  for (const [level, annual] of Object.entries(ANNUAL)) {
    it(`class ${level}: ${annual} € a year, a thirteenth a month`, () => {
      setSituation(level);
      assert.equal(amount(), roundToCents(annual / 13));
      assert.equal(outOfGrid(), false);
    });
  }

  it("gives the monthly amounts quoted in the README", () => {
    for (const [level, monthly] of [["D", 2208], ["A", 1775.08], ["H", 4247.77]] as const) {
      setSituation(level);
      assert.equal(amount(), monthly, level);
    }
  });

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("D", "50%");
    assert.equal(amount(), 1104);
    setSituation("F", "80%");
    assert.equal(amount(), roundToCents((38803 / 13) * 0.8));
  });

  it("rejects classes outside the grid", () => {
    for (const level of ["I", "AA", "a", "1", "non renseigné"]) {
      setSituation(level);
      assert.equal(outOfGrid(), true, level);
      assert.equal(amount(), 0, level);
    }
  });

  it("reports a missing class as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(amount(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("D");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "niveau hors grille"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
