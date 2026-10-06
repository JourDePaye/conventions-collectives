import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2156-grands-magasins";
const value = "grands magasins";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2024.1");
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

/** Monthly guaranteed minimums of the avenant of 17 April 2024 (151.67 hours). */
const MONTHLY: Record<string, number> = {
  "I.1": 1766.92,
  "I.2": 1768,
  "II.1": 1773,
  "II.2": 1785,
  "III.1": 1797,
  "III.2": 1803,
  "IV.1": 1834,
  "IV.2": 1895,
  "V": 2054,
  "VI": 2469,
  "VII": 3203,
  "VIII": 4217,
};

/** Annual guaranteed minimums of the same article 2, full time. */
const ANNUAL: Record<string, number> = {
  "I.1": 22087,
  "I.2": 22096,
  "II.1": 22157,
  "II.2": 22310,
  "III.1": 22463,
  "III.2": 22539,
  "IV.1": 22921,
  "IV.2": 23685,
  "V": 26699,
  "VI": 32694,
  "VII": 42406,
  "VIII": 55840,
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

const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 2156 — 2024.1 guaranteed minimums", () => {
  it("is in force from 1 June 2024 and cites the avenant and its extension order", () => {
    assert.equal(version.validFrom, "2024-06-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant du 17 avril 2024")));
    assert.ok(version.sources.some((source) => source.includes("28 juin 2024")));
  });

  for (const [level, monthly] of Object.entries(MONTHLY)) {
    it(`${level}: ${monthly} € a month, ${ANNUAL[level]} € a year`, () => {
      setSituation(level);
      assert.equal(amount("salaire minimum conventionnel"), monthly);
      assert.equal(amount("rémunération minimale annuelle"), ANNUAL[level]);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("IV.2", "50%");
    assert.equal(amount("salaire minimum conventionnel"), 947.5);
    setSituation("VI", "80%");
    assert.equal(amount("salaire minimum conventionnel"), 1975.2);
  });

  it("rejects levels outside the grid", () => {
    for (const level of ["I", "I.3", "II", "V.1", "IX", "0", "i.1", "A", "non renseigné"]) {
      setSituation(level);
      assert.equal(outOfGrid(), true, level);
      assert.equal(amount("salaire minimum conventionnel"), 0, level);
      assert.equal(amount("rémunération minimale annuelle"), 0, level);
    }
  });

  it("reports a missing level as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(amount("salaire minimum conventionnel"), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("IV.2");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "niveau hors grille", "rémunération minimale annuelle"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
