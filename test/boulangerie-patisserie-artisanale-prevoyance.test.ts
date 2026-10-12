import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0843-boulangerie-patisserie-artisanale";
const value = "boulangerie-pâtisserie artisanale";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.2");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = {
  ...choice,
  "une possibilité": [...choice["une possibilité"], value],
} as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(cadre: "oui" | "non") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: cadre === "oui" ? "'C1'" : "'170'",
    "salarié . contrat . salaire brut": "2000 €/mois",
    "salarié . contrat . statut cadre": cadre,
  });
}

describe("IDCC 843 — rente éducation conventionnelle", () => {
  it("applies the 0.065% employer rate to non-cadres and cadres", () => {
    for (const cadre of ["non", "oui"] as const) {
      setSituation(cadre);
      assert.ok(Math.abs((engine.evaluate(`${namespace} . prévoyance . rente éducation . employeur`).nodeValue as number) - 1.3) < 1e-9);
      assert.ok(Math.abs((engine.evaluate(`${namespace} . prévoyance . rente éducation`).nodeValue as number) - 1.3) < 1e-9);
    }
  });

  it("does not alter the standard social contribution endpoint", () => {
    setSituation("non");
    assert.equal(engine.evaluate("salarié . cotisations . prévoyances . conventionnelle").nodeValue, 0);
  });
});
