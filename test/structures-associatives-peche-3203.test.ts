import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const name = "3203-structures-associatives-peche";
const namespace = "salarié . convention collective . structures associatives de pêche de loisir et de protection du milieu aquatique";

async function engineFor(positionnement: string, quotité = 1, revision = "2026.2", situation: Record<string, string> = {}) {
  const version = COMPILED_VERSIONS[name]?.find((candidate) => candidate.version === revision);
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], "structures associatives de pêche de loisir et de protection du milieu aquatique"],
  } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    "salarié . convention collective": "'structures associatives de pêche de loisir et de protection du milieu aquatique'",
    [`${namespace} . niveau et échelon`]: `'${positionnement}'`,
    "salarié . contrat . statut cadre": "non",
    "salarié . contrat . temps de travail . quotité": `${quotité * 100}%`,
    ...situation,
  });
  return { engine, version };
}

describe("IDCC 3203 — 2026.2 minimum salaries", () => {
  it("uses the official effective date and source", async () => {
    const { version } = await engineFor("VI.3");
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 16 du 17 décembre 2025")));
  });

  it("evaluates the highest published position", async () => {
    const { engine } = await engineFor("VI.3");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 3355);
  });

  it("prorates the monthly minimum once for part-time work", async () => {
    const { engine } = await engineFor("IV.2", 0.5);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1134.5);
  });

  it("marks an unknown position outside the grid", async () => {
    const { engine } = await engineFor("VII.1");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel . grille`).nodeValue, 0);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
  });

  it("is isolated from another convention and does not redefine payroll endpoints", async () => {
    const { engine } = await engineFor("I");
    engine.setSituation({ "salarié . convention collective": "'boyauderie'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate("salarié . convention collective").nodeValue, "boyauderie");
  });
});
