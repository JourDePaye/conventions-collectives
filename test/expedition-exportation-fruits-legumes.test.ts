import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1405-expedition-exportation-fruits-legumes";
const value = "expédition exportation fruits légumes";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(
  secteur: string,
  niveau: string,
  echelon?: string,
  quota = "100%",
) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . secteur`]: `'${secteur}'`,
    [`${namespace} . niveau`]: `'${niveau}'`,
    ...(echelon === undefined ? {} : { [`${namespace} . échelon`]: `'${echelon}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 1405 — 2026.1 minimum salaries", () => {
  it("starts on 1 April 2026 and cites the official extended salary amendment", () => {
    assert.equal(version.validFrom, "2026-04-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 33 du 4 mars 2026")));
    assert.ok(version.sources.some((source) => source.includes("Arrêté du 19 mai 2026")));
  });

  it("evaluates the general fruit and vegetable grid", () => {
    for (const [niveau, expected] of [["I", 1823.03], ["I bis", 1847.55], ["II", 1862.82], ["III", 1876.24], ["IV", 1943.32], ["V", 1964.92], ["VI", 2218.88], ["VII", 2394.32], ["VIII", 3449.23], ["IX", 4076.54]] as const) {
      setSituation("fruits et légumes", niveau);
      assert.equal(minimum(), expected, niveau);
    }
  });


  it("prorates the minimum once for part-time work", () => {
    setSituation("fruits et légumes", "III", undefined, "50%");
    assert.equal(minimum(), 938.12);
  });

  it("reports missing or out-of-grid classifications", () => {
    for (const [secteur, niveau, echelon] of [
      ["fruits et légumes", "X", undefined],
      ["légumes frais prêt à l’emploi", "I", "1"],
      ["secteur non modélisé", "I", undefined],
    ] as const) {
      setSituation(secteur, niveau, echelon);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true, `${secteur}/${niveau}/${echelon}`);
      assert.equal(minimum(), 0, `${secteur}/${niveau}/${echelon}`);
    }
  });

  it("leaves the model inapplicable for another agreement", () => {
    setSituation("fruits et légumes", "I");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
