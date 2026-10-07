import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0413-personnes-handicapees";
const value = "personnes handicapées et inadaptées";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2022.1");
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

function setSituation(coefficient: number | undefined, options: { nexem?: boolean; quota?: string } = {}) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(coefficient === undefined ? {} : { [`${namespace} . coefficient`]: coefficient }),
    ...(options.nexem === undefined ? {} : { [`${namespace} . adhérent à Nexem`]: options.nexem ? "oui" : "non" }),
    ...(options.quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": options.quota }),
  });
}

const minimum = () => {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
};

const outOfGrid = () => engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue;

describe("IDCC 413 — 2022.1 indexed salary", () => {
  it("is in force from 1 July 2022 and cites the avenant and the Nexem recommendation", () => {
    assert.equal(version.validFrom, "2022-07-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 361 du 9 juin 2021")));
    assert.ok(version.sources.some((source) => source.includes("Nexem")));
  });

  it("multiplies the coefficient by 3.82 € without Nexem", () => {
    // Hand-computed: 434 × 3.82 = 1 657.88; 800 × 3.82 = 3 056; 1 000 × 3.82 = 3 820.
    for (const [coefficient, expected] of [[434, 1657.88], [489, 1867.98], [800, 3056], [1000, 3820]] as const) {
      setSituation(coefficient);
      assert.equal(minimum(), expected, `${coefficient}`);
      assert.equal(outOfGrid(), false);
    }
  });

  it("multiplies the coefficient by 3.93 € for Nexem members", () => {
    // 434 × 3.93 = 1 705.62 (the example given by the pages consulted), 373 × 3.93 = 1 465.89.
    for (const [coefficient, expected] of [[373, 1465.89], [434, 1705.62], [800, 3144]] as const) {
      setSituation(coefficient, { nexem: true });
      assert.equal(minimum(), expected, `${coefficient}`);
    }
  });

  it("prorates the minimum once for part-time work", () => {
    setSituation(600, { quota: "50%" });
    assert.equal(minimum(), 1146);
    setSituation(600, { nexem: true, quota: "80%" });
    assert.equal(minimum(), 1886.4);
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
