import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3032-esthetique-cosmetique";
const value = "esthétique cosmétique";
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

const INSTITUTES: Record<string, number> = {
  "135": 1848, "150": 1861, "160": 1877, "175": 1895, "180": 1917,
  "200": 1995, "230": 2072, "250": 2300, "270": 2834, "300": 3875,
};
const TEACHING: Record<string, number> = {
  "135-A": 1848, "135-B": 1885, "150-A": 1861, "150-B": 1899,
  "200-A": 1995, "200-B": 2035, "230-A": 2072, "230-B": 2114,
  "240-A": 2122, "240-B": 2165, "245-A": 2159, "245-B": 2203,
  "250-A": 2300, "250-B": 2346, "270-A": 2834, "270-B": 2891,
  "300-A": 3875, "300-B": 3953,
};

function setSituation(sector: string | undefined, classification?: string, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(sector === undefined ? {} : { [`${namespace} . secteur`]: `'${sector}'` }),
    ...(classification === undefined ? {} : { [`${namespace} . classification`]: `'${classification}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

const amount = () => {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
};

const outOfGrid = () => engine.evaluate(`${namespace} . classification hors grille`).nodeValue;

describe("IDCC 3032 — 2026.1 payroll rules", () => {
  it("is in force from 1 June 2026 and cites the official extension order", () => {
    assert.equal(version.validFrom, "2026-06-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 43 du 22 janvier 2026")));
    assert.ok(version.sources.some((source) => source.includes("JORFTEXT000054144697")));
  });

  for (const [classification, monthly] of Object.entries(INSTITUTES)) {
    it(`institutes ${classification}: ${monthly} € a month`, () => {
      setSituation("instituts de beauté et services généraux", classification);
      assert.equal(amount(), monthly);
      assert.equal(outOfGrid(), false);
    });
  }

  for (const [classification, monthly] of Object.entries(TEACHING)) {
    it(`teaching ${classification}: ${monthly} € a month`, () => {
      setSituation("enseignement technique et professionnel", classification);
      assert.equal(amount(), monthly);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the monthly minimum and seniority bonus once for part-time work", () => {
    setSituation("instituts de beauté et services généraux", "250", "50%");
    assert.equal(amount(), 1150);
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . secteur`]: "'instituts de beauté et services généraux'",
      [`${namespace} . classification`]: "'250'",
      "salarié . ancienneté": "12 an",
      "salarié . contrat . temps de travail . quotité": "50%",
    });
    assert.equal(engine.evaluate(`${namespace} . prime d'ancienneté`).nodeValue, 71.5);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum avec prime d'ancienneté`).nodeValue, 1221.5);
  });

  it("rejects classifications outside the applicable sector grid", () => {
    for (const [sector, classification] of [
      ["instituts de beauté et services généraux", "135-A"],
      ["instituts de beauté et services généraux", "310"],
      ["enseignement technique et professionnel", "175-A"],
      ["enseignement technique et professionnel", "135-C"],
    ]) {
      setSituation(sector, classification);
      assert.equal(outOfGrid(), true, `${sector} ${classification}`);
      assert.equal(amount(), 0, `${sector} ${classification}`);
    }
  });

  it("reports a missing classification as outside the grid", () => {
    setSituation("instituts de beauté et services généraux");
    assert.equal(outOfGrid(), true);
    assert.equal(amount(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("instituts de beauté et services généraux", "250");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "classification hors grille", "prime d'ancienneté"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
