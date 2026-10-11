import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "0787-experts-comptables";
const ns = "salarié . convention collective . experts-comptables";

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((candidate) => candidate.version === "2026.1");
  assert.ok(version, "IDCC 787 must be exported");
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], "experts-comptables"],
  } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    salarié: "oui",
    dirigeant: "non",
    "salarié . convention collective": "'experts-comptables'",
    [`${ns} . coefficient`]: 180,
    "salarié . contrat . temps de travail . quotité": "100%",
  });
  return engine;
}

const get = (engine: Engine, rule: string) => engine.evaluate(`${ns} . ${rule}`);

describe("IDCC 787 — current annual salary grid", () => {
  it("applies the base value to the first 164 points and the hierarchical value above", async () => {
    const engine = await makeEngine();
    assert.equal(Math.round((get(engine, "minimum annuel").nodeValue as number) * 100) / 100, 22850.16);
    assert.equal(Math.round((get(engine, "salaire minimum conventionnel").nodeValue as number) * 100) / 100, 1904.18);
  });

  it("uses the separate annual minimum for order-registered index 40", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      salarié: "oui",
      dirigeant: "non",
      "salarié . convention collective": "'experts-comptables'",
      [`${ns} . coefficient`]: 40,
      [`${ns} . indice 40 ordre validé`]: "oui",
    });
    assert.equal(get(engine, "minimum annuel").nodeValue, 47801);
  });

  it("does not calculate an unknown coefficient or an unvalidated index 40", async () => {
    const engine = await makeEngine();
    engine.setSituation({ [`${ns} . coefficient`]: 0 });
    assert.equal(get(engine, "minimum annuel").nodeValue, null);
    engine.setSituation({ [`${ns} . coefficient`]: 40, [`${ns} . indice 40 ordre validé`]: "non" });
    assert.equal(get(engine, "minimum annuel").nodeValue, null);
  });

  it("is inactive outside the selected convention", async () => {
    const engine = await makeEngine();
    engine.setSituation({ "salarié . convention collective": "'télécommunications'" });
    assert.equal(get(engine, "minimum annuel").nodeValue, null);
  });
});
