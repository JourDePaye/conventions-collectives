import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1480-journalistes";
const value = "journalistes";
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

const MONTHLY: Record<string, number> = {
  "1": 1905.12,
  "2": 2105.71,
  "3": 2299.90,
  "4": 2506.54,
  "5": 2752.38,
  "6": 3010.45,
  "7": 3252.50,
  "8": 3612.64,
};

function setSituation(group: string | undefined, quota?: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(group === undefined ? {} : { [`${namespace} . groupe`]: `'${group}'` }),
    ...(quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": quota }),
  });
}

const amount = () => {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
};

const outOfGrid = () => engine.evaluate(`${namespace} . groupe hors grille`).nodeValue;

describe("IDCC 1480 — 2025.1 minimum salaries", () => {
  it("cites the amendment and extension order", () => {
    assert.equal(version.validFrom, "2025-09-01");
    assert.ok(version.sources.some((source) => source.includes("KALIARTI000052299406")));
    assert.ok(version.sources.some((source) => source.includes("JORFTEXT000052260481")));
  });

  for (const [group, monthly] of Object.entries(MONTHLY)) {
    it(`group ${group}: ${monthly} € a month`, () => {
      setSituation(group);
      assert.equal(amount(), monthly);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("4", "50%");
    assert.equal(amount(), 1253.27);
  });

  it("rejects groups outside the grid", () => {
    for (const group of ["0", "9", "1.1", "A", "non renseigné"]) {
      setSituation(group);
      assert.equal(outOfGrid(), true, group);
      assert.equal(amount(), 0, group);
    }
  });

  it("reports a missing group as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(amount(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("4");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "groupe hors grille"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});

describe("IDCC 1480 — 2025.2, form of press", async () => {
  const revision = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2025.2");
  assert.ok(revision);
  const revisionRules: Record<string, Rule> = { ...rules };
  Object.assign(revisionRules, await revision.loadRules());
  const revisionEngine = new Engine(revisionRules, { logger: { log() {}, warn() {}, error() {} } });
  const evaluate = (form: string, group: string, name: string) => {
    revisionEngine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . forme de presse`]: `'${form}'`,
      [`${namespace} . groupe`]: `'${group}'`,
    });
    return revisionEngine.evaluate(`${namespace} . ${name}`).nodeValue;
  };

  it("declares the extension published on 19 September 2025", () => {
    assert.equal(revision.validFrom, "2025-09-01");
    assert.equal(revision.extension, "2025-09-19");
  });

  it("applies the grid of avenant n° 4 to the press agencies", () => {
    for (const [group, monthly] of Object.entries(MONTHLY)) {
      assert.equal(evaluate("agences de presse", group, "salaire minimum conventionnel"), monthly, group);
      assert.equal(evaluate("agences de presse", group, "groupe hors grille"), false, group);
    }
    assert.equal(evaluate("agences de presse", "9", "groupe hors grille"), true);
    assert.equal(evaluate("agences de presse", "1", "grille applicable"), true);
  });

  it("has no minimum for the other forms of press, whose grids are not modelled", () => {
    assert.equal(evaluate("autres formes de presse", "4", "salaire minimum conventionnel"), 0);
    assert.equal(evaluate("autres formes de presse", "non renseigné", "groupe hors grille"), false);
    assert.equal(evaluate("autres formes de presse", "4", "grille applicable"), false);
  });
});
