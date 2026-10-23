/**
 * Extra days of paid leave on top of the legal ones, figures from the agreements' texts:
 * Syntec article 5.1 (KALIARTI000047513845: 1 to 4 jours ouvrés after 5, 10, 15 and 20 years),
 * commerce alimentaire article 7.1.2 (KALIARTI000041495536: 1 to 3 days after 10, 15 and 20 years)
 * banque article 64 (KALIARTI000005830302: a 26th day for a complete reference period),
 * métallurgie articles 89.1 and 89.2 (KALIARTI000046314586 and KALIARTI000046314587: 1 to 3 jours
 * ouvrables by seniority and age, 1 more for cadres dirigeants and annual forfaits) and HCR avenant
 * n° 1 article 11 (KALIARTI000005826353: 6 jours ouvrables a year after a month of work).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

async function engineOf(model: string, revision: string, value: string) {
  const version = COMPILED_VERSIONS[model]?.find((entry) => entry.version === revision);
  assert.ok(version, `${model} ${revision}`);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...new Set([...choice["une possibilité"], value])],
  } as Rule;
  Object.assign(rules, await version.loadRules());
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  return (situation: Record<string, string>) => {
    engine.setSituation({ "salarié . convention collective": `'${value}'`, ...situation });
    return engine.evaluate(`salarié . convention collective . ${value} . congés payés . jours supplémentaires`).nodeValue;
  };
}

describe("Syntec seniority days (1486 revision 2026.3)", async () => {
  const days = await engineOf("1486-syntec", "2026.3", "syntec");
  const at = (years: number) => days({ "salarié . convention collective . syntec . congés payés . ancienneté": `${years} an` });

  it("grants 1 to 4 jours ouvrés after 5, 10, 15 and 20 years", () => {
    assert.deepEqual([0, 4, 5, 9, 10, 14, 15, 19, 20, 30].map(at), [0, 0, 1, 1, 2, 2, 3, 3, 4, 4]);
  });
});

describe("Commerce alimentaire seniority days (2216 revisions 2025.2 and 2026.4)", async () => {
  for (const revision of ["2025.2", "2026.4"]) {
    const days = await engineOf("2216-commerce-detail-gros-predominance-alimentaire", revision, "commerce alimentaire");
    const at = (years: number) =>
      days({ "salarié . convention collective . commerce alimentaire . congés payés . ancienneté": `${years} an` });

    it(`grants 1 to 3 days after 10, 15 and 20 years (${revision})`, () => {
      assert.deepEqual([0, 9, 10, 14, 15, 19, 20, 40].map(at), [0, 0, 1, 1, 2, 2, 3, 3]);
    });
  }
});

describe("Banque 26th day (2120 revision 2026.2)", async () => {
  const days = await engineOf("2120-banque", "2026.2", "banque");
  const rule = "salarié . convention collective . banque . congés payés . période de référence complète";

  it("grants one jour ouvré for a complete reference period only", () => {
    assert.equal(days({ [rule]: "oui" }), 1);
    assert.equal(days({ [rule]: "non" }), 0);
    assert.equal(days({}), 0);
  });
});

describe("Métallurgie extra days (3248 revision 2026.4)", async () => {
  const days = await engineOf("3248-metallurgie", "2026.4", "métallurgie");
  const ns = "salarié . convention collective . métallurgie . congés payés";
  const at = (seniority: number, age: number, packageOrDirector = false) =>
    days({
      [`${ns} . ancienneté`]: `${seniority} an`,
      [`${ns} . âge`]: `${age} an`,
      [`${ns} . cadre dirigeant ou forfait annuel`]: packageOrDirector ? "oui" : "non",
    });

  it("grants 1 day after 2 years, 2 from 45 years old, 3 over 55 with 20 years", () => {
    assert.equal(at(1, 30), 0);
    assert.equal(at(2, 30), 1);
    assert.equal(at(2, 45), 2);
    // The age tiers increase the same leave: they need the 2 years too.
    assert.equal(at(1, 50), 0);
    assert.equal(at(19, 56), 2);
    assert.equal(at(20, 55), 3);
  });

  it("adds a day for cadres dirigeants and annual forfaits after a year", () => {
    assert.equal(at(1, 30, true), 1);
    assert.equal(at(0, 30, true), 0);
    assert.equal(at(20, 56, true), 4);
  });
});

describe("HCR conventional days (1979 revisions 2024.3 and 2026.2)", async () => {
  for (const revision of ["2024.3", "2026.2"]) {
    const days = await engineOf("1979-hotels-cafes-restaurants", revision, "hôtels cafés restaurants");
    const rule = "salarié . convention collective . hôtels cafés restaurants . congés payés . congé légal";

    it(`grants 6 jours ouvrables a year after a month of work (${revision})`, () => {
      assert.equal(days({ [rule]: "30 jour" }), 6);
      assert.equal(days({ [rule]: "2.5 jour" }), 6);
      assert.equal(days({ [rule]: "2 jour" }), 0);
    });
  }
});
