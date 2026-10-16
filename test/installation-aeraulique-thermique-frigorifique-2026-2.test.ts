import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "1412-installation-aeraulique-thermique-frigorifique";
const ns = "salarié . convention collective . installation aeraulique thermique frigorifique";

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((v) => v.version === "2026.2");
  assert.ok(version, "IDCC 1412 must be exported");
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "installation aeraulique thermique frigorifique"] } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

function set(engine: Engine, inputs: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié": "oui",
    "dirigeant": "non",
    "salarié . convention collective": "'installation aeraulique thermique frigorifique'",
    [`${ns} . coefficient`]: 300,
    ...Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key.includes(" . ") ? key : `${ns} . ${key}`, value])),
  });
}

const get = (engine: Engine, rule: string) => engine.evaluate(`${ns} . ${rule}`);

const HOURS: Record<number, number> = {
  370: 31365.02, 375: 33606.03, 380: 36014.16, 390: 38369.58, 430: 42779.62,
  460: 47390.43, 500: 52761.86, 600: 59939.2, 700: 71061.99,
};
const DAYS: Record<number, number> = {
  370: 35872.79, 375: 38435.87, 380: 41190.08, 390: 43884.04, 430: 48927.87,
  460: 54201.36, 500: 60344.76, 600: 68553.62, 700: 81274.96,
};
const MONTHLY: Record<number, number> = {
  176: 1872, 181: 1881.09, 186: 1889.76, 195: 1898.44, 205: 1907.12, 210: 1915.8,
  225: 1924.49, 235: 1960.94, 245: 2045.14, 260: 2143.2, 280: 2306.93, 300: 2471.98,
  320: 2620.95, 340: 2783.35, 365: 2988.67, 370: 2613.98, 375: 2800.14, 380: 3000.79,
  390: 3197.05, 430: 3564.51, 460: 3948.69, 500: 4396.26, 600: 4994.29, 700: 5921.07,
};

describe("IDCC 1412 — 2026.2 annex grid (avenant n° 77)", () => {
  it("is the highest revision for validFrom 2026-01-01", () => {
    const versions = (COMPILED_VERSIONS[id] ?? []).filter((v) => v.validFrom === "2026-01-01");
    assert.deepEqual(versions.map((v) => v.version).sort(), ["2026.1", "2026.2"]);
  });

  for (const [coefficient, expected] of Object.entries(MONTHLY)) {
    it(`coefficient ${coefficient}: monthly ${expected}`, async () => {
      const engine = await makeEngine();
      set(engine, { coefficient: Number(coefficient) });
      assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, expected);
      assert.equal(get(engine, "coefficient hors grille").nodeValue, false);
    });
  }

  for (const [coefficient, expected] of Object.entries(HOURS)) {
    it(`coefficient ${coefficient}: annual 1 607 h ${expected}, forfait jours ${DAYS[Number(coefficient)]}`, async () => {
      const engine = await makeEngine();
      set(engine, { coefficient: Number(coefficient) });
      const hours = get(engine, "salaire minimum annuel conventionnel");
      assert.equal(hours.nodeValue, expected);
      assert.equal(hours.unit?.denominators?.includes("an"), true);
      const days = get(engine, "salaire minimum annuel forfait jours conventionnel");
      assert.equal(days.nodeValue, DAYS[Number(coefficient)]);
      assert.equal(days.unit?.denominators?.includes("an"), true);
    });
  }

  it("has no annual amount below coefficient 370", async () => {
    const engine = await makeEngine();
    set(engine, { coefficient: 365 });
    assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, 0);
    assert.equal(get(engine, "salaire minimum annuel forfait jours conventionnel").nodeValue, 0);
  });

  it("prorates the monthly, annual and forfait-jours minimums once", async () => {
    const engine = await makeEngine();
    set(engine, { coefficient: 700, "salarié . contrat . temps de travail . quotité": "50 %" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 2960.535);
    assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, 35530.995);
    assert.equal(get(engine, "salaire minimum annuel forfait jours conventionnel").nodeValue, 40637.48);
  });

  it("rejects classifications absent from the published grid", async () => {
    const engine = await makeEngine();
    for (const coefficient of [0, 175, 999]) {
      set(engine, { coefficient });
      assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 0, String(coefficient));
      assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, 0, String(coefficient));
      assert.equal(get(engine, "salaire minimum annuel forfait jours conventionnel").nodeValue, 0, String(coefficient));
      assert.equal(get(engine, "coefficient hors grille").nodeValue, true, String(coefficient));
    }
  });
});
