import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "commerce alimentaire";
const namespace = `salarié . convention collective . ${value}`;
type VersionNumber = "2026.2";
const versionNumber: VersionNumber = "2026.2";
const annual = { "4B": 26706 };

async function setup(versionNumber: VersionNumber) {
  const version = COMPILED_VERSIONS["2216-commerce-detail-gros-predominance-alimentaire"]?.find((v) => v.version === versionNumber);
  assert.ok(version);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"]!, value] } as Rule;
  Object.assign(rules, await version.loadRules());
  return { engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }), version };
}

function amount(engine: Engine, rule: string) {
  const result = engine.evaluate(`${namespace} . ${rule}`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 2216 payroll rubrics", () => {
  it("2026.2 exposes annual 12-month guarantees and 216-day forfait minima", async () => {
      const { engine } = await setup(versionNumber);
      engine.setSituation({ "salarié . convention collective": `'${value}'`, [`${namespace} . niveau`]: "'4B'" });
      assert.equal(amount(engine, "salaire minimum annuel conventionnel"), annual["4B"]);
      engine.setSituation({ "salarié . convention collective": `'${value}'`, [`${namespace} . niveau`]: "'4B'", "salarié . contrat . temps de travail . quotité": "50%" });
      assert.equal(amount(engine, "salaire minimum annuel conventionnel"), annual["4B"] / 2);
      engine.setSituation({ "salarié . convention collective": `'${value}'`, [`${namespace} . niveau`]: "'7'", [`${namespace} . mois dans le niveau`]: "36 mois" });
      assert.equal(amount(engine, "salaire minimum annuel forfait jours"), 39800);
      engine.setSituation({ "salarié . convention collective": `'${value}'`, [`${namespace} . niveau`]: "'8'", [`${namespace} . mois dans le niveau`]: "37 mois" });
      assert.equal(amount(engine, "salaire minimum annuel forfait jours"), 55560);
      engine.setSituation({ "salarié . convention collective": `'${value}'`, [`${namespace} . niveau`]: "'6'" });
      assert.equal(amount(engine, "salaire minimum annuel forfait jours"), 0);
    });
});