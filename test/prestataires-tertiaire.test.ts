import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const model = "2098-prestataires-tertiaire";
const value = "prestataires tertiaires";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[model]?.find((entry) => entry.version === "2026.1");
assert.ok(version, "IDCC 2098 version 2026.1 must be compiled");
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
  120: 1823.03, 130: 1826.21, 140: 1832.44, 150: 1840.56, 160: 1844,
  170: 1848, 180: 1872, 190: 1906, 200: 1942, 210: 1993, 220: 2055,
  230: 2184, 240: 2301, 250: 2404, 260: 2536, 270: 2705, 280: 2960,
  290: 3201, 300: 3455, 320: 3748, 350: 4107, 400: 4758, 450: 5463,
  500: 6157,
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

describe("IDCC 2098 — 2026.1 prestataires de services tertiaires", () => {
  it("is effective from 1 August 2026 and cites the extended salary agreement", () => {
    assert.equal(version.validFrom, "2026-08-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 11 septembre 2025")));
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
    assert.equal(amount("salaire minimum conventionnel"), 1380.6);
  });

  it("rejects coefficients outside the grid", () => {
    for (const coefficient of [0, 110, 125, 310, 600]) {
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

  it("exposes compensatory rest for eligible night workers without inventing a cash premium", () => {
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . coefficient`]: 120,
      [`${namespace} . heures de nuit`]: "10 heure/mois",
      [`${namespace} . taux de repos compensateur de nuit`]: "2%",
    });
    assert.equal(amount("repos compensateur de nuit"), 0.2);
  });

  it("is inapplicable outside the agreement", () => {
    setSituation(120, undefined, { "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "coefficient hors grille", "repos compensateur de nuit"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
