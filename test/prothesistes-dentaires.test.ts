import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0993-prothesistes-dentaires";
const value = "prothésistes dentaires";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");

const MINIMUMS: Record<string, number> = {
  "personnel-service": 1892,
  "secretaire-aide-comptable": 1896,
  comptable: 2002,
  "employe-prothese": 1895,
  "auxiliaire-prothese": 1903,
  TQ1: 1935,
  TQ2: 2118,
  TQ3: 2246,
  PHQ1: 2293,
  PHQ2: 2522,
  "responsable-secteur": 2755,
  "chef-laboratoire": 3300,
};

assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = {
  ...choice,
  "une possibilité": [...choice["une possibilité"], value],
} as Rule;
for (const name of Object.keys(extension)) {
  assert.ok(name === namespace || name.startsWith(`${namespace} . `), `rule escaped namespace: ${name}`);
}
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(level?: string, quota?: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    ...(quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": quota }),
  });
}

function amount() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return result as number;
}

describe("IDCC 993 — 2026.1 minimum salaries and payroll audit", () => {
  it("starts on 1 October 2026 after the 4 September 2026 extension publication", () => {
    assert.equal(version.validFrom, "2026-10-01");
    assert.ok(version.sources.some((source) => source.includes("15 juin 2026")));
    assert.ok(version.sources.some((source) => source.includes("24 août 2026")));
  });

  for (const [level, minimum] of Object.entries(MINIMUMS)) {
    it(`${level} has the sourced monthly minimum`, () => {
      setSituation(level);
      assert.equal(amount(), minimum);
    });
  }

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("PHQ2", "50%");
    assert.equal(amount(), 1261);
  });

  it("marks an unknown classification outside the grid", () => {
    setSituation("PHQ3");
    assert.equal(amount(), 0);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, undefined);
  });

  it("is isolated from another convention", () => {
    setSituation("PHQ1");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, null);
  });

  it("does not redefine payroll-wide endpoints or collide with modele-social", () => {
    assert.equal(Object.keys(extension).some((name) => name.includes("cotisations") || name.includes("prévoyance") || name.includes("santé") || name.includes("formation professionnelle") || name.includes("exonération cotisation AT")), false);
    assert.equal(Object.keys(extension).some((name) => name in modeleSocial), false);
  });
});
