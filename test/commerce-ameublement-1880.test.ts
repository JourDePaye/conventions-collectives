import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1880-commerce-ameublement";
const value = "commerce de l'ameublement";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

// Accord du 19 mars 2026, article 1er (base 151,67 heures).
const GRID: Record<string, number> = {
  "1": 1830,
  "2.1": 1835, "2.2": 1839, "2.3": 1845,
  "3.1": 1863, "3.2": 1885, "3.3": 1916,
  "4.1": 1956, "4.2": 1986, "4.3": 2016,
  "5.1": 2098, "5.2": 2139, "5.3": 2244,
  "6.1": 2395, "6.2": 2468, "6.3": 2541,
  "7.1": 2725, "7.2": 3129, "7.3": 3354,
  "8.1": 3545, "8.2": 3862,
  "9.1": 4507, "9.2": 4970,
};

function setSituation(level: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `"${value}"`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}
function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 1880, 2026.1 minimum salaries", () => {
  it("is effective from 1 May 2026 and cites the accord of 19 March 2026", () => {
    assert.equal(version.validFrom, "2026-05-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 19 mars 2026")));
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000054426659")));
    assert.ok(version.sources.some((source) => source.includes("Arrêté du 11 juin 2026")));
  });
  for (const [level, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for ${level}`, () => {
      setSituation(level);
      assert.equal(minimum(), expected);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, false);
    });
  }
  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("5.2", "50%");
    assert.equal(minimum(), 1069.5);
  });
  it("rejects classifications outside the grid", () => {
    for (const level of ["0", "1.1", "2", "2.4", "8.3", "9.3", "10.1", "non renseigné"]) {
      setSituation(level);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true, level);
      assert.equal(minimum(), 0, level);
    }
  });
  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("2.1");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
