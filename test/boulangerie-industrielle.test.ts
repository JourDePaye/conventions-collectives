import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "3255-boulangerie-industrielle";
const ns = "salarié . convention collective . boulangerie industrielle";

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((v) => v.version === "2025.1");
  assert.ok(version, "IDCC 3255 must be exported");
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "boulangerie industrielle"] } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

function set(engine: Engine, niveau = "'A1'", quotite = "100%") {
  engine.setSituation({
    "salarié": "oui",
    "dirigeant": "non",
    "salarié . convention collective": "'boulangerie industrielle'",
    [`${ns} . niveau`]: niveau,
    "salarié . contrat . temps de travail . quotité": quotite,
  });
}

const get = (engine: Engine) => engine.evaluate(`${ns} . salaire minimum conventionnel`);

const minima: Record<string, number> = {
  A1: 1804.8,
  A2: 1814.33,
  B1: 1825.01,
  B2: 1839.61,
  C1: 1855.52,
  C2: 1872.23,
  C3: 1892.82,
  D1: 1917.72,
  D2: 1933.07,
  D3: 1954.33,
  E1: 1988.82,
  E2: 2020.64,
  E3: 2074.18,
};

describe("IDCC 3255 — 2025 monthly minimum salaries", () => {
  for (const [niveau, amount] of Object.entries(minima)) {
    it(`${niveau} minimum is ${amount} euros`, async () => {
      const engine = await makeEngine();
      set(engine, `'${niveau}'`);
      assert.equal(get(engine).nodeValue, amount);
    });
  }

  it("prorates the 151.67-hour minimum for part-time work", async () => {
    const engine = await makeEngine();
    set(engine, "'E3'", "50%");
    assert.equal(get(engine).nodeValue, 1037.09);
  });

  it("rejects a classification outside the sourced grid", async () => {
    const engine = await makeEngine();
    set(engine, "'F1'");
    assert.equal(get(engine).nodeValue, null);
  });
});
