import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2941-aide-soins-domicile";
const value = "aide et soins à domicile";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
for (const name of Object.keys(extension)) {
  assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
  assert.ok(!(name in rules), `Duplicate modele-social rule: ${name}`);
}
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = {
  ...choice,
  "une possibilité": [...choice["une possibilité"], value],
} as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(inputs: Record<string, string | number> = {}, context: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    "salarié . contrat . statut cadre": "non",
    "date": "01/10/2026",
    // Isolate the sourced agreement grid from future national minimum-wage changes.
    "SMIC": "1800 €/mois",
    [`${namespace} . niveau`]: "'employé.2.1'",
    ...Object.fromEntries(Object.entries(inputs).map(([name, input]) => [`${namespace} . ${name}`, input])),
    ...context,
  });
}

function amount(name: string) {
  const result = engine.evaluate(`${namespace} . ${name}`);
  assert.equal(typeof result.nodeValue, "number", name);
  return Math.round((result.nodeValue as number) * 100) / 100;
}

// Independent expected figures from article 1 of avenant 75/2026, not from the YAML.
// https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054880770/
const grids = {
  "employé": [[319, 326, 342], [355, 370, 394]],
  "TAM": [[374, 390, 415], [447, 467, 496]],
  "cadre": [[496, 518, 551], [594, 621, 660]],
};

