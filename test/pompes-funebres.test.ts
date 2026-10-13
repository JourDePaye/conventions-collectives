import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "0759-pompes-funebres";
const ns = "salarié . convention collective . pompes funèbres";

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((candidate) => candidate.version === "2020.4");
  assert.ok(version, "IDCC 759 must be exported");
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], "pompes funèbres"],
  } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    salarié: "oui",
    dirigeant: "non",
    "salarié . convention collective": "'pompes funèbres'",
    [`${ns} . niveau`]: "'II'",
    [`${ns} . position`]: 1,
    [`${ns} . ancienneté dans l'emploi`]: 5,
    "salarié . contrat . temps de travail . quotité": "100%",
  });
  return engine;
}

const get = (engine: Engine, rule: string) => engine.evaluate(`${ns} . ${rule}`);

describe("IDCC 759 — 2020 salary minima", () => {
  it("applies the sourced level/position and seniority grid", async () => {
    const engine = await makeEngine();
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 1639);
  });

  it("uses the 25-year seniority amount for employees", async () => {
    const engine = await makeEngine();
    engine.setSituation({ salarié: "oui", dirigeant: "non", "salarié . convention collective": "'pompes funèbres'", [`${ns} . niveau`]: "'III'", [`${ns} . position`]: 2, [`${ns} . ancienneté dans l'emploi`]: 25, "salarié . contrat . temps de travail . quotité": "100%" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 1877);
  });

  it("uses the cadre three-year step and prorates by working time", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      salarié: "oui",
      dirigeant: "non",
      "salarié . convention collective": "'pompes funèbres'",
      [`${ns} . niveau`]: "'VII'",
      [`${ns} . position`]: 1,
      [`${ns} . ancienneté dans l'emploi`]: 4,
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 1924.5);
  });

  it("is unavailable for missing or out-of-grid classifications and outside the convention", async () => {
    const engine = await makeEngine();
    engine.setSituation({ [`${ns} . niveau`]: "'VIII'" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, null);
    engine.setSituation({ "salarié . convention collective": "'télécommunications'" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, null);
  });
});
