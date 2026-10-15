import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const name = "1558-industries-ceramiques";
const value = "industries céramiques";
const namespace = `salarié . convention collective . ${value}`;

const engineFor = async (classification: string, quotient = "100%", forfait = "non", panier = "non", revision = "2025.1") => {
  const version = COMPILED_VERSIONS[name]?.find((item: { version: string }) => item.version === revision);
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . classification`]: `'${classification}'`,
    // Revision 2025.1 compares the input with the texts 'oui' and 'non', later ones with booleans.
    [`${namespace} . forfait annuel en jours`]: revision === "2025.1" ? `'${forfait}'` : forfait,
    [`${namespace} . salarié éligible à l'indemnité de panier`]: panier,
    "salarié . contrat . temps de travail . quotité": quotient,
    "salarié . contrat . statut cadre": "non",
  });
  return engine;
};

describe("IDCC 1558 — industries céramiques", () => {
  it("applies the 2025 monthly minimum and part-time quotient", async () => {
    const engine = await engineFor("NC-E4", "50%");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 989.2);
  });

  it("keeps cadre minima annual and selects the forfait-jours column", async () => {
    const engine = await engineFor("NG-E1", "100%", "oui");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, 34477.97);
  });

  it("exposes the sourced panier amount only when eligibility is declared", async () => {
    const eligible = await engineFor("NA-E1", "1", "non", "oui");
    assert.equal(eligible.evaluate(`${namespace} . indemnité de panier`).nodeValue, 16);
    const ineligible = await engineFor("NA-E1");
    assert.equal(ineligible.evaluate(`${namespace} . indemnité de panier`).nodeValue, 0);
  });

  it("rejects classifications outside the published grid", async () => {
    const engine = await engineFor("ZZ-E9");
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, null);
  });
});

describe("IDCC 1558 — industries céramiques — 2025.2", () => {
  it("keeps the effective date of 2025.1", () => {
    assert.equal(COMPILED_VERSIONS[name]?.find((item) => item.version === "2025.2")?.validFrom, "2025-01-01");
  });

  it("no longer marks the executives' levels out of the grid", async () => {
    for (const [level, minimum] of [["NG-E1", 32222.4], ["H", 38918.4], ["J", 58560]] as const) {
      const engine = await engineFor(level, "100%", "non", "non", "2025.2");
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, false, level);
      assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, minimum);
      assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    }
  });

  it("selects the forfait-jours column from a boolean input, and the other one by default", async () => {
    const forfait = await engineFor("NG-E1", "100%", "oui", "non", "2025.2");
    assert.equal(forfait.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, 34477.97);
    const version = COMPILED_VERSIONS[name]?.find((item) => item.version === "2025.2");
    assert.ok(version);
    const rules: Record<string, Rule> = { ...modeleSocial };
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
    const engine = new Engine({ ...rules, ...(await version.loadRules()) }, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({ "salarié . convention collective": `'${value}'`, [`${namespace} . classification`]: "'NG-E1'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, 32222.4);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, false);
  });

  it("keeps the monthly levels and rejects a classification absent from both grids", async () => {
    const monthly = await engineFor("NC-E4", "50%", "non", "non", "2025.2");
    assert.equal(monthly.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 989.2);
    assert.equal(monthly.evaluate(`${namespace} . niveau hors grille`).nodeValue, false);
    const unknown = await engineFor("ZZ-E9", "100%", "non", "non", "2025.2");
    assert.equal(unknown.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
  });
});
