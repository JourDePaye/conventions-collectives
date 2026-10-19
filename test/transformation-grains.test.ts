import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1930-transformation-grains";
const value = "métiers de la transformation des grains";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.3");
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

const GRID: Record<string, number> = {
  I: 1871.06,
  II: 1955.58,
  III: 2047.84,
  IV: 2157.51,
  V: 2426.26,
  "VI.1": 2608.23,
  "VI.2": 2801.77,
  VII: 3399.33,
  VIII: 4063.66,
  IX: 5055.07,
};

function setSituation(level: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 1930 — 2026.3 minimum salaries and seniority premium", () => {
  it("is in force from 1 June 2026 and cites the official extension", () => {
    assert.equal(version.validFrom, "2026-06-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 30 du 9 février 2026")));
    assert.ok(version.sources.some((source) => source.includes("Arrêté du 4 mai 2026")));
    assert.ok(version.sources.some((source) => source.includes("TRST2610625A")));
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 31 du 9 février 2026")));
  });

  for (const [level, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for ${level}`, () => {
      setSituation(level);
      assert.equal(minimum(), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setSituation("IV", "50%");
    assert.equal(minimum(), 1078.76);
  });

  it("calculates the optional seniority premium from the REMM", () => {
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . niveau`]: "'IV'",
      "salarié . contrat . temps de travail . quotité": "50%",
      [`${namespace} . bénéficie de la prime d'ancienneté`]: "'oui'",
      "salarié . ancienneté": "6 an",
    });
    assert.equal(engine.evaluate(`${namespace} . prime d'ancienneté`).nodeValue, 21.58);
  });

  it("does not assume eligibility for the optional seniority premium", () => {
    setSituation("IV");
    assert.equal(engine.evaluate(`${namespace} . prime d'ancienneté`).nodeValue, null);
  });

  it("rejects levels and steps outside the grid", () => {
    for (const level of ["0", "X", "VI", "VI.3", "I.1"]) {
      setSituation(level);
      assert.equal(outOfGrid(), true, level);
      assert.equal(minimum(), 0, level);
    }
  });

  it("reports a missing level as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(minimum(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("IV");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, null);
  });
});

describe("IDCC 1930 — 2026.4 seniority premium by company scheme and individual amount", async () => {
  const revision = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.4");
  assert.ok(revision);
  const revisionRules: Record<string, Rule> = { ...rules };
  for (const name of Object.keys(extension)) delete revisionRules[name];
  Object.assign(revisionRules, await revision.loadRules());
  const revisionEngine = new Engine(revisionRules, { logger: { log() {}, warn() {}, error() {} } });

  // Level IV (2 157,51 €), hired on 1 January 2020: 6 years of seniority on 1 October 2026.
  const premium = (extra: Record<string, string> = {}) => {
    revisionEngine.setSituation({
      date: "01/10/2026",
      "salarié . convention collective": `'${value}'`,
      "salarié . contrat . date d'embauche": "01/01/2020",
      [`${namespace} . niveau`]: "'IV'",
      ...extra,
    });
    return revisionEngine.evaluate(`${namespace} . prime d'ancienneté`).nodeValue;
  };
  const scale = { [`${namespace} . régime de prime d'ancienneté`]: "'barème'" };
  const individual = (amount: string) => ({
    [`${namespace} . prime d'ancienneté individuelle`]: "oui",
    [`${namespace} . prime d'ancienneté individuelle . montant`]: amount,
  });

  it("keeps the validity date and the sources of 2026.3", () => {
    assert.equal(revision.validFrom, "2026-06-01");
    assert.deepEqual(revision.sources, version.sources);
  });

  it("pays the article 40 rate of the REMM with the company scheme « barème »", () => {
    assert.equal(premium(scale), 43.15);
    assert.equal(premium({ ...scale, "salarié . contrat . temps de travail . quotité": "50%" }), 21.58);
  });

  it("counts the seniority entered for the company, taken over seniority included", () => {
    assert.equal(premium({ ...scale, [`${namespace} . ancienneté dans l'entreprise`]: "12 an" }), 86.3);
    assert.equal(premium({ ...scale, [`${namespace} . ancienneté dans l'entreprise`]: "2 an" }), 0);
  });

  it("pays nothing with the scheme « aucune prime » or without a scheme", () => {
    assert.equal(premium({ [`${namespace} . régime de prime d'ancienneté`]: "'aucune prime'" }), 0);
    assert.equal(premium(), 0);
  });

  it("pays the individual amount instead of the company scheme, without proration", () => {
    assert.equal(premium({ ...scale, ...individual("42 €/mois") }), 42);
    assert.equal(premium({ ...scale, ...individual("0 €/mois") }), 0);
    assert.equal(
      premium({
        [`${namespace} . régime de prime d'ancienneté`]: "'aucune prime'",
        ...individual("42 €/mois"),
        "salarié . contrat . temps de travail . quotité": "50%",
      }),
      42,
    );
  });
});
