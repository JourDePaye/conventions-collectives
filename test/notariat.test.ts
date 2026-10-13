import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "2205-notariat";
const ns = "salarié . convention collective . notariat";

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((candidate) => candidate.version === "2026.1");
  assert.ok(version, "IDCC 2205 must be exported");
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], "notariat"],
  } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    salarié: "oui",
    dirigeant: "non",
    "salarié . convention collective": "'notariat'",
    [`${ns} . niveau`]: "'E'",
    [`${ns} . champ juridique`]: "'employeur signataire ou adhérent'",
    "salarié . contrat . temps de travail . quotité": "100%",
  });
  return engine;
}

const get = (engine: Engine, rule: string) => engine.evaluate(`${ns} . ${rule}`);
const baseSituation = {
  salarié: "oui",
  dirigeant: "non",
  "salarié . convention collective": "'notariat'",
  [`${ns} . champ juridique`]: "'employeur signataire ou adhérent'",
  "salarié . contrat . temps de travail . quotité": "100%",
};

describe("IDCC 2205 — notariat, minima au 1er mars 2026", () => {
  it("applies the eight-level monthly grid from the official salary amendment", async () => {
    const engine = await makeEngine();
    for (const [level, expected] of [["E", 1928], ["T1", 2120], ["T2", 2345], ["T3", 3132], ["C1", 3534], ["C2", 4337], ["C3", 5461], ["C4", 6103]] as const) {
      engine.setSituation({ ...baseSituation, [`${ns} . niveau`]: `'${level}'` });
      assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, expected, level);
    }
  });

  it("prorates the monthly minimum and rejects an unknown level", async () => {
    const engine = await makeEngine();
    engine.setSituation({ ...baseSituation, [`${ns} . niveau`]: "'E'", "salarié . contrat . temps de travail . quotité": "50%" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 964);
    engine.setSituation({ ...baseSituation, [`${ns} . niveau`]: "'X'" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 0);
  });

  it("does not apply the signatory-only amendment to another employer", async () => {
    const engine = await makeEngine();
    engine.setSituation({ [`${ns} . champ juridique`]: "'autre employeur'" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, null);
  });

  it("is isolated from an unrelated collective agreement", async () => {
    const engine = await makeEngine();
    engine.setSituation({ "salarié . convention collective": "'plasturgie'" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, null);
  });
});
