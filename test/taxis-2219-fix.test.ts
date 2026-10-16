import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const ns = "salarié . convention collective . taxis";

async function makeEngine() {
  const version = COMPILED_VERSIONS["2219-taxis"]?.find((v) => v.version === "2025.2");
  assert.ok(version);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...new Set([...choice["une possibilité"], "taxis"])],
  } as Rule;
  Object.assign(rules, await version.loadRules());
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

function evaluate(engine: Engine, classification: string, rule: string, quotite?: string) {
  engine.setSituation({
    "salarié . convention collective": "'taxis'",
    [`${ns} . classification`]: `'${classification}'`,
    "salarié . contrat . statut cadre": "non",
    ...(quotite ? { "salarié . contrat . temps de travail . quotité": quotite } : {}),
  });
  return engine.evaluate(`${ns} . ${rule}`).nodeValue as number;
}

// Amounts read in the accord of 20 June 2025 (KALITEXT000052447745), articles 2, 3 and 4.
const drivers: [string, number, number][] = [
  ["niveau 1 — conducteur débutant — non titulaire carte professionnelle", 1837.86, 12.11],
  ["niveau 2 — conducteur confirmé — non titulaire carte professionnelle", 1853.34, 12.21],
  ["niveau 1 — conducteur débutant — titulaire carte professionnelle", 1837.86, 12.11],
  ["niveau 2 — conducteur confirmé — titulaire carte professionnelle", 1853.34, 12.21],
  ["niveau 3 — conducteur confirmé — titulaire carte professionnelle", 1868.81, 12.32],
];
// Hourly rates of article 4; the monthly minimum is the model's derivation (rate x 151.67 h, rounded to the cent).
const nonDriving: [string, number, number][] = [
  ["non roulant — échelon I", 12.33, 1870.09],
  ["non roulant — échelon II", 12.39, 1879.19],
  ["non roulant — échelon III", 12.68, 1923.18],
  ["non roulant — échelon IV", 14.45, 2191.63],
  ["non roulant — échelon V", 16.49, 2501.04],
  ["non roulant — échelon VI", 18.57, 2816.51],
];

describe("IDCC 2219 — taxis, version 2025.2", () => {
  it("carries the five driver lines (monthly and hourly published amounts)", async () => {
    const engine = await makeEngine();
    for (const [classification, monthly, hourly] of drivers) {
      assert.equal(evaluate(engine, classification, "salaire minimum conventionnel"), monthly, classification);
      assert.equal(evaluate(engine, classification, "taux horaire minimum conventionnel"), hourly, classification);
    }
  });

  it("carries the six non-driving hourly rates and derived monthly minima", async () => {
    const engine = await makeEngine();
    for (const [classification, hourly, monthly] of nonDriving) {
      assert.equal(evaluate(engine, classification, "taux horaire minimum conventionnel"), hourly, classification);
      assert.equal(evaluate(engine, classification, "salaire minimum conventionnel"), monthly, classification);
    }
  });

  it("prorates once for part-time", async () => {
    const engine = await makeEngine();
    assert.equal(evaluate(engine, "niveau 3 — conducteur confirmé — titulaire carte professionnelle", "salaire minimum conventionnel", "50 %"), 934.405);
    assert.equal(evaluate(engine, "niveau 1 — conducteur débutant — titulaire carte professionnelle", "salaire minimum conventionnel", "50 %"), 918.93);
  });

  it("reports a classification absent from the accord", async () => {
    const engine = await makeEngine();
    assert.equal(evaluate(engine, "niveau 3 — conducteur confirmé — non titulaire carte professionnelle", "salaire minimum conventionnel"), 0);
    assert.equal(engine.evaluate(`${ns} . classification hors grille`).nodeValue, true);
    assert.equal(evaluate(engine, "non roulant — échelon VII", "classification hors grille"), true);
    assert.equal(evaluate(engine, "non roulant — échelon I", "classification hors grille"), false);
    assert.equal(engine.evaluate(`${ns} . audit paie`).nodeValue, false);
  });
});
