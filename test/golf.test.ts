import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const namespace = "salarié . convention collective . golf";

async function engine(situation: Record<string, string> = {}) {
  const version = COMPILED_VERSIONS["2021-golf"]?.find((v: { version: string }) => v.version === "2026.1");
  assert.ok(version);
  const rules = { ...modeleSocial, ...(await version.loadRules()) };
  const choice = rules["salarié . convention collective"] as { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...new Set([...choice["une possibilité"], "golf"])],
  };
  const instance = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  instance.setSituation({ "salarié . convention collective": "'golf'", ...situation });
  return instance;
}

describe("IDCC 2021 golf", () => {
  it("applies the 1 April 2026 monthly grid to all seven groups", async () => {
    const expected = [1882.56, 1899.84, 1975.06, 2136.68, 2379.63, 3032.22, 3586.21];
    for (const [index, minimum] of expected.entries()) {
      const e = await engine({ [`${namespace} . groupe`]: `'${index + 1}'` });
      assert.equal(e.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, minimum);
    }
  });

  it("prorates monthly minimums by the contract quotient", async () => {
    const e = await engine({
      [`${namespace} . groupe`]: "'3'",
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(e.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 987.53);
  });

  it("keeps the annual group 6 guarantee in euros per year after two years", async () => {
    const e = await engine({
      [`${namespace} . groupe`]: "'6'",
      [`${namespace} . deux ans d'ancienneté`]: "oui",
    });
    assert.equal(e.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, 37899);
    assert.equal(e.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 3032.22);
  });

  it("uses the annual social-security ceiling for group 7 after two years", async () => {
    const e = await engine({
      [`${namespace} . groupe`]: "'7'",
      [`${namespace} . deux ans d'ancienneté`]: "oui",
    });
    assert.equal(e.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, 48060);
  });

  it("does not produce a minimum for an unknown group", async () => {
    const e = await engine({ [`${namespace} . groupe`]: "'8'" });
    assert.equal(e.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });

  it("is inapplicable outside the golf convention", async () => {
    const version = COMPILED_VERSIONS["2021-golf"]?.find((v: { version: string }) => v.version === "2026.1");
    assert.ok(version);
    const rules = { ...modeleSocial, ...(await version.loadRules()) };
    const e = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    e.setSituation({ [`${namespace} . groupe`]: "'3'" } as Record<string, string>);
    assert.equal(e.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
