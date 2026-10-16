import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3233-industrie-fabrication-ciments";
const value = "industrie de la fabrication des ciments";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.2");
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

const OUVRIERS: Record<number, number> = {
  140: 1851, 150: 1861, 160: 1873, 170: 1886, 180: 1900, 190: 1919, 205: 1993,
  215: 2089, 225: 2185, 235: 2283, 245: 2387, 255: 2569, 270: 2626,
  290: 2824, 310: 3029, 335: 3275, 360: 3539,
};
const CADRES: Record<number, number> = {
  185: 1896, 210: 2152, 230: 2357, 250: 2562, 270: 2767, 290: 2971,
  310: 3176, 330: 3381, 350: 3586, 360: 3689, 370: 3791, 380: 3893,
  390: 3996, 400: 4098, 600: 6147,
};

function setSituation(category: string, coefficient: number | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . catégorie`]: `'${category}'`,
    ...(coefficient === undefined ? {} : { [`${namespace} . coefficient`]: coefficient }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function evaluate(rule: string) {
  const result = engine.evaluate(`${namespace} . ${rule}`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

const outOfGrid = () => engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue;

describe("IDCC 3233 — 2026.2 minimum salaries", () => {
  it("is effective retroactively from 1 January 2026 (article 4.2)", () => {
    assert.equal(version.validFrom, "2026-01-01");
    assert.ok(version.sources.some((source) => source.includes("rétroactivement à compter du 1er janvier 2026")));
    assert.ok(version.sources.some((source) => source.includes("TRST2616906A")));
  });

  it("is selected from January to 8 July 2026, then 2026.1 (same grid) takes over", () => {
    const list = COMPILED_VERSIONS[agreement]!;
    const inForce = (date: string) => {
      const eligible = list.filter((entry) => entry.validFrom <= date);
      const latest = eligible.map((entry) => entry.validFrom).sort().at(-1);
      return eligible.filter((entry) => entry.validFrom === latest).map((entry) => entry.version).sort().at(-1);
    };
    assert.equal(inForce("2026-01-01"), "2026.2");
    assert.equal(inForce("2026-07-08"), "2026.2");
    assert.equal(inForce("2026-07-09"), "2026.1");
    assert.equal(inForce("2025-12-31"), undefined);
  });

  for (const [coefficient, expected] of Object.entries(OUVRIERS)) {
    it(`gives ${expected} € a month for coefficient ${coefficient}`, () => {
      setSituation("ouvriers et ETAM", Number(coefficient));
      assert.equal(evaluate("salaire minimum conventionnel"), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  for (const [coefficient, expected] of Object.entries(CADRES)) {
    it(`gives ${expected} € a month for cadre coefficient ${coefficient}`, () => {
      setSituation("ingénieurs et cadres", Number(coefficient));
      assert.equal(evaluate("salaire minimum conventionnel"), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation("ouvriers et ETAM", 205, "50%");
    assert.equal(evaluate("salaire minimum conventionnel"), 996.5);
  });

  it("rejects coefficients outside the category grid", () => {
    setSituation("ouvriers et ETAM", 200);
    assert.equal(outOfGrid(), true);
    assert.equal(evaluate("salaire minimum conventionnel"), 0);
    setSituation("ingénieurs et cadres", 220);
    assert.equal(outOfGrid(), true);
    assert.equal(evaluate("salaire minimum conventionnel"), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("ouvriers et ETAM", 200);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, null);
  });
});
