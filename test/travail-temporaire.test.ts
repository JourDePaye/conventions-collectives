import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1413-travail-temporaire";
const value = "travail temporaire";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
const amounts: Record<string, number> = { A: 1836, B: 1859, C: 1896, D: 1967, E: 2013, F: 2288, G: 2547, H: 2948, I: 3358, J: 3759, K: 4418, L: 5077, M: 5666 };
function set(level: string | undefined, quota = "100%", forfait = "non") { engine.setSituation({ "salarié . convention collective": `'${value}'`, ...(level ? { [`${namespace} . niveau`]: `'${level}'` } : {}), [`${namespace} . forfait jours`]: forfait, "salarié . contrat . temps de travail . quotité": quota }); }
function minimum() { return engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue; }
describe("IDCC 1413 — 2026.1", () => {
  it("has the official effective date and extension sources", () => { assert.equal(version.validFrom, "2026-02-01"); assert.ok(version.sources.some((s) => s.includes("Accord du 20 février 2026"))); assert.ok(version.sources.some((s) => s.includes("JORFTEXT000054051082"))); });
  for (const [level, expected] of Object.entries(amounts)) it(`${level} returns ${expected} €/month`, () => { set(level); assert.equal(minimum(), expected); });
  it("uses the level F forfait-jours minimum", () => { set("F", "100%", "oui"); assert.equal(minimum(), 2517); });
  it("prorates once for part-time work", () => { set("H", "50%"); assert.equal(minimum(), 1474); });
  it("rejects missing and out-of-grid levels", () => { for (const level of [undefined, "N", "A1", "a"]) { set(level); assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true); assert.equal(minimum(), 0); } });
  it("is inapplicable to another agreement", () => { set("A"); engine.setSituation({ "salarié . convention collective": "'droit commun'" }); assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null); });
});
