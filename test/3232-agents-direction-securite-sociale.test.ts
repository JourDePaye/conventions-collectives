import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "agents de direction sécurité sociale";
const namespace = `salarié . convention collective . ${value}`;

async function makeEngine() {
  const version = COMPILED_VERSIONS["3232-agents-direction-securite-sociale"]?.find((v) => v.version === "2025.2");
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  for (const name of Object.keys(extension)) {
    assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
    assert.ok(!(name in rules), `Duplicate modele-social rule: ${name}`);
  }
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

describe("IDCC 3232 agents de direction sécurité sociale — 2025.2", () => {
  it("calculates the double-residence allowance and child supplement", async () => {
    const engine = await makeEngine();
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . zone double résidence`]: 1,
      [`${namespace} . enfants à charge`]: 2,
    });
    assert.ok(Math.abs((engine.evaluate(`${namespace} . indemnité double résidence`).nodeValue as number) - 1171.36) < 1e-9);
  });

  it("exposes the sourced vehicle-loan caps and payroll audit", async () => {
    const engine = await makeEngine();
    engine.setSituation({ "salarié . convention collective": `'${value}'` });
    assert.equal(engine.evaluate(`${namespace} . plafond prêt automobile`).nodeValue, 8970.87);
    assert.equal(engine.evaluate(`${namespace} . plafond renouvellement prêt automobile`).nodeValue, 5912.58);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
  });

  it("is isolated from another agreement", async () => {
    const engine = await makeEngine();
    engine.setSituation({ "salarié . convention collective": "'casinos'" });
    assert.equal(engine.evaluate(`${namespace} . indemnité double résidence`).nodeValue, null);
  });
});
