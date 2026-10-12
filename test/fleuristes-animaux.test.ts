import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1978-fleuristes-animaux";
const value = "fleuristes animaux";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.2");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const GRID: Record<string, number> = {
  "I.1": 1882.18, "I.2": 1892.63, "I.3": 1903.08,
  "II.1": 1913.55, "II.2": 1924, "II.3": 1934.46,
  "III.1": 1944.91, "III.2": 1955.37, "III.3": 1965.83,
  "IV.1": 1976.29, "IV.2": 2018.11, "IV.3": 2059.93,
  "V.1": 2159.27, "V.2": 2274.30, "V.3": 2394.55,
  "VI.1": 2514.79, "VI.2": 2692.56, "VI.3": 2953.97,
  "VII.1": 3701.61, "VII.2": 3910.74, "VII.3": 4078.05,
};

function setSituation(level: string | undefined, quota = "100%", seniority = "0 an") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
    "salarié . ancienneté": seniority,
  });
}
function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 1978 — 2026.1 minimum salaries", () => {
  it("is effective from 1 August 2026 after the extension order", () => {
    assert.equal(version.validFrom, "2026-08-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 10 mars 2026")));
    assert.ok(version.sources.some((source) => source.includes("Arrêté du 17 juillet 2026")));
    assert.ok(version.sources.some((source) => source.includes("JORFTEXT000054451384")));
  });
  for (const [level, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for ${level}`, () => {
      setSituation(level);
      assert.equal(minimum(), expected);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, false);
    });
  }
  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("V.2", "50%");
    assert.equal(minimum(), 1137.15);
  });
  it("rejects levels outside the grid", () => {
    for (const level of ["0", "I", "I.4", "VIII.1", "non renseigné"]) {
      setSituation(level);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true, level);
      assert.equal(minimum(), 0, level);
    }
  });
  it("calculates the seniority premium from 3 to 15 years", () => {
    setSituation("V.2");
    for (const [years, rate, expected] of [[0, 0, 0], [3, 3, 68.23], [6, 6, 136.46], [9, 9, 204.69], [12, 12, 272.92], [15, 15, 341.15]] as const) {
      setSituation("V.2", "100%", `${years} an`);
      assert.equal(engine.evaluate(`${namespace} . taux de prime d'ancienneté`).nodeValue, rate, `${years} years`);
      assert.equal(engine.evaluate(`${namespace} . prime d'ancienneté`).nodeValue, expected, `${years} years`);
    }
  });
  it("prorates the seniority premium for part-time work", () => {
    setSituation("V.2", "50%", "6 an");
    assert.equal(engine.evaluate(`${namespace} . prime d'ancienneté`).nodeValue, 68.23);
  });
  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("I.1");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
