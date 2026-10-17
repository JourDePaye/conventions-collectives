import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1672-societes-assurances";
const value = "sociétés assurances";
const ns = `salarié . convention collective . ${value}`;

async function makeEngine(revision = "2026.4") {
  const version = COMPILED_VERSIONS[agreement]?.find((v) => v.version === revision);
  assert.ok(version, revision);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, await version.loadRules());
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

function set(engine: Engine, level: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${ns} . niveau`]: `'${level}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}
const get = (engine: Engine, rule: string) => engine.evaluate(`${ns} . ${rule}`).nodeValue;

// Annexe of the protocole d'accord du 10 juin 2026 (KALITEXT000054887698), euros a year.
const RMA_2026: Record<string, number> = { "1": 22680, "2": 24120, "3": 25580, "4": 30140, "5": 35430, "6": 45030, "7": 60940 };

describe("IDCC 1672 — 2026.4 (protocole du 10 juin 2026, non étendu)", () => {
  it("keeps validFrom 2026-01-01 and cites the protocole", async () => {
    const version = COMPILED_VERSIONS[agreement]?.find((v) => v.version === "2026.4");
    assert.ok(version);
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((s) => s.includes("KALITEXT000054887698")));
  });

  for (const [level, annual] of Object.entries(RMA_2026)) {
    it(`class ${level}: ${annual} euros a year`, async () => {
      const engine = await makeEngine();
      set(engine, level);
      assert.equal(get(engine, "salaire minimum annuel conventionnel"), annual);
      assert.equal(get(engine, "niveau hors grille"), false);
    });
  }

  it("gives the twelfth as an indicative monthly figure", async () => {
    const engine = await makeEngine();
    for (const [level, monthly] of [["1", 1890], ["3", 2131.67], ["7", 5078.33]] as const) {
      set(engine, level);
      assert.equal(Math.round((get(engine, "salaire minimum conventionnel") as number) * 100) / 100, monthly, level);
    }
  });

  it("prorates for part-time work", async () => {
    const engine = await makeEngine();
    set(engine, "3", "50%");
    assert.equal(get(engine, "salaire minimum annuel conventionnel"), 12790);
    set(engine, "5", "80%");
    assert.equal(get(engine, "salaire minimum annuel conventionnel"), 28344);
  });

  it("rejects classes outside the grid", async () => {
    const engine = await makeEngine();
    for (const level of ["0", "8", "A", "non renseigné"]) {
      set(engine, level);
      assert.equal(get(engine, "niveau hors grille"), true, level);
      assert.equal(get(engine, "salaire minimum annuel conventionnel"), 0, level);
    }
  });

});
