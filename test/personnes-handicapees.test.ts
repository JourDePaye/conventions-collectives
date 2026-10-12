import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0413-personnes-handicapees";
const value = "personnes handicapées et inadaptées";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
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

function setSituation(coefficient: number | undefined, options: { nexem?: boolean; quota?: string; internat?: boolean; cadre?: boolean } = {}) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(coefficient === undefined ? {} : { [`${namespace} . coefficient`]: coefficient }),
    ...(options.nexem === undefined ? {} : { [`${namespace} . adhérent à Nexem`]: options.nexem ? "oui" : "non" }),
    ...(options.internat === undefined ? {} : { [`${namespace} . sujétion d'internat`]: options.internat ? "oui" : "non" }),
    ...(options.quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": options.quota }),
    ...(options.cadre === undefined ? {} : { "salarié . contrat . statut cadre": options.cadre ? "oui" : "non" }),
  });
}

const minimum = () => {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
};

const outOfGrid = () => engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue;

describe("IDCC 413 — 2026.1 indexed salary", { concurrency: false }, () => {
  it("is in force from 1 July 2022 and cites the avenant, Nexem recommendation and sujétion rule", () => {
    assert.equal(version.validFrom, "2022-07-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 361 du 9 juin 2021")));
    assert.ok(version.sources.some((source) => source.includes("Nexem")));
    assert.ok(version.sources.some((source) => source.includes("9,21 %")));
  });

  it("applies 3.82 € and the 9.21 % sujétion allowance without Nexem", () => {
    // Hand-computed from coefficient × 3.82 × 1.0921.
    for (const [coefficient, expected] of [[434, 1810.57], [489, 2040.02], [800, 3337.46], [1000, 4171.82]] as const) {
      setSituation(coefficient);
      assert.equal(minimum(), expected, `${coefficient}`);
      assert.equal(outOfGrid(), false);
    }
  });

  it("applies the Nexem point, floor indices and sujétion allowance", () => {
    // 403 × 3.93 × 1.0921 = 1 729.66; the 413 floor applies with internat sujétion.
    for (const [coefficient, expected] of [[373, 1729.66], [434, 1862.71], [800, 3433.56]] as const) {
      setSituation(coefficient, { nexem: true });
      assert.equal(minimum(), expected, `${coefficient}`);
    }
    setSituation(400, { nexem: true, quota: "100%", internat: true });
    assert.equal(minimum(), 1772.58);
  });

  it("prorates the minimum once for part-time work", () => {
    setSituation(600, { quota: "50%" });
    assert.equal(minimum(), 1251.55);
    setSituation(600, { nexem: true, quota: "80%" });
    assert.equal(minimum(), 2060.14);
  });

  it("does not add the sujétion allowance for cadres", () => {
    setSituation(434, { nexem: true, cadre: true });
    assert.equal(minimum(), 1705.62);
  });

  it("treats a missing or zero coefficient as outside the grid", () => {
    for (const coefficient of [undefined, 0]) {
      setSituation(coefficient);
      assert.equal(outOfGrid(), true);
      assert.equal(minimum(), 0);
    }
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation(434);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, null);
  });
});
