import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "3255-boulangerie-industrielle";
const ns = "salarié . convention collective . boulangerie industrielle";

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((v) => v.version === "2026.1");
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
  A1: 1840.02,
  A2: 1849.72,
  B1: 1860.6,
  B2: 1875.74,
  C1: 1891.96,
  C2: 1908.98,
  C3: 1930.22,
  D1: 1955.63,
  D2: 1971.29,
  D3: 1992.99,
  E1: 2028.16,
  E2: 2060.61,
  E3: 2115.22,
};

describe("IDCC 3255 — 2026 monthly minimum salaries", () => {
  it("uses the extended 2026.1 salary amendment metadata", async () => {
    const version = COMPILED_VERSIONS[id]?.find((v) => v.version === "2026.1");
    assert.ok(version);
    assert.equal(version.validFrom, "2026-04-01");
    assert.ok(version.sources.includes("https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000054162288"));
    assert.ok(version.sources.includes("https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053907634"));
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
    assert.equal(get(engine).nodeValue, 1057.61);
  });

  it("rejects a classification outside the sourced grid", async () => {
    const engine = await makeEngine();
    set(engine, "'F1'");
    assert.equal(get(engine).nodeValue, null);
  });
});
