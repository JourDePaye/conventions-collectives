import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const name = "1558-industries-ceramiques";
const value = "industries céramiques";
const namespace = `salarié . convention collective . ${value}`;

const engineFor = async (classification: string, quotient = "100%", forfait = "non", panier = "non") => {
  const version = COMPILED_VERSIONS[name]?.find((item: { version: string }) => item.version === "2025.1");
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
    [`${namespace} . forfait annuel en jours`]: `'${forfait}'`,
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
