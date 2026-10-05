import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1505-commerce-detail-alimentaire-non-specialise";
const value = "commerce de détail alimentaire non spécialisé";
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

/** Monthly salaries of the grid, article 1 of the accord of 10 February 2026 (35 h a week). */
const MONTHLY: Record<string, number> = {
  E1: 1851.55, E2: 1862.45, E3: 1864.44, E4: 1903.28, E5: 1916.48, E6: 1962.37, E7: 1977.26,
  AM1: 2459.37, AM2: 2501.27,
  C1: 3058.9, C2: 3388.6,
};

/** Annual minimums for 217 days, article 2: [first 36 months in the level, after 36 months]. */
const FORFAIT_JOURS: Record<string, readonly [number, number]> = {
  C1: [38176, 39320],
  C2: [42085, 43348],
};

function setSituation(level: string | undefined, options: { quota?: string; months?: number } = {}) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    ...(options.quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": options.quota }),
    ...(options.months === undefined ? {} : { [`${namespace} . mois dans le niveau`]: `${options.months} mois` }),
  });
}

const amount = (name: string) => {
  const result = engine.evaluate(`${namespace} . ${name}`).nodeValue;
  assert.equal(typeof result, "number", name);
  return Math.round((result as number) * 100) / 100;
};

describe("IDCC 1505 — 2026.1 minimum salaries", () => {
  it("is in force from 1 August 2026 and cites the accord and its extension order", () => {
    assert.equal(version.validFrom, "2026-08-01");
    assert.ok(version.sources.some((source) => source.includes("Accord du 10 février 2026")));
    assert.ok(version.sources.some((source) => source.includes("TRST2616917A")));
  });

  for (const [level, monthly] of Object.entries(MONTHLY)) {
    it(`${level}: ${monthly} € a month`, () => {
      setSituation(level);
      assert.equal(amount("salaire minimum conventionnel"), monthly);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, false);
    });
  }

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("E5", { quota: "50%" });
    assert.equal(amount("salaire minimum conventionnel"), 958.24);
    setSituation("AM1", { quota: "80%" });
    assert.equal(amount("salaire minimum conventionnel"), 1967.5);
  });

  describe("annual minimums of the executives on a 217-day contract", () => {
    for (const [level, [first, after]] of Object.entries(FORFAIT_JOURS)) {
      it(`${level}: ${first} € for the first 36 months in the level, ${after} € after`, () => {
        for (const months of [0, 1, 35, 36]) {
          setSituation(level, { months });
          assert.equal(amount("salaire minimum annuel forfait jours"), first, `${months} months`);
        }
        for (const months of [37, 60, 240]) {
          setSituation(level, { months });
          assert.equal(amount("salaire minimum annuel forfait jours"), after, `${months} months`);
        }
      });
    }

    it("starts with the first-period amount when the seniority is not given", () => {
      setSituation("C1");
      assert.equal(amount("salaire minimum annuel forfait jours"), 38176);
    });

    it("gives nothing for the levels without a 217-day minimum", () => {
      for (const level of ["E1", "E7", "AM1", "AM2", "non renseigné"]) {
        setSituation(level, { months: 48 });
        assert.equal(amount("salaire minimum annuel forfait jours"), 0, level);
      }
    });
  });

  it("rejects levels outside the grid", () => {
    for (const level of ["E0", "E8", "AM0", "AM3", "C0", "C3", "e1", "1", "A", "non renseigné"]) {
      setSituation(level);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true, level);
      assert.equal(amount("salaire minimum conventionnel"), 0, level);
    }
  });

  it("reports a missing level as outside the grid", () => {
    setSituation(undefined);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
    assert.equal(amount("salaire minimum conventionnel"), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("E5");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "niveau hors grille", "salaire minimum annuel forfait jours"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});
