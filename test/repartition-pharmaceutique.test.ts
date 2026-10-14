import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const namespace = "salarié . convention collective . répartition pharmaceutique";

async function engine(versionNumber: string) {
  const version = COMPILED_VERSIONS["1621-repartition-pharmaceutique"]?.find((v) => v.version === versionNumber);
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial, ...extension };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...new Set([...choice["une possibilité"], "répartition pharmaceutique"])],
  } as Rule;
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

describe("répartition pharmaceutique (IDCC 1621)", () => {
  it("calcule les minima des deux dates de la grille 2025", async () => {
    const january = await engine("2025.1");
    january.setSituation({
      "salarié . convention collective": "'répartition pharmaceutique'",
      [`${namespace} . coefficient`]: 300,
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(january.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2844.38);

    const july = await engine("2025.2");
    july.setSituation({
      "salarié . convention collective": "'répartition pharmaceutique'",
      [`${namespace} . coefficient`]: 300,
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(july.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 2872.82);
  });

  it("prorate la rémunération mensuelle selon la quotité", async () => {
    const e = await engine("2025.2");
    e.setSituation({
      "salarié . convention collective": "'répartition pharmaceutique'",
      [`${namespace} . coefficient`]: 300,
      "salarié . contrat . statut cadre": "non",
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(e.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1436.41);
  });

  it("ne extrapole pas un coefficient absent", async () => {
    const e = await engine("2025.2");
    e.setSituation({
      "salarié . convention collective": "'répartition pharmaceutique'",
      [`${namespace} . coefficient`]: 301,
      "salarié . contrat . statut cadre": "non",
    });
    assert.equal(e.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0);
    assert.equal(e.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
  });
});
