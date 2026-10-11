import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "3090-spectacle-vivant-prive";
const ns = "salarié . convention collective . spectacle vivant privé";

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((candidate) => candidate.version === "2024.1");
  assert.ok(version, "IDCC 3090 must be exported");
  assert.equal(version.validFrom, "2024-02-01");
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], "spectacle vivant privé"],
  } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    salarié: "oui",
    dirigeant: "non",
    "salarié . convention collective": "'spectacle vivant privé'",
    "salarié . contrat . temps de travail . quotité": "100%",
  });
  return engine;
}

const get = (engine: Engine, rule: string) => engine.evaluate(`${ns} . ${rule}`);

const administrativeCases = [
  ["cadres groupe 1", "1", 3535.75],
  ["cadres groupe 2", "1", 2799.68],
  ["cadres groupe 3", "1", 2455.77],
  ["agents de maîtrise", "1", 2074.21],
  ["employés qualifiés groupe 1", "1", 1884.21],
  ["employés qualifiés groupe 2", "1", 1783.72],
  ["employés", "1", 1777.9],
] as const;

describe("IDCC 3090 — spectacle vivant privé", () => {
  it("exports the extended monthly minimums for permanent administrative and commercial staff", async () => {
    const engine = await makeEngine();
    for (const [category, echelon, expected] of administrativeCases) {
      engine.setSituation({
        salarié: "oui",
        dirigeant: "non",
        "salarié . convention collective": "'spectacle vivant privé'",
        "salarié . contrat . temps de travail . quotité": "100%",
        [`${ns} . catégorie administrative`]: `'${category}'`,
        [`${ns} . échelon`]: `'${echelon}'`,
      });
      assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, expected, category);
    }
  });

  it("covers technical staff and prorates the monthly minimum", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      salarié: "oui",
      dirigeant: "non",
      "salarié . convention collective": "'spectacle vivant privé'",
      "salarié . contrat . temps de travail . quotité": "100%",
      [`${ns} . catégorie technique`]: "'cadres groupe 2'",
    });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 2625.88);
    engine.setSituation({
      salarié: "oui",
      dirigeant: "non",
      "salarié . convention collective": "'spectacle vivant privé'",
      "salarié . contrat . temps de travail . quotité": "50%",
      [`${ns} . catégorie technique`]: "'employés qualifiés groupe 1'",
    });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 942.11);
  });

  it("returns no minimum for an unknown classification", async () => {
    const engine = await makeEngine();
    engine.setSituation({ [`${ns} . catégorie administrative`]: "'inconnue'", [`${ns} . échelon`]: "'1'" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, null);
  });

  it("is inactive outside the selected convention", async () => {
    const engine = await makeEngine();
    engine.setSituation({ "salarié . convention collective": "'télécommunications'" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, null);
  });
});