describe("IDCC 2941 — June 2026 salary grid", () => {
  it("exports the June effective date and primary legal references", () => {
    assert.equal(version.validFrom, "2026-06-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000054880770")));
    assert.ok(version.sources.some((source) => source.includes("JORFTEXT000054458135")));
  });

  for (const track of ["intervention", "support"]) {
    for (const [category, degrees] of Object.entries(grids)) {
      for (const [degreeIndex, coefficients] of degrees.entries()) {
        for (const [stepIndex, coefficient] of coefficients.entries()) {
          const level = `${category}.${degreeIndex + 1}.${stepIndex + 1}`;
          it(`${track} ${level}: coefficient ${coefficient} at EUR 5.77`, () => {
            setSituation({ "filière": `'${track}'`, "niveau": `'${level}'` });
            assert.equal(amount("coefficient"), coefficient);
            assert.equal(amount("salaire minimum conventionnel"), Math.round(coefficient * 5.77 * 100) / 100);
          });
        }
      }
    }
  }

  it("uses TAM degree 1 for an aide-soignant after avenant 70/2025", () => {
    setSituation({ "niveau": "'TAM.1.1'", "niveau de diplôme": 4 });
    assert.equal(amount("salaire de base"), 2157.98);
    assert.equal(amount("ECR diplôme"), 69.24);
    assert.equal(amount("salaire minimum conventionnel"), 2227.22);
  });

  for (const level of ["non renseigné", "employé.0.1", "employé.1.4", "TAM.3.1", "cadre.2.0", "inconnu"]) {
    it(`flags invalid level ${level} without returning a plausible minimum`, () => {
      setSituation({ "niveau": `'${level}'`, "niveau de diplôme": 8, "ancienneté dans la branche": "31 an" });
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
      assert.equal(amount("salaire minimum conventionnel"), 0);
    });
  }

  it("flags an unknown track", () => {
    setSituation({ "filière": "'inconnue'" });
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
    assert.equal(amount("salaire minimum conventionnel"), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation({}, { "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});

// Article III.19.1: 11/12/14/15/17 points and tenure rates 2/4/8/12/16/20%.
// https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000047519049
describe("IDCC 2941 — recurring remuneration supplements", () => {
  for (const [level, expected] of [[0, 0], [2, 0], [3, 63.47], [4, 69.24], [5, 80.78], [6, 86.55], [7, 98.09], [8, 98.09], [9, 0]]) {
    it(`diploma level ${level}: EUR ${expected}`, () => {
      setSituation({ "niveau de diplôme": level! });
      assert.equal(amount("ECR diplôme"), expected);
    });
  }

  for (const [years, before, after] of [[5, 0, 0.02], [10, 0.02, 0.04], [15, 0.04, 0.08], [20, 0.08, 0.12], [25, 0.12, 0.16], [30, 0.16, 0.20]]) {
    it(`opens the ${years}-year seniority step the day after the anniversary`, () => {
      setSituation({ "ancienneté dans la branche": `${years} an` });
      assert.equal(amount("ECR ancienneté"), Math.round(2048.35 * before! * 100) / 100);
      setSituation({ "ancienneté dans la branche": `${years! + 1 / 365} an` });
      assert.equal(amount("ECR ancienneté"), Math.round(2048.35 * after! * 100) / 100);
    });
  }

  it("applies the SMIC differential before seniority and excludes diploma from its base", () => {
    setSituation({ "niveau": "'employé.1.1'", "niveau de diplôme": 3, "ancienneté dans la branche": "6 an" }, { "SMIC": "2000 €/mois" });
    assert.equal(amount("salaire de base"), 2000);
    assert.equal(amount("ECR ancienneté"), 40);
    assert.equal(amount("salaire minimum conventionnel"), 2103.47);
  });

  it("retains the reclassification differential in the seniority base", () => {
    setSituation({ "indemnité différentielle de reclassement": "100 €/mois", "ancienneté dans la branche": "11 an" });
    assert.equal(amount("salaire de base"), 2148.35);
    assert.equal(amount("ECR ancienneté"), 85.93);
    assert.equal(amount("salaire minimum conventionnel"), 2234.28);
  });

  it("prorates base, diploma, seniority and externally attributed cadre ECR once", () => {
    setSituation({ "niveau": "'cadre.1.1'", "niveau de diplôme": 6, "ancienneté dans la branche": "16 an", "autres ECR pérennes en points": 54 }, { "salarié . contrat . temps de travail . quotité": "50%" });
    assert.equal(amount("salaire de base"), 1430.96);
    assert.equal(amount("ECR diplôme"), 43.28);
    assert.equal(amount("ECR ancienneté"), 114.48);
    assert.equal(amount("autres ECR pérennes"), 155.79);
    assert.equal(amount("salaire minimum conventionnel"), 1744.5);
  });

  it("uses the pinned modele-social SMIC in an unmodified national-wage context", () => {
    setSituation({ "niveau": "'employé.1.1'" });
    const situation = { ...engine.getSituation() };
    delete situation.SMIC;
    engine.setSituation(situation);
    assert.equal(amount("salaire de base"), 1867.02);
  });
});

// Article III.19.2: tutors 7+2, apprentices 11+2; on-call 8/10/10/12 per 24 h.
describe("IDCC 2941 — occasional remuneration supplements", () => {
  for (const [count, tutor, apprentice] of [[0, 0, 0], [1, 40.39, 63.47], [2, 51.93, 75.01]]) {
    it(`pays flat tutoring/apprenticeship amounts for ${count} people even part-time`, () => {
      setSituation({ "personnes tutorées": count!, "apprentis accompagnés": count! }, { "salarié . contrat . temps de travail . quotité": "50%" });
      assert.equal(amount("ECR tutorat"), tutor);
      assert.equal(amount("ECR apprentissage"), apprentice);
    });
  }

  for (const [counter, expected] of [
    ["heures astreinte ordinaire", 46.16],
    ["heures astreinte majorée", 57.7],
    ["heures astreinte fractionnée ordinaire", 57.7],
    ["heures astreinte fractionnée majorée", 69.24],
  ] as const) {
    it(`${counter}: EUR ${expected} for 24 hours, no contract proration`, () => {
      setSituation({ [counter]: "24 heure/mois" }, { "salarié . contrat . temps de travail . quotité": "50%" });
      assert.equal(amount("ECR astreinte"), expected);
    });
  }

  it("combines disjoint on-call counters and prorates their actual durations", () => {
    setSituation({ "heures astreinte ordinaire": "12 heure/mois", "heures astreinte fractionnée majorée": "6 heure/mois", "personnes tutorées": 1 });
    assert.equal(amount("ECR astreinte"), 40.39);
    assert.equal(amount("compléments ponctuels calculés"), 80.78);
    assert.equal(amount("salaire minimum conventionnel"), 2048.35);
  });
});
