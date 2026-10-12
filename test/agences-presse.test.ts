import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "3221-agences-presse";
const value = "agences de presse";
const ns = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[id]?.find((entry: { version: string }) => entry.version === "2026.1");
assert.ok(version, "IDCC 3221 must be exported");
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const grid = { 1: 1873.86, 2: 1905.5, 3: 1929.1, 4: 1995.02, 5: 2142.63, 6: 2272.02, 7: 2500.03, 8: 2888.55, 9: 3260.89 } as const;
function set(group: string, date = "11/10/2026", scope = "tous employeurs après extension", quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${ns} . groupe`]: `'${group}'`,
    [`${ns} . date de calcul`]: date,
    [`${ns} . champ juridique`]: `'${scope}'`,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}
const minimum = () => engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue;

describe("IDCC 3221 — 2026.1 salary minima", () => {
  it("is effective on 1 July 2026 and cites the extended amendment", () => {
    assert.equal(version.validFrom, "2026-07-01");
    assert.ok(version.sources.some((source: string) => source.includes("Avenant n° 10 du 1er juin 2026")));
    assert.ok(version.sources.some((source: string) => source.includes("JORFTEXT000054794445")));
  });
  for (const [group, amount] of Object.entries(grid)) {
    it(`returns ${amount} euros for group ${group}`, () => {
      set(group);
      assert.equal(minimum(), amount);
    });
  }
  it("prorates the monthly minimum for part-time work", () => {
    set("9", "11/10/2026", "tous employeurs après extension", "50%");
    assert.equal(minimum(), 1630.445);
  });
  it("gates the amendment by signatory and extension scope", () => {
    set("1", "30/06/2026", "employeur signataire ou adhérent");
    assert.equal(minimum(), null);
    set("1", "01/07/2026", "employeur signataire ou adhérent");
    assert.equal(minimum(), 1873.86);
    set("1", "04/09/2026", "tous employeurs après extension");
    assert.equal(minimum(), null);
    set("1", "05/09/2026", "tous employeurs après extension");
    assert.equal(minimum(), 1873.86);
  });
  it("rejects groups outside the sourced grid and unrelated agreements", () => {
    set("10");
    assert.equal(minimum(), null);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, null);
  });
});
