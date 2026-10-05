import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1090-services-automobile";
const value = "services automobile";
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

/** Minimums garantis pour 35 heures, article 1er de l'avenant n° 110 du 22 janvier 2026. */
const GRID: Record<string, number> = {
  // Ouvriers et employés
  "1": 1853, "2": 1870, "3": 1888, "4": 1912, "5": 1929, "6": 1965,
  "7": 1999, "8": 2045, "9": 2106, "10": 2153, "11": 2205, "12": 2259,
  // Maîtrise
  "17": 2241, "18": 2249, "19": 2255, "20": 2259, "21": 2324,
  "22": 2400, "23": 2541, "24": 2685, "25": 2831,
  // Cadres, niveau et degré
  "I.A": 2541, "I.B": 2685, "I.C": 2831,
  "II.A": 2978, "II.B": 3267, "II.C": 3560,
  "III.A": 3852, "III.B": 4144, "III.C": 4438,
  "IV.A": 4731, "IV.B": 5022, "IV.C": 5316,
  "V": 5904,
};

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

const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 1090 — 2026.1 minimum salaries", () => {
  it("is in force from 1 May 2026 and cites the avenant and its extension order", () => {
    assert.equal(version.validFrom, "2026-05-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 110 du 22 janvier 2026")));
    assert.ok(version.sources.some((source) => source.includes("TRST2609049A")));
  });

  it("has 34 positions: 12 workers and employees, 9 supervisors and 13 executives", () => {
    assert.equal(Object.keys(GRID).length, 34);
  });

  for (const [level, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for ${level}`, () => {
      setSituation(level);
      assert.equal(minimum(), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setSituation("7", "50%");
    assert.equal(minimum(), 999.5);
    setSituation("III.B", "80%");
    assert.equal(minimum(), 3315.2);
  });

  it("rejects levels outside the grid", () => {
    // Steps 13 to 16 do not exist, nor does a degree for level V or a fifth level.
    for (const level of ["0", "13", "16", "26", "I", "I.D", "V.A", "VI.A", "i.a", "non renseigné"]) {
      setSituation(level);
      assert.equal(outOfGrid(), true, level);
      assert.equal(minimum(), 0, level);
    }
  });

  it("reports a missing level as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(minimum(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("7");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, null);
  });
});
