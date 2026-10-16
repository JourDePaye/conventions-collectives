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

describe("IDCC 1558 — industries céramiques — 2026.1 (accord du 26 février 2026, point 1,26)", () => {
  const monthly = [
    ["NA-E1", 1831.26], ["NA-E2", 1838.82], ["NB-E1", 1848.9], ["NB-E2", 1861.5], ["NB-E3", 1874.1],
    ["NC-E1", 1886.7], ["NC-E2", 1911.9], ["NC-E3", 1949.7], ["NC-E4", 2000.1], ["ND-E1", 2050.5],
    ["ND-E2", 2113.5], ["ND-E3", 2176.5], ["ND-E4", 2239.5], ["NE-E1", 2315.1], ["NE-E2", 2390.7],
    ["NE-E3", 2466.3], ["NE-E4", 2541.9], ["NF-E1", 2630.1], ["NF-E2", 2718.3], ["NF-E3", 2806.5],
  ] as const;
  const annual = [
    ["NG-E1", 32619.6, 34902.97], ["NG-E2", 34736.4, 37167.95], ["H", 39423.6, 43365.96],
    ["I", 47905.92, 52696.51], ["J", 59382, 65320.2],
  ] as const;

  it("starts on 1 January 2026", () => {
    assert.equal(COMPILED_VERSIONS[name]?.find((item) => item.version === "2026.1")?.validFrom, "2026-01-01");
  });

  it("gives every monthly minimum of annexe I", async () => {
    for (const [level, minimum] of monthly) {
      const engine = await engineFor(level, "100%", "non", "non", "2026.1");
      assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, minimum, level);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, false, level);
    }
  });

  it("gives every annual minimum of annexe II, with and without forfait jours", async () => {
    for (const [level, minimum, forfait] of annual) {
      const plain = await engineFor(level, "100%", "non", "non", "2026.1");
      assert.equal(plain.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, minimum, level);
      const days = await engineFor(level, "100%", "oui", "non", "2026.1");
      assert.equal(days.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, forfait, level);
    }
  });

  it("prorates part time and keeps the panier at 16 euros", async () => {
    const part = await engineFor("NC-E4", "50%", "non", "non", "2026.1");
    assert.equal(part.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1000.05);
    const panier = await engineFor("NA-E1", "100%", "non", "oui", "2026.1");
    assert.equal(panier.evaluate(`${namespace} . indemnité de panier`).nodeValue, 16);
  });

  it("rejects a classification absent from the grids", async () => {
    const engine = await engineFor("ZZ-E9", "100%", "non", "non", "2026.1");
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
  });
});
