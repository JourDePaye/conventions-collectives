import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1261-acteurs-lien-social-familial";
const value = "acteurs du lien social et familial";
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

function setSituation(points = 0, experience = 0, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . points de pesée`]: points,
    [`${namespace} . points d'expérience professionnelle`]: experience,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function amount(name: string) {
  const value = engine.evaluate(`${namespace} . ${name}`).nodeValue;
  assert.equal(typeof value, "number", name);
  return Math.round((value as number) * 100) / 100;
}

describe("IDCC 1261 — 2026 classification and minimum salary", () => {
  it("exports the 2026 value of the point and salary base", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000048558670")));
    setSituation();
    // EUR/year amounts are normalized by Publicodes when consumed by the monthly rule.
    assert.equal(amount("salaire minimum conventionnel"), Math.round((23000 / 12) * 100) / 100);
  });

  it("adds the job weighting and professional-experience points", () => {
    setSituation(100, 12);
    assert.equal(amount("salaire minimum conventionnel"), 2430);
  });

  it("prorates the annual minimum once for part-time work", () => {
    setSituation(100, 0, "50%");
    assert.equal(amount("salaire minimum conventionnel"), 1187.5);
  });

  it("rejects negative point totals", () => {
    setSituation(-1);
    assert.equal(engine.evaluate(`${namespace} . paramètres invalides`).nodeValue, true);
    assert.equal(amount("salaire minimum conventionnel"), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation();
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
