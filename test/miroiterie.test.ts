import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const namespace = "salarié . convention collective . miroiterie transformation négoce verre";

async function engine() {
  const version = COMPILED_VERSIONS["1499-miroiterie"]?.find((v) => v.version === "2025.1");
  assert.ok(version);
  const rules: Record<string, Rule> = { ...modeleSocial, ...(await version.loadRules()) };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...new Set([...choice["une possibilité"], "miroiterie transformation négoce verre"])],
  } as Rule;
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

describe("miroiterie transformation négoce verre (IDCC 1499)", () => {
  it("calcule et prorate le minimum mensuel", async () => {
    const e = await engine();
    e.setSituation({
      "salarié . convention collective": "'miroiterie transformation négoce verre'",
      [`${namespace} . coefficient`]: 300,
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(e.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2157.51);
    e.setSituation({
      "salarié . convention collective": "'miroiterie transformation négoce verre'",
      [`${namespace} . coefficient`]: 300,
      "salarié . contrat . statut cadre": "non",
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(e.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1078.755);
  });

  it("expose le SMP horaire et applique la prime d'ancienneté", async () => {
    const e = await engine();
    e.setSituation({
      "salarié . convention collective": "'miroiterie transformation négoce verre'",
      [`${namespace} . coefficient`]: 250,
      [`${namespace} . ancienneté`]: "6 années",
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(e.evaluate(`${namespace} . salaire minimum horaire`).nodeValue, 12.94);
    assert.equal(e.evaluate(`${namespace} . prime ancienneté horaire`).nodeValue, 0.7764);
  });

  it("expose la prime de panier et détecte un coefficient hors grille", async () => {
    const e = await engine();
    e.setSituation({
      "salarié . convention collective": "'miroiterie transformation négoce verre'",
      [`${namespace} . coefficient`]: 999,
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(e.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0);
    assert.equal(e.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
    assert.equal(e.evaluate(`${namespace} . prime de panier de nuit`).nodeValue, 2882.768);
  });
});
