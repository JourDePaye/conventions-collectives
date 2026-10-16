import assert from "node:assert/strict";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { describe, it } from "node:test";
import { COMPILED_VERSIONS } from "../src/index.ts";

const model = "1077-negoce-produits-du-sol-engrais";
const value = "négoce et industrie des produits du sol, engrais et produits connexes";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[model]?.find((entry) => entry.version === "2025.1");
assert.ok(version, "IDCC 1077 version 2025.1 must be compiled");
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = {
  ...choice,
  "une possibilité": [...new Set([...choice["une possibilité"], value])],
} as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

// Annexe de l'avenant n° 74 du 26 mars 2025 (base 35 heures), amounts copied from Légifrance.
const MONTHLY: Record<number, number> = {
  115: 1834.95,
  120: 1876.25,
  140: 1882.54,
  155: 1889.65,
  165: 1897.6,
  180: 1906.62,
  200: 1916.71,
  220: 1926.84,
  235: 1968.78,
  240: 1990.25,
  245: 2011.72,
  250: 2033.2,
  255: 2054.65,
  260: 2076.11,
  270: 2119.06,
  275: 2140.53,
  285: 2183.47,
  290: 2204.93,
  295: 2226.39,
  305: 2269.34,
  310: 2290.8,
  315: 2312.26,
  325: 2355.22,
  335: 2398.17,
  340: 2419.6,
  350: 2439.28,
  400: 2651.93,
  425: 2758.26,
  430: 2779.53,
  450: 2864.59,
  460: 2907.12,
  470: 2949.65,
  495: 3055.97,
  520: 3162.3,
  540: 3247.38,
  560: 3332.42,
  580: 3417.49,
  600: 3502.54,
  620: 3587.6,
  680: 3842.8,
};

function setSituation(coefficient: number | undefined, quota?: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(coefficient === undefined ? {} : { [`${namespace} . coefficient`]: coefficient }),
    ...(quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": quota }),
  });
}

function amount() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

describe("IDCC 1077 — 2025.1 négoce des produits du sol, engrais et produits connexes", () => {
  it("is effective from 1 March 2025 and cites the extended avenant n° 74", () => {
    assert.equal(version.validFrom, "2025-03-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 74 du 26 mars 2025")));
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000051910263")));
    assert.ok(version.sources.some((source) => source.includes("arrêté du 2 juin 2025")));
  });

  for (const [coefficient, monthly] of Object.entries(MONTHLY)) {
    it(`coefficient ${coefficient}: ${monthly} € per month`, () => {
      setSituation(Number(coefficient));
      assert.equal(amount(), monthly);
      assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, false);
    });
  }

  it("covers the 40 coefficients of the grid, 115 to 680", () => {
    assert.equal(Object.keys(MONTHLY).length, 40);
  });

  it("prorates the monthly minimum once for part-time work", () => {
    setSituation(350, "60%");
    assert.equal(amount(), 1463.57);
  });

  it("flags a coefficient absent from the grid and returns no minimum", () => {
    for (const coefficient of [0, 100, 130, 681, 999]) {
      setSituation(coefficient);
      assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true, String(coefficient));
      assert.equal(amount(), 0);
    }
    setSituation(undefined);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
  });
});
