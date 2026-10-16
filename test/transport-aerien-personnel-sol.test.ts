import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "0275-transport-aerien-personnel-sol";
const ns = "salarié . convention collective . transport aérien personnel au sol";

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((v) => v.version === "2025.1");
  assert.ok(version, "IDCC 275 must be exported");
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], "transport aérien personnel au sol"],
  } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

function set(engine: Engine, values: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié . convention collective": "'transport aérien personnel au sol'",
    [`${ns} . coefficient`]: 245,
    [`${ns} . date de calcul`]: "01/11/2025",
    [`${ns} . adhérent d'une organisation signataire`]: "oui",
    "salarié . contrat . statut cadre": "non",
    ...values,
  });
}

const get = (engine: Engine, rule: string) => engine.evaluate(`${ns} . ${rule}`);

describe("IDCC 275 — transport aérien personnel au sol", () => {
  it("uses the November 2025 salary grid and prorates once", async () => {
    const engine = await makeEngine();
    set(engine, { [`${ns} . coefficient`]: 245, "salarié . contrat . temps de travail . quotité": "50%" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 1052.5);
  });

  it("applies the September grid at its effective date", async () => {
    const engine = await makeEngine();
    set(engine, { [`${ns} . date de calcul`]: "01/09/2025", [`${ns} . coefficient`]: 245 });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 2096);
  });

  it("rejects dates before the extended agreement's effective date", async () => {
    const engine = await makeEngine();
    set(engine, { [`${ns} . date de calcul`]: "31/03/2025" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, null);
  });

  it("reports an unknown coefficient instead of inventing a minimum", async () => {
    const engine = await makeEngine();
    set(engine, { [`${ns} . coefficient`]: 999 });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, null);
    assert.equal(get(engine, "coefficient hors grille").nodeValue, true);
  });

  it("keeps the panier amount available without folding it into the salary minimum", async () => {
    const engine = await makeEngine();
    set(engine);
    assert.equal(get(engine, "indemnité de panier").nodeValue, 7.4);
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 2105);
  });

  it("does not collide with unrelated convention namespaces", async () => {
    const engine = await makeEngine();
    set(engine);
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 2105);
    assert.equal(Object.keys(engine.getParsedRules()).some((name) => name.includes("services automobile")), false);
  });
});
