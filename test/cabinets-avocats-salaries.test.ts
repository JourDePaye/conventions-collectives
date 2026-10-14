import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "3253-cabinets-avocats-salaries";
const ns = "salarié . convention collective . cabinets d'avocats salariés";

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((v) => v.version === "2025.1");
  assert.ok(version, "IDCC 3253 must be exported");
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], "cabinets d'avocats salariés"],
  } as Rule;
  for (const name of Object.keys(extension)) {
    assert.equal(name in rules, false, `Unexpected modele-social collision: ${name}`);
  }
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

function set(engine: Engine, values: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié . convention collective": "'cabinets d'avocats salariés'",
    [`${ns} . coefficient`]: 300,
    [`${ns} . date de calcul`]: "01/10/2025",
    "salarié . contrat . statut cadre": "non",
    ...values,
  });
}

const get = (engine: Engine, rule: string) => engine.evaluate(`${ns} . ${rule}`);

describe("IDCC 3253 — salariés des cabinets d'avocats", () => {
  it("applies the sourced monthly minimum and prorates once", async () => {
    const engine = await makeEngine();
    set(engine, { [`${ns} . coefficient`]: 300, "salarié . contrat . temps de travail . quotité": "50%" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 1195);
  });

  it("keeps the thirteenth-month annual guarantee in €/an", async () => {
    const engine = await makeEngine();
    set(engine, { [`${ns} . coefficient`]: 300 });
    assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, 31070);
  });

  it("rejects dates before the extended convention takes effect", async () => {
    const engine = await makeEngine();
    set(engine, { [`${ns} . date de calcul`]: "30/09/2025" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, null);
  });

  it("reports an unknown coefficient instead of inventing a minimum", async () => {
    const engine = await makeEngine();
    set(engine, { [`${ns} . coefficient`]: 999 });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, null);
    assert.equal(get(engine, "coefficient hors grille").nodeValue, true);
  });

  it("keeps the contribution namespace inherited and isolated", async () => {
    const engine = await makeEngine();
    set(engine);
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 2390);
    assert.equal(Object.keys(engine.getParsedRules()).some((name) => name.includes("cabinets d'avocats'")), false);
  });
});
