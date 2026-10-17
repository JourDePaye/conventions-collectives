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

// Version 2026.2: the main grid's levels carry their category as in the avenant n° 33
// (KALITEXT000054370669), and the grid of the annex « Légumes frais prêt à l'emploi » of the
// avenant n° 14 (KALITEXT000054337310) is added.
describe("IDCC 1405 — 2026.2 (avenants n° 33 and n° 14)", async () => {
  const revised = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.2");
  assert.ok(revised);
  const revisedRules: Record<string, Rule> = { ...rules, ...(await revised.loadRules()) };
  const revisedEngine = new Engine(revisedRules, { logger: { log() {}, warn() {}, error() {} } });
  const evaluate = (secteur: string | undefined, niveau: string, rule = "salaire minimum conventionnel", quota = "100%") => {
    revisedEngine.setSituation({
      "salarié . convention collective": `'${value}'`,
      ...(secteur === undefined ? {} : { [`${namespace} . secteur`]: `'${secteur}'` }),
      [`${namespace} . niveau`]: `'${niveau}'`,
      "salarié . contrat . temps de travail . quotité": quota,
    });
    return revisedEngine.evaluate(`${namespace} . ${rule}`).nodeValue;
  };

  it("applies from 1 April 2026, to every employer from the extension on 29 May 2026", () => {
    assert.equal(revised.validFrom, "2026-04-01");
    assert.equal(revised.extension, "2026-05-29");
  });

  it("evaluates the main grid by category and level", () => {
    for (const [niveau, expected] of [
      ["ouvrier/employé I", 1823.03],
      ["ouvrier/employé I bis", 1847.55],
      ["ouvrier/employé II", 1862.82],
      ["ouvrier/employé III", 1876.24],
      ["ouvrier/employé IV", 1943.32],
      ["ouvrier/employé V", 1964.92],
      ["technicien/AM I", 2218.88],
      ["technicien/AM II", 2394.32],
      ["cadre I", 3449.23],
      ["cadre de direction II", 4076.54],
    ] as const) {
      assert.equal(evaluate("fruits et légumes", niveau), expected, niveau);
    }
  });

  it("evaluates the grid of the annex « Légumes frais prêt à l'emploi » by level and step", () => {
    for (const [niveau, expected] of [
      ["I.1", 1832.03],
      ["I.3", 1837.06],
      ["II.1", 1840.2],
      ["III.3", 1866.42],
      ["IV.2", 1892.63],
      ["V.3", 1966.03],
      ["VI.1", 2007.97],
      ["VII.3", 2343.51],
      ["VIII.1", 2469.33],
      ["IX.2", 2726.23],
      ["X.1", 2888.75],
      ["XI.2", 3145.65],
    ] as const) {
      assert.equal(evaluate("légumes frais prêt à l’emploi", niveau), expected, niveau);
    }
  });

  it("prorates the minimum once for part-time work", () => {
    assert.equal(evaluate("légumes frais prêt à l’emploi", "IV.2", undefined, "50%"), 946.315);
  });

  it("reports a level of the other grid, an unknown level and a missing grid as out of the grid", () => {
    for (const [secteur, niveau] of [
      ["fruits et légumes", "VI"],
      ["fruits et légumes", "IV.2"],
      ["légumes frais prêt à l’emploi", "ouvrier/employé I"],
      ["légumes frais prêt à l’emploi", "XI.3"],
      [undefined, "ouvrier/employé I"],
    ] as const) {
      assert.equal(evaluate(secteur, niveau, "niveau hors grille"), true, `${secteur}/${niveau}`);
    }
  });
});
