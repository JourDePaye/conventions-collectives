import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "0086-publicite";
const ns = "salarié . convention collective . publicité";

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((candidate) => candidate.version === "2025.3");
  assert.ok(version, "IDCC 86 must be exported");
  assert.equal(version.validFrom, "2025-06-19");
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], "publicité"],
  } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    salarié: "oui",
    dirigeant: "non",
    "salarié . convention collective": "'publicité'",
    [`${ns} . catégorie`]: "'employés'",
    [`${ns} . niveau`]: "'4'",
    "salarié . contrat . temps de travail . quotité": "100%",
  });
  return engine;
}

const get = (engine: Engine, rule: string) => engine.evaluate(`${ns} . ${rule}`);

describe("IDCC 86 — entreprises de publicité", () => {
  it("exports the current extended salary grid and prorates it by work quotient", async () => {
    const engine = await makeEngine();
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 1957);
    engine.setSituation({
      salarié: "oui",
      dirigeant: "non",
      "salarié . convention collective": "'publicité'",
      [`${ns} . catégorie`]: "'employés'",
      [`${ns} . niveau`]: "'4'",
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 978.5);
  });

  it("covers all four classification levels and rejects unknown levels", async () => {
    const engine = await makeEngine();
    for (const [catégorie, niveau, minimum] of [["employés", "1", 1842], ["techniciens", "1", 1999], ["cadres", "4", 4142]] as const) {
      engine.setSituation({
        salarié: "oui",
        dirigeant: "non",
        "salarié . convention collective": "'publicité'",
        [`${ns} . catégorie`]: `'${catégorie}'`,
        [`${ns} . niveau`]: `'${niveau}'`,
        "salarié . contrat . temps de travail . quotité": "100%",
      });
      assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, minimum);
    }
    engine.setSituation({
      salarié: "oui",
      dirigeant: "non",
      "salarié . convention collective": "'publicité'",
      [`${ns} . catégorie`]: "'employés'",
      [`${ns} . niveau`]: "'5'",
      "salarié . contrat . temps de travail . quotité": "100%",
    });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, null);
  });

  it("is inactive outside the selected convention", async () => {
    const engine = await makeEngine();
    engine.setSituation({ "salarié . convention collective": "'télécommunications'" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, null);
  });

  it("adds the 0.30% branch training contribution to the statutory contribution", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      salarié: "oui",
      dirigeant: "non",
      "salarié . convention collective": "'publicité'",
      [`${ns} . catégorie`]: "'employés'",
      [`${ns} . niveau`]: "'4'",
      "salarié . cotisations . assiette": "3000 €/mois",
      "entreprise . salariés . effectif": 10,
    });
    assert.ok(Math.abs((get(engine, "cotisations . formation professionnelle").nodeValue as number) - 25.5) < 1e-9);
    assert.equal(get(engine, "cotisations . formation professionnelle . contribution conventionnelle").nodeValue, 9);
  });
});
