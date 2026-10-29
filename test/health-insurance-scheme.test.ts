/**
 * The conventional health insurance schemes (complémentaire santé) of 1261 (2026.10), 1505
 * (2026.8) and 1512 (2026.6) replace modele-social's premium and employer share, so that an
 * application can set the company's own premium or share on the agreement's rules. Expected
 * amounts come from the legal texts, independently of the YAML, with the PMSS of 2026 (4 005 €):
 * - 1261, avenant n° 01-25 du 10 octobre 2025, article 3 (KALIARTI000053320421): 1,60 % of the
 *   PMSS, 60 % paid by the employer;
 * - 1505, avenant n° 125 du 5 juillet 2017 (KALITEXT000035993653): 1,51 % of the PMSS, shared
 *   equally;
 * - 1512, accord du 23 octobre 2024 (KALITEXT000050792995): 2,60 % of the PMSS, shared equally.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const PMSS = 4005;
const HEALTH = "salarié . cotisations . prévoyances . santé";

const SCHEMES = [
  { agreement: "1261-acteurs-lien-social-familial", version: "2026.10", value: "acteurs du lien social et familial", rate: 0.016, employerShare: 0.6 },
  { agreement: "1505-commerce-detail-alimentaire-non-specialise", version: "2026.8", value: "commerce de détail alimentaire non spécialisé", rate: 0.0151, employerShare: 0.5 },
  { agreement: "1512-promotion-immobiliere", version: "2026.6", value: "promotion immobilière", rate: 0.026, employerShare: 0.5 },
];

const cents = (value: unknown) => Math.round((value as number) * 100) / 100;

for (const { agreement, version: name, value, rate, employerShare } of SCHEMES) {
  const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === name);
  assert.ok(version, `${agreement} ${name}`);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], value],
  } as Rule;
  Object.assign(rules, await version.loadRules());
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  const namespace = `salarié . convention collective . ${value} . santé`;
  const evaluate = (rule: string) => cents(engine.evaluate(`${HEALTH} . ${rule}`).nodeValue);

  describe(`${agreement} ${name} — health insurance scheme`, () => {
    it("computes the conventional premium and its employer share", () => {
      engine.setSituation({ "salarié . convention collective": `'${value}'` });
      const premium = PMSS * rate;
      assert.equal(evaluate("montant"), cents(premium));
      assert.equal(evaluate("employeur"), cents(premium * employerShare));
      assert.equal(evaluate("salarié"), cents(premium * (1 - employerShare)));
    });

    it("takes a premium and an employer share set on its rules", () => {
      engine.setSituation({
        "salarié . convention collective": `'${value}'`,
        [`${namespace} . montant`]: "120 €/mois",
        [`${namespace} . taux employeur`]: "75 %",
      });
      assert.equal(evaluate("employeur"), 90);
      assert.equal(evaluate("salarié"), 30);
    });

    it("leaves modele-social's default to the other agreements", () => {
      engine.setSituation({ "salarié . convention collective": "'droit commun'" });
      assert.equal(evaluate("montant"), 40);
      assert.equal(evaluate("employeur"), 20);
    });
  });
}
