import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "2931-activites-marches-financiers";
const value = "activités de marchés financiers";
const ns = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[id]?.find((entry: { version: string }) => entry.version === "2026.1");
assert.ok(version, "IDCC 2931 must be exported");
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const grid = { "I.A": 1854, "I.B": 2228, "II.A": 2689, "II.B": 2950, "III.A": 3071, "III.B": 3575, "III.C": 4389 } as const;
function set(category: string, date = "11/10/2026", scope = "oui", quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${ns} . catégorie`]: `'${category}'`,
    [`${ns} . date de calcul`]: date,
    [`${ns} . adhérent d'une organisation signataire`]: scope,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}
const minimum = () => engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue;

describe("IDCC 2931 — 2026.1 salary minima", () => {
  it("is effective on 1 January 2026 and cites the official agreement", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source: string) => source.includes("Accord du 9 décembre 2025")));
    assert.ok(version.sources.some((source: string) => source.includes("KALITEXT000053715956")));
  });
  for (const [category, amount] of Object.entries(grid)) {
    it(`returns ${amount} euros for category ${category}`, () => {
      set(category);
      assert.equal(minimum(), amount);
    });
  }
  it("prorates the monthly minimum for part-time work", () => {
    set("III.C", "11/10/2026", "oui", "50%");
    assert.equal(minimum(), 2194.5);
  });
  it("gates the non-extended agreement to signatory or adherent employers", () => {
    set("I.A", "01/01/2026", "oui");
    assert.equal(minimum(), 1854);
    set("I.A", "31/12/2025", "oui");
    assert.equal(minimum(), null);
    set("I.A", "11/10/2026", "non");
    assert.equal(minimum(), null);
  });
  it("rejects categories outside the sourced grid and unrelated agreements", () => {
    set("IV.A");
    assert.equal(minimum(), null);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, null);
  });
});
