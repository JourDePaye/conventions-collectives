import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const name = "1821-cristal-verre-vitrail";
const value = "cristal verre vitrail";
const namespace = `salarié . convention collective . ${value}`;

const engineFor = async (coefficient: number, quotient = "100%", excluded = "non") => {
  const version = COMPILED_VERSIONS[name]?.find((item: { version: string }) => item.version === "2026.3");
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . coefficient`]: String(coefficient),
    [`${namespace} . annexe B vitrail exclue`]: excluded,
    "salarié . contrat . temps de travail . quotité": quotient,
    "salarié . contrat . statut cadre": "non",
  });
  return engine;
};

describe("IDCC 1821 — cristal, verre et vitrail", () => {
  it("proratise the sourced 2026 monthly minimum", async () => {
    const engine = await engineFor(245, "50%");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 1092.795);
  });

  it("rejects coefficients outside the published grid", async () => {
    const engine = await engineFor(120);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, 0);
  });

  it("makes the salary grid inapplicable to the excluded annexe B", async () => {
    const engine = await engineFor(245, "100%", "oui");
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });

  it("gives the SMG of article 2 of the accord of 3 March 2026 (KALITEXT000054426625)", async () => {
    const expected: Record<number, number> = {
      115: 1837.53, 125: 1843.55, 135: 1854.19, 145: 1866.86, 155: 1883.9, 160: 1891.44,
      175: 1925.42, 190: 1958.81, 205: 1977.09, 220: 2010.52, 230: 2032.78, 245: 2185.59,
      260: 2346.31, 275: 2507.05, 290: 2667.77, 295: 2715.59, 315: 2864.63, 330: 3166.57,
      345: 3679.22, 385: 3756.35, 440: 4008.22, 490: 4465.53, 550: 4973.42, 660: 5811.9,
      770: 6520.52, 880: 7342.6,
    };
    for (const [coefficient, amount] of Object.entries(expected)) {
      const engine = await engineFor(Number(coefficient));
      assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, amount, `coefficient ${coefficient}`);
    }
  });

  it("proratises the highest coefficient for a part-time contract", async () => {
    const engine = await engineFor(880, "80%");
    assert.equal(Math.round((engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue as number) * 100) / 100, 5874.08);
  });

  it("rejects coefficient 100, which the text says nobody holds", async () => {
    const engine = await engineFor(100);
    assert.equal(engine.evaluate(`${namespace} . coefficient hors grille`).nodeValue, true);
  });
});
