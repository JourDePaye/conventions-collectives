import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1607-jeux-jouets";
const value = "jeux jouets articles fêtes ornements noël puériculture voitures enfants modélisme";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const GRID: Record<string, number> = {
  "115": 1841, "118": 1852, "123": 1863, "130": 1911, "138": 1921, "143": 1929,
  "155": 1942, "170": 1986, "180": 2045, "190": 2092, "200": 2154, "212": 2240,
  "220": 2285, "255": 2532, "290": 2783, "310": 2923, "330": 3054, "370": 3564,
  "440": 3633, "480": 3899, "520": 4170, "560": 4441,
};

function setSituation(coefficient: string | number | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(coefficient === undefined ? {} : { [`${namespace} . coefficient`]: coefficient }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 1607 — 2026.1 minimum salaries", () => {
  it("is in force from 1 April 2026 and cites the official agreement and extension", () => {
    assert.equal(version.validFrom, "2026-04-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 100 du 3 mars 2026")));
    assert.ok(version.sources.some((source) => source.includes("Arrêté du 20 mai 2026")));
    assert.ok(version.sources.some((source) => source.includes("TRST2612716A")));
  });

  for (const [coefficient, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € for coefficient ${coefficient} at 0–3 years`, () => {
      setSituation(coefficient);
      assert.equal(minimum(), expected);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setSituation("200", "50%");
    assert.equal(minimum(), 1077);
  });

  it("reports coefficients outside the grid and missing coefficients", () => {
    for (const coefficient of [114, 561, 0]) {
      setSituation(coefficient);
      assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true, String(coefficient));
      assert.equal(minimum(), 0, String(coefficient));
    }
    setSituation(undefined);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
    assert.equal(minimum(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("115");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
