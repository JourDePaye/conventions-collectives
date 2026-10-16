import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3216-negoce-materiaux-construction";
const value = "négoce des matériaux de construction";
const namespace = `salarié . convention collective . ${value}`;

async function load(revision: string) {
  const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === revision);
  assert.ok(version, revision);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, await version.loadRules());
  return { version, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
}
const round = (n: unknown) => Math.round((n as number) * 100) / 100;

function suite(revision: string, validFrom: string, monthly: Record<number, number>, annual: Record<number, number>, partTime: [number, number], partTimeCadre: [number, number]) {
  describe(`IDCC 3216 ${revision}`, async () => {
    const { version, engine } = await load(revision);
    const set = (o: Record<string, unknown>, quota = "100%") =>
      engine.setSituation({ "salarié . convention collective": `'${value}'`, "salarié . contrat . temps de travail . quotité": quota, ...o });
    const monthlyMin = () => round(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue);
    const annualMin = () => round(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel cadre`).nodeValue);
    const outside = () => engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue;
    it("has the expected effective date", () => assert.equal(version.validFrom, validFrom));
    for (const [c, v] of Object.entries(monthly)) {
      it(`gives ${v} €/mois for coefficient ${c}`, () => {
        set({ [`${namespace} . coefficient`]: Number(c) });
        assert.equal(monthlyMin(), v);
        assert.equal(outside(), false);
      });
    }
    for (const [c, v] of Object.entries(annual)) {
      it(`gives ${v} €/an for cadre coefficient ${c}`, () => {
        set({ [`${namespace} . coefficient cadre`]: Number(c) });
        assert.equal(annualMin(), v);
        assert.equal(outside(), false);
      });
    }
    it("prorates part-time work", () => {
      set({ [`${namespace} . coefficient`]: partTime[0] }, "50%");
      assert.equal(monthlyMin(), partTime[1]);
      set({ [`${namespace} . coefficient cadre`]: partTimeCadre[0] }, "80%");
      assert.equal(annualMin(), partTimeCadre[1]);
    });
    it("flags classifications outside the grids", () => {
      for (const o of [{ [`${namespace} . coefficient`]: 175 }, { [`${namespace} . coefficient`]: 360 }, { [`${namespace} . coefficient cadre`]: 400 }, {}]) {
        set(o);
        assert.equal(outside(), true);
      }
      set({ [`${namespace} . coefficient cadre`]: 400 });
      assert.equal(annualMin(), 0);
    });
  });
}

suite("2025.2", "2025-04-26",
  { 165: 1827.1, 245: 2105.74, 310: 2362.81, 350: 2521.01 },
  { 350: 32830, 380: 35644, 410: 38458, 450: 42210, 490: 45962, 550: 51590, 600: 56280, 650: 60970, 680: 63784, 750: 70350 },
  [245, 1052.87], [450, 33768]);

suite("2026.1", "2026-03-01",
  { 165: 1848.65, 170: 1856, 180: 1869, 195: 1929, 210: 1989, 225: 2049, 245: 2129, 250: 2149, 270: 2229, 290: 2309, 310: 2389, 330: 2469, 350: 2549 },
  { 350: 33190.5, 380: 36035.4, 410: 38880.3, 450: 42673.5, 490: 46466.7, 550: 52156.5, 600: 56898, 650: 61639.5, 680: 64484.4, 750: 71122.5 },
  [245, 1064.5], [450, 34138.8]);

describe("IDCC 3216 version selection", () => {
  it("orders the versions by validFrom then revision", () => {
    const list = COMPILED_VERSIONS[agreement]!.map((v) => `${v.validFrom}/${v.version}`);
    assert.deepEqual(list, ["2025-04-26/2025.1", "2025-04-26/2025.2", "2026-03-01/2026.1"]);
  });
});
