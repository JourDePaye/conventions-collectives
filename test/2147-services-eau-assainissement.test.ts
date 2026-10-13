import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2147-services-eau-assainissement";
const value = "services eau assainissement";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2025.1");
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

const ANNUAL: Record<string, number> = {
  I: 22862,
  II: 23693,
  III: 25257,
  IV: 26407,
  V: 30938,
  VI: 40289,
  VII: 55161,
  VIII: 65237,
};

function setSituation(group: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(group === undefined ? {} : { [`${namespace} . groupe`]: `'${group}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

const roundToCents = (amount: number) => Math.round((amount + 1e-9) * 100) / 100;
const monthly = () => engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
const annual = () => engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue;
const outOfGrid = () => engine.evaluate(`${namespace} . groupe hors grille`).nodeValue;

describe("IDCC 2147 — 2025.1 minimums and astreinte", () => {
  it("uses the official effective date and cites the salary amendment", () => {
    assert.equal(version.validFrom, "2025-01-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 23 du 10 juin 2025")));
  });

  for (const [group, minimum] of Object.entries(ANNUAL)) {
    it(`group ${group}: ${minimum} € annual minimum`, () => {
      setSituation(group);
      assert.equal(annual(), minimum);
      assert.equal(monthly(), roundToCents(minimum / 12));
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates annual and indicative monthly minima once", () => {
    setSituation("VI", "50%");
    assert.equal(annual(), ANNUAL.VI! / 2);
    assert.equal(monthly(), roundToCents(ANNUAL.VI! / 24));
  });

  it("exposes the 15.36 € compensation per 24-hour astreinte period", () => {
    setSituation("III");
    assert.equal(engine.evaluate(`${namespace} . compensation minimale astreinte`).nodeValue, 15.36);
  });

  it("rejects groups outside the grid and missing classification", () => {
    for (const group of ["0", "IX", "A", "non renseigné"]) {
      setSituation(group);
      assert.equal(outOfGrid(), true, group);
      assert.equal(monthly(), 0, group);
      assert.equal(annual(), 0, group);
    }
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(monthly(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("III");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . compensation minimale astreinte`).nodeValue, null);
  });
});
