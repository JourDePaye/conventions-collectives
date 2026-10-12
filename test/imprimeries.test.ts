import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0184-imprimeries";
const value = "imprimeries de labeur et industries graphiques";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === "2026.1");
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
  "IB": 4515,
  "IA": 4401,
  "II": 3613,
  "IIIB": 3010,
  "IIIA": 2369,
  "IVB": 2232,
  "IVA": 2120,
  "VC": 1949,
  "VB": 1887,
  "VA": 1873,
  "VIB": 1859,
  "VIA": 1843,
};

function setSituation(group: string | undefined, quota?: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(group === undefined ? {} : { [`${namespace} . groupe et échelon`]: `'${group}'` }),
    ...(quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": quota }),
  });
}

const minimum = () => {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
};

const outOfGrid = () => engine.evaluate(`${namespace} . groupe hors grille`).nodeValue;

describe("IDCC 184 — 2026.1 minimum salaries", () => {
  it("is in force from 1 April 2026 and cites the extended agreement", () => {
    assert.equal(version.validFrom, "2026-04-01");
    assert.ok(version.sources.some((source: string) => source.includes("Arrêté du 12 mars 2026")));
  });

  for (const [group, monthly] of Object.entries(MONTHLY)) {
    it(`group ${group}: ${monthly} € a month`, () => {
      setSituation(group);
      assert.equal(minimum(), monthly);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the 152.25-hour minimum once for part-time work", () => {
    setSituation("IIIA", "50%");
    assert.equal(minimum(), 1184.5);
  });

  it("rejects groups outside the grid", () => {
    for (const group of ["I", "VII", "VIC", "IIA"]) {
      setSituation(group);
      assert.equal(outOfGrid(), true, group);
      assert.equal(minimum(), 0, group);
    }
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("II");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . groupe hors grille`).nodeValue, null);
  });
});
