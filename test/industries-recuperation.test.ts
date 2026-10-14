import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const namespace = "salarié . convention collective . industries récupération";

async function engine() {
  const version = COMPILED_VERSIONS["1589-industries-recuperation"]?.find((v) => v.version === "2026.1");
  assert.ok(version);
  const rules: Record<string, Rule> = { ...modeleSocial, ...(await version.loadRules()) };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...new Set([...choice["une possibilité"], "industries récupération"])],
  } as Rule;
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

describe("industries et commerce de la récupération (IDCC 1589)", () => {
  it("calcule et prorate le minimum mensuel", async () => {
    const e = await engine();
    e.setSituation({
      "salarié . convention collective": "'industries récupération'",
      [`${namespace} . niveau`]: 10,
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(e.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2280);
    e.setSituation({
      "salarié . convention collective": "'industries récupération'",
      [`${namespace} . niveau`]: 10,
      "salarié . contrat . statut cadre": "non",
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(e.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1140);
  });

  it("détecte un niveau hors grille", async () => {
    const e = await engine();
    e.setSituation({
      "salarié . convention collective": "'industries récupération'",
      [`${namespace} . niveau`]: 99,
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(e.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0);
    assert.equal(e.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
  });
});
