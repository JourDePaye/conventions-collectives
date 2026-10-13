import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const model = "2098-prestataires-tertiaire";
const value = "prestataires tertiaires";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[model]?.find((entry) => entry.version === "2026.2");
assert.ok(version, "IDCC 2098 version 2026.2 must be compiled");
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = {
  ...choice,
  "une possibilité": [...new Set([...choice["une possibilité"], value])],
} as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

const MONTHLY: Record<number, number> = {
  120: 1867.02, 130: 1867.02, 140: 1867.02, 150: 1870, 160: 1873.97,
  170: 1881.88, 190: 1905.6, 200: 1972.87, 220: 2038.12, 230: 2080.34,
  240: 2141.75, 250: 2195.48, 260: 2268.41, 280: 2553.54, 290: 2734.06,
  300: 3204.15, 330: 3249.28, 360: 3474.92, 390: 3756.98, 420: 4039.03,
  450: 4934.09, 500: 5836.67, 550: 6427.1,
};

function setSituation(coefficient: number | undefined, quota?: string, context: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(coefficient === undefined ? {} : { [`${namespace} . coefficient`]: coefficient }),
    ...(quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": quota }),
    ...context,
  });
}

function amount(name: string) {
  const result = engine.evaluate(`${namespace} . ${name}`).nodeValue;
  assert.equal(typeof result, "number", name);
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 2098 — 2026.2 prestataires de services tertiaires", () => {
  it("is effective from 1 August 2026 and cites the extended salary agreement", () => {
    assert.equal(version.validFrom, "2026-08-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 27 mai 2026")));
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000054936719")));
    assert.ok(version.sources.some((source) => source.includes("JORFTEXT000054570646")));
  });

  for (const [coefficient, monthly] of Object.entries(MONTHLY)) {
    it(`coefficient ${coefficient}: ${monthly} € per month`, () => {
      setSituation(Number(coefficient));
      assert.equal(amount("salaire minimum conventionnel"), monthly);
      assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, false);
    });
  }

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation(240, "60%");
    assert.equal(amount("salaire minimum conventionnel"), 1285.05);
  });

  it("rejects coefficients outside the grid", () => {
    for (const coefficient of [0, 110, 180, 210, 270, 310, 400, 600]) {
      setSituation(coefficient);
      assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true, String(coefficient));
      assert.equal(amount("salaire minimum conventionnel"), 0, String(coefficient));
    }
  });

  it("reports a missing coefficient as outside the grid", () => {
    setSituation(undefined);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
    assert.equal(amount("salaire minimum conventionnel"), 0);
  });

  it("exposes 4% compensatory rest for eligible night workers", () => {
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . coefficient`]: 120,
      [`${namespace} . heures de nuit`]: "10 heure/mois",
      [`${namespace} . travailleur de nuit`]: "oui",
    });
    assert.equal(amount("repos compensateur de nuit"), 0.4);
    assert.equal(amount("taux de majoration de nuit occasionnelle"), 25);
  });

  it("is inapplicable outside the agreement", () => {
    setSituation(120, undefined, { "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "coefficient hors grille", "repos compensateur de nuit"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
