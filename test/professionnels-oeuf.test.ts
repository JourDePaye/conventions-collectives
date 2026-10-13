import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const model = "2075-professionnels-oeuf";
const value = "professionnels de l'œuf";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[model]?.find((entry) => entry.version === "2025.1");
assert.ok(version, "IDCC 2075 version 2025.1 must be compiled");
const extension = await version.loadRules();

async function makeEngine() {
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], value],
  } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

function set(engine: Engine, niveau = "'A1'", quotite = "100%") {
  engine.setSituation({
    "salarié": "oui",
    "dirigeant": "non",
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: niveau,
    "salarié . contrat . temps de travail . quotité": quotite,
  });
}

const get = (engine: Engine) => engine.evaluate(`${namespace} . salaire minimum conventionnel`);

const minima: Record<string, number> = {
  A1: 1804.8, A2: 1814.33, B1: 1825.01, B2: 1839.61,
  C1: 1855.52, C2: 1872.23, C3: 1892.82, D1: 1917.72,
  D2: 1933.07, D3: 1954.33, E1: 1988.82, E2: 2020.64, E3: 2074.18,
};

describe("IDCC 2075 — 2025.1 professionnels de l'œuf", () => {
  it("uses the successor agreement's official metadata", () => {
    assert.equal(version.validFrom, "2025-02-01");
    assert.ok(version.sources.includes("https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000052299903"));
    assert.ok(version.sources.includes("https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000051160618"));
  });

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

  it("does not apply when another convention is selected", async () => {
    const engine = await makeEngine();
    engine.setSituation({ "salarié . convention collective": "'pâtisserie'", [`${namespace} . niveau`]: "'E3'" });
    assert.equal(get(engine).nodeValue, null);
  });
});
