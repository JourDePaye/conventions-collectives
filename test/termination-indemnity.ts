/**
 * Reads the `indemnité de rupture` rules of an agreement version: for a seniority in months and the
 * other inputs, the months of the salary of reference the text gives for a dismissal, a
 * conventional termination, a retirement at the employer's initiative and a voluntary retirement.
 */
import assert from "node:assert/strict";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

export type TerminationIndemnities = {
  dismissal: number;
  conventionalTermination: number;
  forcedRetirement: number;
  voluntaryRetirement: number;
  /** Months added to the larger of the legal and the agreement's forced retirement indemnity, if any. */
  forcedRetirementSupplement: number;
};

export async function terminationEngine(
  model: string,
  revision: string,
  value: string,
  classification: Record<string, string | number> = {},
) {
  const version = COMPILED_VERSIONS[model]?.find((entry) => entry.version === revision);
  assert.ok(version, `${model} ${revision}`);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...new Set([...choice["une possibilité"], value])],
  } as Rule;
  Object.assign(rules, await version.loadRules());
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  const namespace = `salarié . convention collective . ${value}`;
  const rule = `${namespace} . indemnité de rupture`;
  const defines = (name: string) => `${rule} . ${name}` in engine.getParsedRules();
  const of = (
    seniorityMonths: number,
    inputs: { age?: number; cadre?: boolean; [name: string]: string | number | boolean | undefined } = {},
  ): TerminationIndemnities => {
    const { age, cadre, ...others } = inputs;
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      "salarié . contrat . statut cadre": cadre ? "oui" : "non",
      "salarié . contrat . salaire brut": "3000 €/mois",
      ...Object.fromEntries(Object.entries(classification).map(([name, v]) => [`${namespace} . ${name}`, v])),
      [`${rule} . ancienneté`]: `${seniorityMonths} mois`,
      ...(age === undefined ? {} : { [`${rule} . âge`]: `${age} an` }),
      ...Object.fromEntries(
        Object.entries(others)
          .filter(([, v]) => v !== undefined)
          .map(([name, v]) => [`${rule} . ${name}`, typeof v === "boolean" ? (v ? "oui" : "non") : typeof v === "number" ? `${v} mois` : v]),
      ),
    } as never);
    const months = (name: string) => {
      if (!defines(name)) return 0;
      const evaluated = engine.evaluate(`${rule} . ${name}`).nodeValue;
      assert.equal(typeof evaluated, "number", `${rule} . ${name}`);
      return evaluated as number;
    };
    return {
      dismissal: months("licenciement"),
      conventionalTermination: months("rupture conventionnelle"),
      forcedRetirement: months("mise à la retraite"),
      voluntaryRetirement: months("départ volontaire"),
      forcedRetirementSupplement: months("majoration de la mise à la retraite"),
    };
  };
  return { namespace, of, defines: (name: string) => defines(name) };
}
