import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "2583-societes-autoroutes";
const value = "sociétés autoroutes";
const ns = `salarié . convention collective . ${value}`;

async function makeEngine(revision: string) {
  const version = COMPILED_VERSIONS[id]?.find((v) => v.version === revision);
  assert.ok(version, revision);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, await version.loadRules());
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

function evaluate(engine: Engine, classe: string | undefined, quota = "100%", rule = "salaire minimum annuel conventionnel") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(classe === undefined ? {} : { [`${ns} . classe`]: `'${classe}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
  return engine.evaluate(`${ns} . ${rule}`).nodeValue;
}

// Annexe of the accord of 21 October 2025 (KALITEXT000053428773), amounts 2025 in euros a year.
const RAG_2025 = { A: 22681, B: 23131, C: 24074, D: 25374, E: 26927, F: 28779, G: 30986, H: 33700, I: 36974, J: 40967, K: 45657, L: 51915, M: 56617, N: 62963, O: 69458, P: 75951 } as const;

describe("IDCC 2583 — RAG 2025", () => {
  it("is dated 1 January 2025 and cites the accord of 21 October 2025", () => {
    const version = COMPILED_VERSIONS[id]?.find((v) => v.version === "2025.1");
    assert.ok(version);
    assert.equal(version.validFrom, "2025-01-01");
    assert.ok(version.sources.some((s) => s.includes("KALITEXT000053428773")));
  });

  for (const [classe, amount] of Object.entries(RAG_2025)) {
    it(`class ${classe}: ${amount} euros a year`, async () => {
      const engine = await makeEngine("2025.1");
      assert.equal(evaluate(engine, classe), amount);
      assert.equal(evaluate(engine, classe, "100%", "classe hors grille"), false);
    });
  }

  it("prorates the annual guarantee for part-time work", async () => {
    const engine = await makeEngine("2025.1");
    assert.equal(evaluate(engine, "I", "50%"), 18487);
    assert.equal(evaluate(engine, "A", "80%"), 18144.8);
  });

  it("flags classes outside the grid", async () => {
    const engine = await makeEngine("2025.1");
    for (const classe of ["Q", "a", "1", "non renseigné"]) {
      assert.equal(evaluate(engine, classe, "100%", "classe hors grille"), true, classe);
      assert.equal(evaluate(engine, classe), 0, classe);
    }
    assert.equal(evaluate(engine, undefined, "100%", "classe hors grille"), true);
  });

  it("keeps the 2024 grid in its own version", async () => {
    const engine = await makeEngine("2024.1");
    assert.equal(evaluate(engine, "A"), 22280);
    assert.equal(evaluate(engine, "P"), 74608);
  });
});
