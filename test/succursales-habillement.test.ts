import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0675-succursales-habillement";
const value = "succursales habillement";
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

/** Monthly minimums of the accord of 16 April 2026 (151.67 hours). */
const MONTHLY: Record<string, number> = {
  E1: 1824, E2: 1837, E3: 1851, E4: 1900,
  AM1: 1981, AM2: 2058,
  C1: 2348, C2: 2581, C3: 3044,
};

function setSituation(level: string | undefined, quota?: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    ...(quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": quota }),
  });
}

const amount = (name: string) => {
  const result = engine.evaluate(`${namespace} . ${name}`).nodeValue;
  assert.equal(typeof result, "number", name);
  return Math.round((result as number) * 100) / 100;
};

describe("IDCC 675 — 2026.1 minimum salaries", () => {
  it("is in force from 1 May 2026 and cites the accord and its extension order", () => {
    assert.equal(version.validFrom, "2026-05-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 16 avril 2026")));
    assert.ok(version.sources.some((source) => source.includes("TRST2616915A")));
  });

  for (const [level, monthly] of Object.entries(MONTHLY)) {
    it(`${level}: ${monthly} € a month`, () => {
      setSituation(level);
      assert.equal(amount("salaire minimum conventionnel"), monthly);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, false);
    });
  }

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("E4", "50%");
    assert.equal(amount("salaire minimum conventionnel"), 950);
    setSituation("AM1", "80%");
    assert.equal(amount("salaire minimum conventionnel"), 1584.8);
  });

  it("rejects categories outside the grid", () => {
    for (const level of ["E0", "E5", "AM0", "AM3", "C0", "C4", "e1", "1", "A", "non renseigné"]) {
      setSituation(level);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true, level);
      assert.equal(amount("salaire minimum conventionnel"), 0, level);
    }
  });

  it("reports a missing category as outside the grid", () => {
    setSituation(undefined);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
    assert.equal(amount("salaire minimum conventionnel"), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("E4");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "niveau hors grille"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
