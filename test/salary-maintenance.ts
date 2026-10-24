/**
 * Reads the `maintien de salaire` rules of an agreement version as JourDePaye does: for a motive
 * and a seniority in months, the eligibility, waiting days, the two periods, the window, the base
 * and the net cap.
 */
import type Engine from "publicodes";

export type Motive = "maladie" | "accident du travail" | "accident de trajet" | "maternité" | "paternité" | "adoption";

export const MOTIVES: readonly Motive[] = [
  "maladie",
  "accident du travail",
  "accident de trajet",
  "maternité",
  "paternité",
  "adoption",
];

export type Maintenance = {
  eligible: boolean;
  waitingDays: number;
  periods: [days: number, rate: number][];
  window: string;
  base: string;
  netCap: boolean;
  seniorityDuringAbsence: boolean;
};

/**
 * The maintenance of `namespace` for a motive and a seniority, the other inputs (`rang de
 * l'arrêt`, `enfant à charge`) in `inputs`, on top of the situation `setSituation` gives.
 */
export function maintenanceOf(
  engine: Engine,
  setSituation: (context?: Record<string, string | number>) => void,
  namespace: string,
  motive: Motive,
  seniorityMonths: number,
  inputs: Record<string, string | number> = {},
  context: Record<string, string | number> = {},
): Maintenance {
  const rule = `${namespace} . maintien de salaire`;
  setSituation({
    ...context,
    [`${rule} . motif`]: `'${motive}'`,
    [`${rule} . ancienneté`]: `${seniorityMonths} mois`,
    ...Object.fromEntries(Object.entries(inputs).map(([name, value]) => [`${rule} . ${name}`, value])),
  });
  const value = (name: string) => engine.evaluate(`${rule} . ${name}`).nodeValue;
  const days = (name: string) => value(name) as number;
  const periods: [number, number][] = (["première période", "seconde période"] as const)
    .map((name): [number, number] => [days(`${name} . durée`), value(`${name} . taux`) as number])
    .filter(([duration]) => duration > 0);
  return {
    eligible: value("éligible") === true,
    waitingDays: days("carence"),
    periods,
    window: value("fenêtre") as string,
    base: value("base") as string,
    netCap: value("plafond net") === true,
    seniorityDuringAbsence: value("ancienneté en cours d'absence") === true,
  };
}
