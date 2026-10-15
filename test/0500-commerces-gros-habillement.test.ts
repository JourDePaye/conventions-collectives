import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const namespace = "salarié . convention collective . commerces de gros habillement";

async function engineFor(revision: string, classification: string, quotient = "100%") {
  const version = COMPILED_VERSIONS["0500-commerces-gros-habillement"]?.find((v) => v.version === revision);
  assert.ok(version);
  const extension = await version.loadRules();
  const engine = new Engine({ ...modeleSocial, ...extension }, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    "salarié . convention collective": "'commerces de gros habillement'",
    [`${namespace} . classification`]: `'${classification}'`,
    "salarié . contrat . statut cadre": "non",
    "salarié . contrat . temps de travail . quotité": quotient,
  } as any);
  return { engine, version };
}

const minimum = (engine: Engine) => engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
const outOfGrid = (engine: Engine) => engine.evaluate(`${namespace} . classification hors grille`).nodeValue;

describe("IDCC 500 — commerces de gros de l'habillement — 2024.1", () => {
  it("evaluates the sourced employee minimum and prorates it", async () => {
    const { engine } = await engineFor("2024.1", "employés IV B", "50%");
    assert.equal(minimum(engine), 950);
  });

  it("evaluates a management classification", async () => {
    const { engine } = await engineFor("2024.1", "agents de maîtrise VI C");
    assert.equal(minimum(engine), 2278);
  });

  it("marks an unknown classification outside the modeled grid", async () => {
    const { engine } = await engineFor("2024.1", "employés IX Z");
    assert.equal(outOfGrid(engine), true);
    assert.equal(minimum(engine), 0);
  });
});

// Avenant n° 56 A du 26 novembre 2024, under the codes of the revision 2024.2.
const GRID_2024 = {
  "E-IA": 1813, "E-IB": 1819, "E-IIA": 1840, "E-IIB": 1846, "E-IIIA": 1867, "E-IIIB": 1873,
  "E-IVA": 1894, "E-IVB": 1900, "E-VA": 1921, "E-VB": 1927,
  "AM-VIA": 2062, "AM-VIB": 2154, "AM-VIC": 2278, "AM-VII": 2440,
  "C-IA": 2753, "C-IB": 2991, "C-IIA": 3429, "C-IIB": 4061, "C-III": 4579,
};

// Avenant du 25 juin 2026 à l'annexe 56 A (BOCC 2026-30, texte n° 4); the CFDT communiqué of
// 2 July 2026, the source of version 2026.1, gives the same amounts.
const GRID_2026 = {
  "E-IA": 1868, "E-IB": 1873, "E-IIA": 1896, "E-IIB": 1901, "E-IIIA": 1923, "E-IIIB": 1929,
  "E-IVA": 1951, "E-IVB": 1957, "E-VA": 1979, "E-VB": 1985,
  "AM-VIA": 2093, "AM-VIB": 2186, "AM-VIC": 2312, "AM-VII": 2476,
  "C-IA": 2780, "C-IB": 3020, "C-IIA": 3463, "C-IIB": 4101, "C-III": 4625,
};

for (const [revision, validFrom, grid] of [
  ["2024.2", "2024-12-01", GRID_2024],
  ["2026.1", "2026-09-20", GRID_2026],
  ["2026.2", "2026-09-20", GRID_2026],
] as const) {
  describe(`IDCC 500 — commerces de gros de l'habillement — ${revision}`, () => {
    it("takes effect on its sourced date", async () => {
      const { version } = await engineFor(revision, "E-IA");
      assert.equal(version.validFrom, validFrom);
    });

    for (const [classification, amount] of Object.entries(grid)) {
      it(`${classification}: ${amount} €`, async () => {
        const { engine } = await engineFor(revision, classification);
        assert.equal(minimum(engine), amount);
        assert.equal(outOfGrid(engine), false);
      });
    }

    it("prorates the minimum by working time", async () => {
      const { engine } = await engineFor(revision, "E-IVB", "50%");
      assert.equal(minimum(engine), grid["E-IVB"] / 2);
    });

    it("marks the former labels and unknown codes outside the grid", async () => {
      for (const classification of ["employés I A", "E-IX", "C-IV"]) {
        const { engine } = await engineFor(revision, classification);
        assert.equal(outOfGrid(engine), true, classification);
        assert.equal(minimum(engine), 0, classification);
      }
    });
  });
}

describe("IDCC 500 — 2026.2 official source", () => {
  it("cites the text published in the BOCC", async () => {
    const { version } = await engineFor("2026.2", "E-IA");
    assert.ok(version.sources.some((source) => source.includes("boc_20260030_0000_0004")));
  });
});
