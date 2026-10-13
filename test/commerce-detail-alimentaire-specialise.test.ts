import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3237-commerce-detail-alimentaire-specialise";
const value = "commerce de détail alimentaire spécialisé";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.2");
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

const GRID: Record<string, number> = {
  E1: 1875.01, E2: 1896.66, E3: 1913.02, E4: 1940.81, E5: 1970.14, E6: 1991.76,
  E7: 2047.34, AM1: 2488.93, AM2: 2564.58, C1: 3108.07, C2: 3487.9,
};

function setSituation(level: string | undefined, quota = "100%", months?: number) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    ...(months === undefined ? {} : { [`${namespace} . mois dans le niveau`]: `${months} mois` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 3237 — 2026.2 minimum salaries", () => {
  it("is extended from 1 October 2026 and cites the official salary text", () => {
    assert.equal(version.validFrom, "2026-10-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 10 du 16 juin 2026")));
    assert.ok(version.sources.some((source) => source.includes("TRST2622492A")));
  });

  for (const [level, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for ${level}`, () => {
      setSituation(level);
      assert.equal(minimum(), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setSituation("E4", "50%");
    assert.equal(minimum(), 970.41);
  });

  it("gives the annual guaranteed minimum for 218-day forfait jours", () => {
    setSituation("C1");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel forfait jours`).nodeValue, 38722);
    setSituation("C1", "100%", 25);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel forfait jours`).nodeValue, 40760);
    setSituation("C2");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel forfait jours`).nodeValue, 45855);
    setSituation("C2", "100%", 25);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel forfait jours`).nodeValue, 50950);
  });

  it("rejects levels outside the monthly grid", () => {
    for (const level of ["E0", "E8", "AM0", "AM3", "C0", "C3", "e1", "non renseigné"]) {
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
    setSituation("E4");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, null);
  });
});
