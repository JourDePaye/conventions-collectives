import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

describe("bijouterie, joaillerie, orfèvrerie, horlogerie (IDCC 3251)", () => {
  async function engineFor(classification: string, quotient = "100%") {
    const version = COMPILED_VERSIONS["3251-bijouterie-joaillerie-horlogerie"]?.find((v) => v.version === "2025.1");
    assert.ok(version);
    const extension = await version.loadRules();
    const rules: Record<string, Rule> = { ...modeleSocial, ...extension };
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = {
      ...choice,
      "une possibilité": [...new Set([...choice["une possibilité"], "bijouterie joaillerie orfèvrerie horlogerie"])],
    } as Rule;
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    engine.setSituation({
      "salarié . convention collective": "'bijouterie joaillerie orfèvrerie horlogerie'",
      "salarié . convention collective . bijouterie joaillerie orfèvrerie horlogerie . classification": `'${classification}'`,
      "salarié . contrat . statut cadre": "non",
      "salarié . contrat . temps de travail . quotité": quotient,
    });
    return { engine, namespace: "salarié . convention collective . bijouterie joaillerie orfèvrerie horlogerie" };
  }

  it("calcule un minimum de la grille 2025.1", async () => {
    const { engine, namespace } = await engineFor("3.2");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2227);
  });

  it("prorate le minimum selon la quotité", async () => {
    const { engine, namespace } = await engineFor("3.2", "50%");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1113.5);
  });

  it("n'extrapole pas une classification absente", async () => {
    const { engine, namespace } = await engineFor("8.1");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0);
    assert.equal(engine.evaluate(`${namespace} . classification hors grille`).nodeValue, true);
  });

  it("expose l'audit paie sans inventer de taux conventionnel", async () => {
    const { engine, namespace } = await engineFor("1.1");
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
  });
});
