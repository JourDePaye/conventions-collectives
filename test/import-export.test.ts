import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0043-import-export";
const value = "import-export";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const MONTHLY: Record<string, number> = {
  E1: 1879, E2: 1882, E3: 1886, E4: 1896, E5: 1903, E6: 1935, E7: 1996, E8: 2065,
  M9: 2104, M10: 2310, M11: 2549, M12: 2724,
  C13: 2666, C14: 2906, C15: 3121, C16: 3564, C17: 3996, C18: 4808, C19: 5232, C20: 5668,
};

function setSituation(coefficient: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(coefficient === undefined ? {} : { [`${namespace} . coefficient`]: `'${coefficient}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

const amount = () => engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
const outOfGrid = () => engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue;

describe("IDCC 0043 — 2026.1 minimum salaries", () => {
  it("is in force from 1 March 2026 and cites the extended agreement", () => {
    assert.equal(version.validFrom, "2026-03-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 10 février 2026")));
    assert.ok(version.sources.some((source) => source.includes("arrêté du 4 mai 2026")));
  });

  for (const [coefficient, minimum] of Object.entries(MONTHLY)) {
    it(`${coefficient}: ${minimum} € monthly`, () => {
      setSituation(coefficient);
      assert.equal(amount(), minimum);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the monthly minimum for part-time work", () => {
    setSituation("C16", "50%");
    assert.equal(amount(), 1782);
  });

  it("rejects coefficients outside the grid", () => {
    for (const coefficient of ["E0", "C21", "1", "non renseigné"]) {
      setSituation(coefficient);
      assert.equal(outOfGrid(), true, coefficient);
      assert.equal(amount(), 0, coefficient);
    }
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("C16");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
