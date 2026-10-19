/**
 * Revisions that give the seniority bonus apart from the minimum, so that it is paid in addition to
 * the base salary:
 * - IDCC 1483, 2026.3 and 2026.4: avenant n° 29 (KALITEXT000053914115), article 2, a fixed amount
 *   by category and seniority, prorated by working time, no longer in the minimum;
 * - IDCC 2511, 2026.2 and 2026.3: article 9.2.3 (KALIARTI000047394518), 1 % of the group 3 minimum
 *   (1 997,87 €) per complete period of 24 months since the hire date or the extension of
 *   21 November 2006, plus 5 % for group 1 after 3 years, up to 15 %;
 * - IDCC 3127, 2024.2: avenant of 29 March 2022 (KALITEXT000046100203), 0,05 €, 0,15 € or 0,25 €
 *   per hour of work after 2, 5 or 10 years.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

async function engineOf(agreement: string, value: string, version: string) {
  const found = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === version);
  assert.ok(found, `${agreement} ${version}`);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...new Set([...choice["une possibilité"], value])],
  } as Rule;
  Object.assign(rules, await found.loadRules());
  return { found, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
}

const round = (value: unknown) => {
  assert.equal(typeof value, "number");
  return Math.round((value as number) * 100) / 100;
};

describe("IDCC 1483 — seniority bonus apart from the minimum", async () => {
  const namespace = "salarié . convention collective . commerce de détail habillement";
  for (const version of ["2026.3", "2026.4"]) {
    const { found, engine } = await engineOf("1483-commerce-detail-habillement-textiles", "commerce de détail habillement", version);
    const evaluate = (level: string, hireDate: string, extra: Record<string, string> = {}) => {
      engine.setSituation({
        date: "01/10/2026",
        "salarié . convention collective": "'commerce de détail habillement'",
        "salarié . contrat . date d'embauche": hireDate,
        [`${namespace} . niveau`]: `'${level}'`,
        ...extra,
      });
      return {
        minimum: round(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue),
        bonus: round(engine.evaluate(`${namespace} . prime d'ancienneté`).nodeValue),
      };
    };

    it(`${version}: cites the avenant n° 29 on Légifrance`, () => {
      assert.ok(found.sources.some((source) => source.includes("KALITEXT000053914115")));
    });

    it(`${version}: gives the bonus of the employees and supervisors A1 and A2 apart from their minimum`, () => {
      // Category 3 after 9 years: 1 843 € and 65 €; A2 after 18 years: 2 262 € and 115 €.
      assert.deepEqual(evaluate("3", "01/01/2017"), { minimum: 1843, bonus: 65 });
      assert.deepEqual(evaluate("A2", "01/01/2008"), { minimum: 2262, bonus: 115 });
      assert.deepEqual(evaluate("8", "01/01/2025"), { minimum: 2043, bonus: 0 });
    });

    it(`${version}: gives no bonus to the categories B, C and D, whose minimum rises with seniority`, () => {
      // Category B after 6 years: 2 644 €.
      assert.deepEqual(evaluate("B", "01/01/2020"), { minimum: 2644, bonus: 0 });
    });

    it(`${version}: prorates the bonus by working time`, () => {
      const halfTime = {
        "salarié . contrat . temps de travail . temps partiel": "oui",
        "salarié . contrat . temps de travail . temps partiel . heures par semaine": "17.5 heure/semaine",
      };
      assert.deepEqual(evaluate("3", "01/01/2017", halfTime), { minimum: 921.5, bonus: 32.5 });
    });
  }
});

for (const version of ["2026.2", "2026.3"]) {
  describe(`IDCC 2511 — ${version}, periods of 24 months from the seniority`, async () => {
    const namespace = "salarié . convention collective . sport";
    const { engine } = await engineOf("2511-sport", "sport", version);
    const bonus = (group: string, years: number, date = "01/10/2026") => {
      engine.setSituation({
        date,
        "salarié . convention collective": "'sport'",
        [`${namespace} . groupe`]: `'${group}'`,
        [`${namespace} . ancienneté dans l'entreprise`]: `${years} an`,
      });
      return round(engine.evaluate(`${namespace} . prime d'ancienneté`).nodeValue);
    };

    it("pays 1 % of 1 997,87 € per complete period of 24 months", () => {
      assert.equal(bonus("3", 1), 0);
      assert.equal(bonus("3", 2), round(1997.87 * 0.01));
      assert.equal(bonus("3", 9), round(1997.87 * 0.04));
    });

    it("adds 5 % for group 1 after 3 years", () => {
      assert.equal(bonus("1", 3), round(1997.87 * 0.06));
    });

    it("counts the periods from the extension of 21 November 2006 at most", () => {
      // 19 complete years on 1 October 2026, 20 on 1 December 2026.
      assert.equal(bonus("3", 30), round(1997.87 * 0.09));
      assert.equal(bonus("3", 30, "01/12/2026"), round(1997.87 * 0.1));
      assert.equal(bonus("1", 30, "01/12/2026"), round(1997.87 * 0.15));
    });

    it("pays no bonus to groups 7 and 8", () => {
      assert.equal(bonus("7", 10), 0);
    });
  });
}

describe("IDCC 3127 — 2024.2, hourly bonus on the hours of the month", async () => {
  const namespace = "salarié . convention collective . services à la personne";
  const { engine } = await engineOf("3127-services-personne", "services à la personne", "2024.2");
  const bonus = (years: number, extra: Record<string, string> = {}) => {
    engine.setSituation({
      date: "01/10/2026",
      "salarié . convention collective": "'services à la personne'",
      [`${namespace} . emploi-repère`]: "'jardinage'",
      [`${namespace} . ancienneté`]: `${years} an`,
      ...extra,
    });
    return round(engine.evaluate(`${namespace} . prime d'ancienneté`).nodeValue);
  };

  it("pays 0,05 €, 0,15 € and 0,25 € per hour after 2, 5 and 10 years", () => {
    assert.equal(bonus(1), 0);
    assert.equal(bonus(2), round(0.05 * 151.67));
    assert.equal(bonus(5), round(0.15 * 151.67));
    assert.equal(bonus(10), round(0.25 * 151.67));
  });

  it("counts the hours of a part-time contract and the overtime", () => {
    const partTime = {
      "salarié . contrat . temps de travail . temps partiel": "oui",
      "salarié . contrat . temps de travail . temps partiel . heures par semaine": "17.5 heure/semaine",
    };
    assert.equal(bonus(10, partTime), round(0.25 * (151.67 / 2)));
    assert.equal(bonus(10, { "salarié . temps de travail . heures supplémentaires": "10 heure/mois" }), round(0.25 * 161.67));
  });
});
