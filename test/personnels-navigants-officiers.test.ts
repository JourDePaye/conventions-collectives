import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const namespace = "salarié . convention collective . personnels navigants officiers transport maritime";

async function engine() {
  const version = COMPILED_VERSIONS["3223-personnels-navigants-officiers"]?.find((v) => v.version === "2025.1");
  assert.ok(version);
  const rules: Record<string, Rule> = { ...modeleSocial, ...(await version.loadRules()) };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...new Set([...choice["une possibilité"], "personnels navigants officiers transport maritime"])],
  } as Rule;
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

describe("personnels navigants officiers transport maritime (IDCC 3223)", () => {
  it("calcule le minimum annuel de la grille", async () => {
    const e = await engine();
    e.setSituation({
      "salarié . convention collective": "'personnels navigants officiers transport maritime'",
      [`${namespace} . fonction et zone`]: "'capitaine ≥15000 UMS — long cours'",
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(e.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, 63049.92);
  });

  it("prorate le minimum annuel selon la quotité", async () => {
    const e = await engine();
    e.setSituation({
      "salarié . convention collective": "'personnels navigants officiers transport maritime'",
      [`${namespace} . fonction et zone`]: "'capitaine ≥15000 UMS — long cours'",
      "salarié . contrat . statut cadre": "non",
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(e.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, 31524.96);
  });

  it("expose les forfaits et détecte une fonction hors grille", async () => {
    const e = await engine();
    e.setSituation({
      "salarié . convention collective": "'personnels navigants officiers transport maritime'",
      [`${namespace} . fonction et zone`]: "'fonction inconnue'",
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(e.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, 0);
    assert.equal(e.evaluate(`${namespace} . fonction et zone hors grille`).nodeValue, true);
    assert.equal(e.evaluate(`${namespace} . indemnité de nourriture`).nodeValue, 15.76);
    assert.equal(e.evaluate(`${namespace} . indemnité frais divers`).nodeValue, 11.2);
  });
});
