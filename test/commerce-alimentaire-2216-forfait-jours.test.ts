import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

// Hard-coded from avenant n° 99 du 17 avril 2026 (KALITEXT000054434579), articles 2 and 3.
const agreement = "2216-commerce-detail-gros-predominance-alimentaire";
const value = "commerce alimentaire";
const namespace = `salarié . convention collective . ${value}`;

const monthly: Record<string, number> = {
  "1A": 1914.19, "1B": 1915.78, "2A": 1917.37, "2B": 1931.7, "3A": 1933.3, "3B": 1950.81,
  "4A": 1954, "4B": 2054.33, "5": 2167.03, "6": 2290.67, "7": 2973.57, "8": 3996.47,
};
const annual: Record<string, number> = {
  "1A": 24884, "1B": 24905, "2A": 24926, "2B": 25112, "3A": 25133, "3B": 25361,
  "4A": 25402, "4B": 26706, "5": 28171, "6": 29779, "7": 38656, "8": 51954,
};

async function engineOf(revision: string) {
  const version = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === revision);
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  return { version, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
}

function amount(engine: Engine, rule: string, level: string, months = 0, quota = "100%"): number {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: `'${level}'`,
    [`${namespace} . mois dans le niveau`]: `${months} mois`,
    "salarié . contrat . temps de travail . quotité": quota,
  });
  const result = engine.evaluate(`${namespace} . ${rule}`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 2216 — revision 2026.3 (forfait jours corrected)", async () => {
  const { version, engine } = await engineOf("2026.3");

  it("keeps the validFrom of 2026.2 and cites the avenant", () => {
    assert.equal(version.validFrom, "2026-08-01");
    const previous = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === "2026.2");
    assert.equal(previous?.validFrom, version.validFrom);
    assert.ok(version.sources.some((source: string) => source.includes("KALITEXT000054434579")));
  });

  it("forfait jours level 7: 40 230 for the first 36 months, 41 790 after", () => {
    for (const months of [0, 12, 36]) assert.equal(amount(engine, "salaire minimum annuel forfait jours", "7", months), 40230, `${months}`);
    for (const months of [37, 60]) assert.equal(amount(engine, "salaire minimum annuel forfait jours", "7", months), 41790, `${months}`);
  });

  it("forfait jours level 8: 54 100 for the first 36 months, 56 170 after", () => {
    for (const months of [0, 36]) assert.equal(amount(engine, "salaire minimum annuel forfait jours", "8", months), 54100, `${months}`);
    for (const months of [37, 120]) assert.equal(amount(engine, "salaire minimum annuel forfait jours", "8", months), 56170, `${months}`);
  });

  it("forfait jours is zero outside levels 7 and 8", () => {
    for (const level of ["1A", "4B", "6", "9", "non renseigné"]) assert.equal(amount(engine, "salaire minimum annuel forfait jours", level, 50), 0, level);
  });

  it("keeps the monthly grid (SMMG) unchanged", () => {
    for (const [level, expected] of Object.entries(monthly)) assert.equal(amount(engine, "salaire minimum conventionnel", level), expected, level);
  });

  it("keeps the annual grid (SMAG) unchanged", () => {
    for (const [level, expected] of Object.entries(annual)) assert.equal(amount(engine, "salaire minimum annuel conventionnel", level), expected, level);
  });

  it("prorates part-time work once", () => {
    assert.equal(amount(engine, "salaire minimum conventionnel", "4B", 0, "50%"), 1027.17);
    assert.equal(amount(engine, "salaire minimum annuel conventionnel", "5", 0, "80%"), 22536.8);
  });

  it("flags a level absent from the grid", () => {
    engine.setSituation({ "salarié . convention collective": `'${value}'`, [`${namespace} . niveau`]: "'9'" });
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
    assert.equal(amount(engine, "salaire minimum conventionnel", "9"), 0);
  });
});
