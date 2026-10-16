import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

// Annex 6.1 created by article 1 of the avenant of 20 February 2026 (KALITEXT000054254725).
// Amounts are hard-coded from the Légifrance text: [base 35 h, +15 %, +30 %] in euros per year.
const agreement = "3248-metallurgie";
const value = "métallurgie";
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

const GRID: Record<string, [number, number, number]> = {
  A1: [21980, 25277, 28574],
  A2: [22100, 25415, 28730],
  B3: [22710, 26117, 29523],
  B4: [23620, 27163, 30706],
  C5: [24510, 28187, 31863],
  C6: [25780, 29647, 33514],
  D7: [26680, 30682, 34684],
  D8: [28700, 33005, 37310],
  E9: [30760, 35374, 39988],
  E10: [33970, 39066, 44161],
  F11: [35200, 40480, 45760],
  F12: [37000, 42550, 48100],
  G13: [40350, 46403, 52455],
  G14: [44250, 50888, 57525],
  H15: [47380, 54487, 61594],
  H16: [52370, 60226, 68081],
  I17: [59720, 68678, 77636],
  I18: [68450, 78718, 88985],
};

const BEGINNERS: Record<string, Record<string, [number, number, number]>> = {
  F11: {
    "moins de 2 ans": [28430, 32695, 36959],
    "de 2 ans à moins de 4 ans": [29852, 34329, 38807],
    "de 4 ans à 6 ans": [32240, 37076, 41912],
  },
  F12: {
    "moins de 2 ans": [29940, 34431, 38922],
    "de 2 ans à moins de 4 ans": [31437, 36153, 40868],
    "de 4 ans à 6 ans": [33952, 39045, 44138],
  },
};

function situation(level: string, extra: Record<string, string> = {}) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: `'${level}'`,
    ...extra,
  });
}
const evaluate = (name: string) => engine.evaluate(`${namespace} . ${name}`).nodeValue;
const round2 = (n: unknown) => Math.round((n as number) * 100) / 100;

describe("IDCC 3248 revision 2026.3", () => {
  it("keeps the 2026.1 and 2026.2 effective date", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000054254725")));
  });

  for (const [level, [base, plus15, plus30]] of Object.entries(GRID)) {
    it(`${level}: base, +15 % and +30 % columns of the first table`, () => {
      situation(level);
      assert.equal(evaluate("salaire minimum hiérarchique annuel"), base);
      assert.equal(round2(evaluate("salaire minimum conventionnel")), round2(base / 12));
      assert.equal(evaluate("niveau hors grille"), false);
      situation(level, { [`${namespace} . forfait annuel`]: "'heures 15 %'" });
      assert.equal(evaluate("salaire minimum hiérarchique annuel au forfait"), plus15);
      situation(level, { [`${namespace} . forfait annuel`]: "'heures 30 %'" });
      assert.equal(evaluate("salaire minimum hiérarchique annuel au forfait"), plus30);
      situation(level, { [`${namespace} . forfait annuel`]: "'jours'" });
      assert.equal(evaluate("salaire minimum hiérarchique annuel au forfait"), plus30);
    });
  }

  for (const [level, steps] of Object.entries(BEGINNERS)) {
    for (const [experience, [base, plus15, plus30]] of Object.entries(steps)) {
      it(`${level} débutant, ${experience}: second table of annex 6.1`, () => {
        const extra = { [`${namespace} . expérience professionnelle groupe F`]: `'${experience}'` };
        situation(level, extra);
        assert.equal(evaluate("salaire minimum hiérarchique annuel"), base);
        assert.equal(round2(evaluate("salaire minimum conventionnel")), round2(base / 12));
        situation(level, { ...extra, [`${namespace} . forfait annuel`]: "'heures 15 %'" });
        assert.equal(evaluate("salaire minimum hiérarchique annuel au forfait"), plus15);
        situation(level, { ...extra, [`${namespace} . forfait annuel`]: "'heures 30 %'" });
        assert.equal(evaluate("salaire minimum hiérarchique annuel au forfait"), plus30);
      });
    }
  }

  it("applies the standard F barème after six years or by default", () => {
    situation("F11", { [`${namespace} . expérience professionnelle groupe F`]: "'plus de 6 ans'" });
    assert.equal(evaluate("salaire minimum hiérarchique annuel"), 35200);
    situation("F12");
    assert.equal(evaluate("salaire minimum hiérarchique annuel"), 37000);
  });

  it("ignores the experience outside group F", () => {
    situation("E10", { [`${namespace} . expérience professionnelle groupe F`]: "'moins de 2 ans'" });
    assert.equal(evaluate("salaire minimum hiérarchique annuel"), 33970);
  });

  it("flags a class that is not in the barème", () => {
    for (const level of ["J19", "A0", "F13", "non renseigné"]) {
      situation(level);
      assert.equal(evaluate("niveau hors grille"), true, level);
      assert.equal(evaluate("salaire minimum conventionnel"), 0, level);
    }
  });

  it("prorates the monthly minimum for part-time work", () => {
    situation("C5", { "salarié . contrat . temps de travail . quotité": "50%" });
    assert.equal(round2(evaluate("salaire minimum conventionnel")), 1021.25);
    situation("F11", {
      [`${namespace} . expérience professionnelle groupe F`]: "'moins de 2 ans'",
      "salarié . contrat . temps de travail . quotité": "80%",
    });
    assert.equal(round2(evaluate("salaire minimum conventionnel")), round2((28430 / 12) * 0.8));
    assert.equal(round2(evaluate("salaire minimum conventionnel")), 1895.33);
  });
});
