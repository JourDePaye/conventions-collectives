import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2332-entreprises-architecture";
const value = "entreprises d'architecture";
const namespace = `salarié . convention collective . ${value}`;

async function engineOf(versionNumber: string) {
  const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === versionNumber);
  assert.ok(version, versionNumber);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, await version.loadRules());
  return { version, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
}

function amountOf(engine: Engine, coefficient: number, zone: string, quota = "100%", rule = "salaire minimum conventionnel") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . coefficient`]: coefficient,
    [`${namespace} . zone`]: `'${zone}'`,
    "salarié . contrat . temps de travail . quotité": quota,
  });
  const result = engine.evaluate(`${namespace} . ${rule}`).nodeValue;
  return typeof result === "number" ? Math.round(result * 100) / 100 : result;
}

describe("IDCC 2332 — revision dates", () => {
  it("lists the revisions with their effective dates", () => {
    const dates = Object.fromEntries((COMPILED_VERSIONS[agreement] ?? []).map((v) => [v.version, v.validFrom]));
    assert.equal(dates["2025.1"], "2025-02-11");
    assert.equal(dates["2025.2"], "2025-02-11");
    assert.equal(dates["2025.3"], "2025-06-01");
    assert.equal(dates["2026.1"], "2026-06-01");
    assert.equal(dates["2026.2"], "2026-01-01");
  });
});

describe("IDCC 2332 — 2025.2 (before extension): no regional minimum", async () => {
  const { engine } = await engineOf("2025.2");
  it("returns zero and flags the zone as outside the accord", () => {
    assert.equal(amountOf(engine, 300, "zone 1"), 0);
    assert.equal(engine.evaluate(`${namespace} . zone hors accord`).nodeValue, true);
  });
});

describe("IDCC 2332 — 2025.3 (Rhône-Alpes accord of 11 February 2025, from 1 June 2025)", async () => {
  const { version, engine } = await engineOf("2025.3");
  it("applies from the month after the extension JORF of 28 May 2025", () => {
    assert.equal(version.validFrom, "2025-06-01");
    assert.ok(version.sources.some((s) => s.includes("KALITEXT000051580413") && s.includes("27 mai 2025")));
  });
  it("zone 1: point 9,13 and floor 1 945", () => {
    assert.equal(amountOf(engine, 200, "zone 1"), 1945); // 200 x 9,13 = 1 826 < floor
    assert.equal(amountOf(engine, 300, "zone 1"), 2739);
    assert.equal(amountOf(engine, 1000, "zone 1"), 9130);
  });
  it("zone 2: point 9,02 and floor 1 892", () => {
    assert.equal(amountOf(engine, 200, "zone 2"), 1892);
    assert.equal(amountOf(engine, 300, "zone 2"), 2706);
  });
  it("prorates once and flags another zone", () => {
    assert.equal(amountOf(engine, 300, "zone 1", "50%"), 1369.5);
    assert.equal(amountOf(engine, 300, "national"), 0);
    assert.equal(engine.evaluate(`${namespace} . zone hors accord`).nodeValue, true);
  });
});

describe("IDCC 2332 — 2026.1 (Rhône-Alpes accord of 3 February 2026, from 1 June 2026)", async () => {
  const { version, engine } = await engineOf("2026.1");
  it("applies from the month after the extension JORF of 29 May 2026", () => {
    assert.equal(version.validFrom, "2026-06-01");
    assert.ok(version.sources.some((s) => s.includes("KALITEXT000054337579") && s.includes("20 mai 2026")));
  });
  it("zone 1: point 9,21 without euro floor", () => {
    assert.equal(amountOf(engine, 200, "zone 1"), 1842);
    assert.equal(amountOf(engine, 300, "zone 1"), 2763);
    assert.equal(amountOf(engine, 1000, "zone 1"), 9210);
  });
  it("zone 2: point 9,10 without euro floor", () => {
    assert.equal(amountOf(engine, 200, "zone 2"), 1820);
    assert.equal(amountOf(engine, 300, "zone 2"), 2730);
  });
  it("prorates once, flags another zone, and stays isolated", () => {
    assert.equal(amountOf(engine, 300, "zone 1", "50%"), 1381.5);
    assert.equal(amountOf(engine, 300, "national"), 0);
    assert.equal(engine.evaluate(`${namespace} . zone hors accord`).nodeValue, true);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
