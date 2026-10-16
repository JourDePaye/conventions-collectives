import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3016-ateliers-chantiers-insertion";
const value = "ateliers et chantiers d'insertion";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.2");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

// Avenant n° 39, articles 5.1.3 and 5.1.4: coefficient of each branch emploi-repère (sum of the palier points).
// Minimum (article 5.2.2) = 928 + coefficient x 4.04, full time, written out by hand.
const FULL_TIME: [number, number][] = [
  [240, 1897.6], [263, 1990.52], [274, 2034.96], [281, 2063.24], [297, 2127.88], [303, 2152.12], [312, 2188.48],
  [313, 2192.52], [322, 2228.88], [334, 2277.36], [393, 2515.72], [395, 2523.8], [400, 2544], [430, 2665.2],
  [434, 2681.36], [492, 2915.68], [494, 2923.76], [564, 3206.56], [670, 3634.8],
];
const REJECTED_BY_2026_1_LIST = [260, 280, 300, 330, 350, 370, 390, 410, 450, 470, 490, 510, 530, 550, 600, 630];

function run(rule: string, coefficient: number | undefined, quota?: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(coefficient === undefined ? {} : { [`${namespace} . coefficient`]: coefficient }),
    ...(quota ? { "salarié . contrat . temps de travail . quotité": quota } : {}),
  });
  return engine.evaluate(`${namespace} . ${rule}`).nodeValue;
}
const cents = (n: unknown) => Math.round((n as number) * 100) / 100;

describe("IDCC 3016 ateliers et chantiers d'insertion 2026.2", () => {
  it("applies from 1 June 2026", () => assert.equal(version.validFrom, "2026-06-01"));
  it("pays 928 + coefficient x 4.04 for the 19 coefficients of the branch emplois-repères", () => {
    for (const [coefficient, minimum] of FULL_TIME) {
      assert.equal(run("coefficient hors grille", coefficient), false, `${coefficient} is in the grid`);
      assert.equal(cents(run("salaire minimum conventionnel", coefficient)), minimum, String(coefficient));
    }
  });
  it("prorates for part time", () => {
    assert.equal(cents(run("salaire minimum conventionnel", 240, "60%")), 1138.56);
    assert.equal(cents(run("salaire minimum conventionnel", 670, "60%")), 2180.88);
    assert.equal(cents(run("salaire minimum conventionnel", 400, "50%")), 1272);
  });
  it("flags coefficients that are not in the text as out of grid", () => {
    for (const coefficient of [...REJECTED_BY_2026_1_LIST.filter((c) => c !== 600 && c !== 630), 0, 241, 671, 1000]) {
      assert.equal(run("coefficient hors grille", coefficient), true, String(coefficient));
    }
    assert.equal(run("coefficient hors grille", 600), true);
    assert.equal(run("coefficient hors grille", 630), true);
  });
  it("uses the lowest coefficient by default", () => {
    assert.equal(run("coefficient hors grille", undefined), false);
    assert.equal(cents(run("salaire minimum conventionnel", undefined)), 1897.6);
  });
});
