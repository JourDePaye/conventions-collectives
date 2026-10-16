import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3255-boulangerie-industrielle";
const value = "boulangerie industrielle";
const namespace = `salarié . convention collective . ${value}`;

async function engineOf(versionName: string) {
  const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === versionName);
  assert.ok(version, versionName);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  return { version, engine };
}

function helpers(engine: Engine) {
  return {
    set(level: string | undefined, quota = "100%") {
      engine.setSituation({
        "salarié . convention collective": `'${value}'`,
        ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
        "salarié . contrat . temps de travail . quotité": quota,
      });
    },
    minimum() {
      const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
      assert.equal(typeof result, "number");
      return Math.round((result as number) * 100) / 100;
    },
    outside() {
      return engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;
    },
  };
}

// Grids copied from the legal texts, independently of the YAML.
// Article 21 as in force from 1 Dec 2025 (amounts of 1 Feb 2025), transposition grid.
const GRID_2025: Record<string, number> = {
  A1: 1804.8, A2: 1814.33, B1: 1825.01, B2: 1839.61,
  C1: 1855.52, C2: 1872.23, C3: 1892.82, D1: 1917.72, D2: 1933.07, D3: 1954.33,
  E1: 1988.82, E2: 2020.64, E3: 2074.18, F1: 2201.48, F2: 2222.39, F3: 2253.51,
  G1: 2299.58, G2: 2342.12, G3: 2412.38, H1: 2544.01, H2: 2610.15, H3: 2718.47,
  I: 2891.3, J1: 3070.81, J2: 3175.22, J3: 3280,
  K1: 3461.53, K2: 3648.45, K3: 3834.52, L1: 4019.73, L2: 4276.99, L3: 4578.52, M: 5161.52,
};
const BOULANGERIE_2025: Record<string, number> = {
  OE1: 1814.33, OE2: 1825.01, OE3: 1839.61, OE4: 1872.23, OE5: 1917.72, OE6: 1988.82, OE7: 2074.18,
  TAM1: 2201.48, TAM2: 2342.12, TAM3: 2544.01, TAM4: 2718.47, TAM5: 2891.3,
  CA1: 3070.81, CA2: 3461.53, CA3: 4019.73, CA4: 4578.52, CA5: 5161.52,
};
const OEUFS_2025: Record<string, number> = {
  "I-1": 1804.8, "I-2": 1814.33, "I-3": 1826.65, "II-1": 1835.95, "II-2": 1845.24, "II-3": 1854.54,
  "III-1": 1864.86, "III-2": 1875.19, "III-3": 1885.52, "IV-1": 1901.01, "IV-2": 1916.5, "IV-3": 1931.99,
  "V-1": 2019.85, "V-2": 2055.62, "V-3": 2091.39, "VI-1": 2164.08, "VI-2": 2222.5, "VI-3": 2282.51,
  "VII-1": 2470.01, "VII-2": 2617.39, "VII-3": 2764.76, "VIII-1": 3060.72, "VIII-2": 3356.67, "VIII-3": 3788.11,
  "IX-1": 4502.43, "IX-2": 4932.68, "IX-3": 5485.35,
};
// Avenant n° 4 du 22 janvier 2026, from 1 Mar 2026.
const GRID_2026: Record<string, number> = {
  A1: 1826.03, A2: 1835.74, B1: 1846.55, B2: 1861.32,
  C1: 1877.42, C2: 1894.32, C3: 1915.16, D1: 1940.35, D2: 1955.88, D3: 1977.39,
  E1: 2012.29, E2: 2044.48, E3: 2098.66, F1: 2227.46, F2: 2248.61, F3: 2280.1,
  G1: 2326.72, G2: 2369.76, G3: 2440.85, H1: 2574.03, H2: 2640.95, H3: 2750.55,
  I: 2925.42, J1: 3107.05, J2: 3212.69, J3: 3318.7,
  K1: 3502.38, K2: 3691.5, K3: 3879.77, L1: 4067.16, L2: 4327.46, L3: 4632.55, M: 5222.43,
};

describe("IDCC 3255, version 2025.1 (article 21 from 1 December 2025)", async () => {
  const { version, engine } = await engineOf("2025.1");
  const { set, minimum, outside } = helpers(engine);

  it("is effective from the entry into force of the extended convention", () => {
    assert.equal(version.validFrom, "2025-12-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000051150351")));
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000051537768")));
  });

  it("has the expected number of positions", () => {
    assert.equal(Object.keys(GRID_2025).length, 33);
    assert.equal(Object.keys(BOULANGERIE_2025).length, 17);
    assert.equal(Object.keys(OEUFS_2025).length, 27);
  });

  for (const grid of [GRID_2025, BOULANGERIE_2025, OEUFS_2025]) {
    for (const [level, expected] of Object.entries(grid)) {
      it(`gives ${expected} € a month for ${level}`, () => {
        set(level);
        assert.equal(minimum(), expected);
        assert.equal(outside(), false);
      });
    }
  }

  it("prorates the minimum for part-time work", () => {
    set("L3", "50%");
    assert.equal(minimum(), 2289.26);
    set("OE1", "80%");
    assert.equal(minimum(), 1451.46);
  });

  it("flags classifications outside the grids", () => {
    for (const level of ["Z1", "A3", "OE8", "CA6", "I-4", "X-1", "non renseigné"]) {
      set(level);
      assert.equal(outside(), true, level);
      assert.equal(minimum(), 0, level);
    }
    set(undefined);
    assert.equal(outside(), true);
  });

  it("is inapplicable for another collective agreement", () => {
    set("A1");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});

describe("IDCC 3255, version 2026.1 (avenant n° 4 from 1 March 2026)", async () => {
  const { version, engine } = await engineOf("2026.1");
  const { set, minimum, outside } = helpers(engine);

  it("is effective on 1 March 2026 and cites the extended amendment", () => {
    assert.equal(version.validFrom, "2026-03-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000054162284")));
  });

  it("has the 33 positions of the grid", () => {
    assert.equal(Object.keys(GRID_2026).length, 33);
  });

  for (const [level, expected] of Object.entries(GRID_2026)) {
    it(`gives ${expected} € a month for ${level}`, () => {
      set(level);
      assert.equal(minimum(), expected);
      assert.equal(outside(), false);
    });
  }

  it("prorates the minimum for part-time work", () => {
    set("M", "50%");
    assert.equal(minimum(), 2611.22);
    set("A1", "60%");
    assert.equal(minimum(), 1095.62);
  });

  it("no longer accepts the transitional sector grids", () => {
    for (const level of ["OE1", "TAM3", "CA5", "I-1", "IX-3", "Z1", "non renseigné"]) {
      set(level);
      assert.equal(outside(), true, level);
      assert.equal(minimum(), 0, level);
    }
  });

  it("is inapplicable for another collective agreement", () => {
    set("A1");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});
