import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "1412-installation-aeraulique-thermique-frigorifique";
const ns = "salarié . convention collective . installation aeraulique thermique frigorifique";

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((v) => v.version === "2026.1");
  assert.ok(version, "IDCC 1412 must be exported");
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "installation aeraulique thermique frigorifique"] } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

function set(engine: Engine, inputs: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié": "oui",
    "dirigeant": "non",
    "salarié . convention collective": "'installation aeraulique thermique frigorifique'",
    [`${ns} . coefficient`]: 300,
    ...Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key.includes(" . ") ? key : `${ns} . ${key}`, value])),
  });
}

const get = (engine: Engine, rule: string) => engine.evaluate(`${ns} . ${rule}`);

describe("IDCC 1412 — 2026 minimum salaries", () => {
  it("evaluates the sourced monthly minimum and prorates it once", async () => {
    const engine = await makeEngine();
    set(engine, { coefficient: 300 });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 2471.98);
    set(engine, { coefficient: 300, "salarié . contrat . temps de travail . quotité": "50 %" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 1235.99);
  });

  it("keeps the annual remuneration in euros per year", async () => {
    const engine = await makeEngine();
    set(engine, { coefficient: 500 });
    const result = get(engine, "salaire minimum annuel conventionnel");
    assert.equal(result.nodeValue, 52755.12);
    assert.equal(result.unit?.denominators?.includes("an"), true);
  });

  it("rejects classifications absent from the published grid", async () => {
    const engine = await makeEngine();
    set(engine, { coefficient: 999 });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 0);
    assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, 0);
    assert.equal(get(engine, "coefficient hors grille").nodeValue, true);
  });
});
