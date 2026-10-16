import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3254-boucherie-poissonnerie";
const value = "boucherie poissonnerie";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.2");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

// Avenant n° 13-B du 10 juin 2026 (KALITEXT000054952088), annexe, €/mois for 151,67 h.
const BOUCHERIE: readonly [string, number][] = [
  ["I-A", 1968], ["I-B", 1989], ["II-A", 2013], ["II-B", 2033], ["II-C", 2068], ["III-A", 2192],
  ["III-B", 2241], ["III-C", 2328], ["IV-A", 2336], ["IV-B", 2407], ["IV-C", 2444], ["IV-D", 2563],
  ["V", 2782], ["VI-A", 3033], ["VI-B", 3054], ["VI-C", 3419], ["VII-A", 3893], ["VII-B", 3992],
];
// Avenant n° 12-P du 10 juin 2026 (KALITEXT000054952074), titre II de la partie V.
const POISSONNERIE: readonly [number, number][] = [
  [130, 1897.02], [135, 1947.54], [140, 1969.37], [145, 1994.97], [150, 2020.15], [160, 2049.49],
  [165, 2079.53], [170, 2106.56], [175, 2135.19], [180, 2154.96], [185, 2192.97], [190, 2212.83],
  [195, 2251.42], [200, 2271.78], [205, 2311.45], [210, 2394.41], [220, 2421.08], [230, 2477.97],
  [240, 2521.78], [250, 2563.35], [300, 3139.15], [350, 3461.65], [400, 3784.06], [450, 4104.62],
];

function set(situation: { niveau?: string; coefficient?: number }, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(situation.niveau === undefined ? {} : { [`${namespace} . niveau`]: `'${situation.niveau}'` }),
    ...(situation.coefficient === undefined ? {} : { [`${namespace} . coefficient`]: situation.coefficient }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}
const minimum = () => {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
};
const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 3254 — 2026.2 (avenants 13-B and 12-P, from 1 October 2026)", () => {
  it("records the effective date and sources", () => {
    assert.equal(version.validFrom, "2026-10-01");
    for (const id of ["KALITEXT000054952088", "KALITEXT000054952074"]) {
      assert.ok(version.sources.some((s) => s.includes(id)), id);
    }
    assert.ok(version.sources.some((s) => s.includes("7 septembre 2026")));
    const versions = COMPILED_VERSIONS[agreement] ?? [];
    assert.equal(versions.find((v) => v.version === "2026.1")?.validFrom, "2026-06-01");
  });

  for (const [niveau, expected] of BOUCHERIE) {
    it(`boucherie ${niveau}: ${expected} €`, () => {
      set({ niveau });
      assert.equal(minimum(), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  for (const [coefficient, expected] of POISSONNERIE) {
    it(`poissonnerie coefficient ${coefficient}: ${expected} €`, () => {
      set({ coefficient });
      assert.equal(minimum(), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates once for part-time work", () => {
    set({ niveau: "IV-D" }, "50%");
    assert.equal(minimum(), 1281.5);
    set({ coefficient: 250 }, "80%");
    assert.equal(minimum(), 2050.68);
  });

  it("rejects missing and unknown classifications", () => {
    for (const situation of [{ niveau: "VIII-A" }, { niveau: "non renseigné" }, { coefficient: 155 }, { coefficient: 500 }, {}]) {
      set(situation);
      assert.equal(outOfGrid(), true, JSON.stringify(situation));
      assert.equal(minimum(), 0, JSON.stringify(situation));
    }
  });

  it("stays isolated from another agreement", () => {
    for (const name of Object.keys(extension)) assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
    set({ niveau: "II-C" });
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
