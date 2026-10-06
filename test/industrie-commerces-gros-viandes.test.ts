import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1534-industrie-commerces-gros-viandes";
const value = "industrie et commerces en gros des viandes";
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

/** Monthly minimum salaries for full-time work, article 2 of avenant n° 100 of 12 February 2026. */
const GRID: Record<string, number> = {
  "I.1": 1835, "I.2": 1849, "I.3": 1859,
  "II.1": 1880, "II.2": 1895, "II.3": 1911,
  "III.1": 1937, "III.2": 1957, "III.3": 1978,
  "IV.1": 2019, "IV.2": 2050, "IV.3": 2081,
  "V.1": 2132, "V.2": 2164, "V.3": 2194,
  "VI.1": 2318, "VI.2": 2411, "VI.3": 2504,
  "VII.1": 2664, "VII.2": 2766, "VII.3": 2869,
  "VIII.1": 3245, "VIII.2": 3564, "VIII.3": 3739,
  "IX.1": 4353, "IX.2": 4677, "IX.3": 5048,
  "X.1": 5460, "X.2": 5888, "X.3": 6361,
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

describe("IDCC 1534 — 2026.1 minimum salaries", () => {
  it("is in force from 1 February 2026 and cites the avenant and its extension order", () => {
    assert.equal(version.validFrom, "2026-02-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 100 du 12 février 2026")));
    assert.ok(version.sources.some((source) => source.includes("arrêté du 20 mai 2026")));
    assert.ok(version.sources.some((source) => source.includes("TRST2612791A")));
  });

  it("has 30 positions: 10 levels with 3 steps", () => {
    assert.equal(Object.keys(GRID).length, 30);
  });

  for (const [level, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for ${level}`, () => {
      setSituation(level);
      assert.equal(minimum(), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setSituation("IV.2", "50%");
    assert.equal(minimum(), 1025);
    setSituation("VIII.1", "80%");
    assert.equal(minimum(), 2596);
  });

  it("rejects levels and steps outside the grid", () => {
    for (const level of ["I", "I.0", "I.4", "X.4", "XI.1", "0.1", "1.1", "i.1", "VIII", "non renseigné"]) {
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
    setSituation("IV.2");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, null);
  });
});
