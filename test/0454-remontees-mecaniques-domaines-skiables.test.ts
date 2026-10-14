import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "0454-remontees-mecaniques-domaines-skiables";
const value = "remontées mécaniques domaines skiables";
const ns = `salarié . convention collective . ${value}`;

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((v) => v.version === "2026.1");
  assert.ok(version, "IDCC 454 must be exported");
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  for (const name of Object.keys(extension)) assert.equal(name in rules, false, `Unexpected collision: ${name}`);
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}
function set(engine: Engine, nr: number, extra: Record<string, string | number> = {}) {
  engine.setSituation({ "salarié . convention collective": `'${value}'`, [`${ns} . niveau de rémunération`]: nr, "salarié . contrat . statut cadre": "non", ...extra });
}
const get = (engine: Engine, rule: string) => engine.evaluate(`${ns} . ${rule}`);

describe("IDCC 454 — remontées mécaniques et domaines skiables", () => {
  it("exports the official NR grid", async () => { const e = await makeEngine(); set(e, 200); assert.equal(get(e, "salaire minimum horaire conventionnel").nodeValue, 12.0648); });
  it("calculates the 151.67-hour monthly equivalent and quota", async () => { const e = await makeEngine(); set(e, 409, { "salarié . contrat . temps de travail . quotité": "50%" }); assert.equal(get(e, "salaire minimum mensuel conventionnel").nodeValue, 2491.392088); });
  it("exposes sourced premiums separately", async () => { const e = await makeEngine(); set(e, 250); assert.equal(get(e, "indemnité compensatrice de panier").nodeValue, 7.94); assert.equal(get(e, "prime d'artificier").nodeValue, 50); });
  it("rejects a level outside the sourced grid and keeps contributions inherited", async () => { const e = await makeEngine(); set(e, 500); assert.equal(get(e, "niveau hors grille").nodeValue, true); assert.equal(get(e, "salaire minimum horaire conventionnel").nodeValue, null); assert.equal(Object.keys(e.getParsedRules()).some((n) => n.includes(`${value} . cotisations`)), false); });
});
