import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const ns = "salarié . convention collective . branche du sport";
const quiet = { logger: { log() {}, warn() {}, error() {} } };

async function engineOf(versionNumber: string, value: string) {
  const version = COMPILED_VERSIONS["2511-sport"]?.find((v) => v.version === versionNumber);
  assert.ok(version, `IDCC 2511 ${versionNumber} must be exported`);
  const extension = await version.loadRules();
  for (const name of Object.keys(extension)) assert.ok(!(name in modeleSocial), `Duplicate modele-social rule: ${name}`);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  if (!choice["une possibilité"].includes(value)) {
    rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  }
  Object.assign(rules, extension);
  return new Engine(rules, quiet);
}

const situation = (value: string, namespace: string, extra: Record<string, string> = {}) => ({
  salarié: "oui",
  dirigeant: "non",
  "salarié . convention collective": `'${value}'`,
  "salarié . contrat . salaire brut": "2200 €/mois",
  "salarié . contrat . statut cadre": "non",
  "entreprise . salariés . effectif": "5 employé",
  [`${namespace} . groupe`]: "'3'",
  ...extra,
});

const round = (value: unknown) => Math.round((value as number) * 100) / 100;

describe("IDCC 2511 Sport 2026.4", () => {
  it("applies from 1 January 2026, under its own rule value", async () => {
    const version = COMPILED_VERSIONS["2511-sport"]?.find((v) => v.version === "2026.4");
    assert.equal(version?.validFrom, "2026-01-01");
    const engine = await engineOf("2026.4", "branche du sport");
    engine.setSituation(situation("branche du sport", ns));
    assert.equal(engine.evaluate(ns).nodeValue, true);
    // modele-social's own sport agreement is not applied.
    assert.equal(engine.evaluate("salarié . convention collective . sport").nodeValue, false);
  });

  // Avenant n° 210 (KALITEXT000051927557), from 1 January 2026.
  it("keeps the monthly floors and the seniority bonus", async () => {
    const engine = await engineOf("2026.4", "branche du sport");
    for (const [group, expected] of Object.entries({ "1": 1848.42, "2": 1885.14, "3": 1997.87, "4": 2099.37, "5": 2333.99, "6": 2865.97 })) {
      engine.setSituation(situation("branche du sport", ns, { [`${ns} . groupe`]: `'${group}'` }));
      assert.equal(round(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue), expected, group);
    }
    // Group 1, 3 years: one period of 24 months (1 %) and the 5 % of group 1, on the group 3 minimum.
    engine.setSituation(situation("branche du sport", ns, { [`${ns} . groupe`]: "'1'", [`${ns} . ancienneté dans l'entreprise`]: "3 an" }));
    assert.equal(round(engine.evaluate(`${ns} . prime d'ancienneté`).nodeValue), round(1997.87 * 0.06));
  });

  it("charges the non-cadres' prévoyance of 0.485 % + 0.485 % (chapter X)", async () => {
    const engine = await engineOf("2026.4", "branche du sport");
    engine.setSituation(situation("branche du sport", ns));
    const conventional = "salarié . cotisations . prévoyances . conventionnelle";
    assert.equal(round(engine.evaluate(`${conventional} . employeur`).nodeValue), 10.67);
    assert.equal(round(engine.evaluate(`${conventional} . salarié`).nodeValue), 10.67);
  });

  it("computes the branch contributions by headcount (articles 2.3.2 and 8.6.2)", async () => {
    const engine = await engineOf("2026.4", "branche du sport");
    const contributions = (headcount: number, gross = 2200) => {
      engine.setSituation(situation("branche du sport", ns, {
        "entreprise . salariés . effectif": `${headcount} employé`,
        "salarié . contrat . salaire brut": `${gross} €/mois`,
      }));
      return ["financement du paritarisme", "formation professionnelle conventionnelle", "formation des dirigeants bénévoles"].map(
        (rule) => round(engine.evaluate(`${ns} . ${rule}`).nodeValue),
      );
    };
    // Under 10 employees: 0.09 %, 1.05 % and 0.02 % of 2 200 €.
    assert.deepEqual(contributions(5), [1.98, 23.1, 0.44]);
    // 10 to 49: 0.20 %; 50 to 299: 0.15 %; 300 and more: 0.10 %.
    assert.deepEqual(contributions(20), [1.98, 4.4, 0.44]);
    assert.deepEqual(contributions(100), [1.98, 3.3, 0.44]);
    assert.deepEqual(contributions(300), [1.98, 2.2, 0.44]);
    // A single employee paid 200 € a month: the yearly floors of the company, by month, are above
    // 0.09 % (0.18 €), 1.05 % (2.10 €) and 0.02 % (0.04 €) of the salary.
    assert.deepEqual(contributions(1, 200), [round(3 / 12), round(30 / 12), round(2 / 12)]);
    // The 5 000 € ceiling of the volunteer leaders' training, shared by 2 000 employees: 0.21 € a month.
    assert.deepEqual(contributions(2000, 2200)[2], round(5000 / 12 / 2000));
  });

  it("adds the branch contributions to the employer contributions of 2026.3", async () => {
    const employer = async (versionNumber: string, value: string, namespace: string) => {
      const engine = await engineOf(versionNumber, value);
      engine.setSituation(situation(value, namespace));
      return engine.evaluate("salarié . cotisations . employeur").nodeValue as number;
    };
    const before = await employer("2026.3", "sport", "salarié . convention collective . sport");
    const after = await employer("2026.4", "branche du sport", ns);
    assert.equal(round(after - before), round(1.98 + 23.1 + 0.44));
  });
});
