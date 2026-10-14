import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0959-laboratoires-biologie-medicale";
const value = "laboratoires biologie médicale";
const namespace = `salarié . convention collective . ${value}`;

async function engineFor(coefficient: number, quotité = "100%") {
  const version = COMPILED_VERSIONS[agreement]?.find((candidate) => candidate.version === "2024.1");
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...new Set([...choice["une possibilité"], value])],
  } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . coefficient`]: coefficient,
    "salarié . contrat . statut cadre": "non",
    "salarié . contrat . temps de travail . quotité": quotité,
  });
  return { engine, version };
}

describe("IDCC 959 — laboratoires de biologie médicale 2024.1", () => {
  it("starts on 1 January 2024 and cites the extended official salary agreement", () => {
    const version = COMPILED_VERSIONS[agreement]?.find((candidate) => candidate.version === "2024.1");
    assert.ok(version);
    assert.equal(version.validFrom, "2024-01-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000049300356")));
    assert.ok(version.sources.some((source) => source.includes("KALICONT000005635844")));
  });

  it("evaluates sourced coefficients across personnel grids", async () => {
    for (const [coefficient, expected] of [[135, 1767.20], [240, 1885.58], [350, 2563.57], [800, 5608.31]] as const) {
      const { engine } = await engineFor(coefficient);
      assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, expected, `${coefficient}`);
    }
  });

  it("prorates the monthly minimum by the contractual work quotient", async () => {
    const { engine } = await engineFor(270, "80%");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1648.432);
  });

  it("isolates an out-of-grid coefficient and exposes the payroll audit omission", async () => {
    const { engine } = await engineFor(999);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, false);
  });
});
