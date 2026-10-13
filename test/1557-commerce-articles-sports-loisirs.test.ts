import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const namespace = "salarié . convention collective . commerce articles sports loisirs";

describe("IDCC 1557 commerce des articles de sports et équipements de loisirs", () => {
  async function engine(classification: string) {
    const version = COMPILED_VERSIONS["1557-commerce-articles-sports-loisirs"]?.find((v) => v.version === "2025.1");
    assert.ok(version);
    const rules: Record<string, Rule> = { ...modeleSocial, ...(await version.loadRules()) };
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = {
      ...choice,
      "une possibilité": [...new Set([...choice["une possibilité"], "commerce articles sports loisirs"])],
    } as Rule;
    const result = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    result.setSituation({
      "salarié . convention collective": "'commerce articles sports loisirs'",
      [`${namespace} . classification`]: `'${classification}'`,
      "salarié . contrat . temps de travail . quotité": "80%",
    });
    return result;
  }

  it("evaluates the 2025 general grid and prorates it", async () => {
    const result = await engine("250");
    assert.equal(result.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2089 * 0.8);
  });

  it("evaluates the 2025 workers grid", async () => {
    const result = await engine("O3");
    assert.equal(result.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1874 * 0.8);
  });

  it("returns zero for an unknown classification", async () => {
    const result = await engine("unknown");
    assert.equal(result.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0);
  });
});
