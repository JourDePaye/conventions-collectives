import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "1555-produits-pharmaceutiques";
const ns = "salarié . convention collective . produits pharmaceutiques";

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((v) => v.version === "2026.1");
  assert.ok(version, "IDCC 1555 must be exported");
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "produits pharmaceutiques"] } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

function set(engine: Engine, inputs: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié": "oui",
    "dirigeant": "non",
    "salarié . convention collective": "'produits pharmaceutiques'",
    [`${ns} . niveau`]: "'I.1'",
    ...Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key.includes(" . ") ? key : `${ns} . ${key}`, value])),
  });
}

const get = (engine: Engine, rule: string) => engine.evaluate(`${ns} . ${rule}`);

const monthly = {
  "I.1": 1835,
  "I.2": 1848.76,
  "I.3": 1876.49,
  "I.4": 1914.02,
  "I.5": 1961.87,
  "I.6": 2020.73,
  "II.1": 2121.77,
  "II.2": 2232.10,
  "II.3": 2352.63,
  "II.4": 2484.38,
  "II.5": 2625.99,
  "II.6": 2778.30,
  "II.7": 2942.22,
} as const;

const annual = {
  "III.1": 37381,
  "III.2": 42579,
  "III.3": 46611,
  "III.4": 50346,
  "III.5": 54616,
  "III.6": 58887,
  "III.7": 63691,
  "III.8": 68497,
  "III.9": 73834,
  "III.10": 79171,
} as const;

describe("IDCC 1555 — March 2026 salary grids", () => {
  for (const [level, amount] of Object.entries(monthly)) {
    it(`${level} monthly minimum is ${amount} euros`, async () => {
      const engine = await makeEngine();
      set(engine, { niveau: `'${level}'` });
      assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, amount);
    });
  }
  for (const [level, amount] of Object.entries(annual)) {
    it(`${level} annual guarantee is ${amount} euros`, async () => {
      const engine = await makeEngine();
      set(engine, { niveau: `'${level}'` });
      assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, amount);
    });
  }
  for (const level of ["I.0", "II.8", "III.11", "non renseigné"]) {
    it(`rejects out-of-grid level ${level}`, async () => {
      const engine = await makeEngine();
      set(engine, { niveau: `'${level}'` });
      assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, null);
      assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, null);
    });
  }
});

describe("IDCC 1555 — part time and annual endpoint", () => {
  it("prorates the monthly RMMG once by contract fraction", async () => {
    const engine = await makeEngine();
    set(engine, { niveau: "'II.1'", "salarié . contrat . temps de travail . quotité": "50%" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 1060.885);
  });

  it("keeps the annual RAG in euros per year without inventing a monthly conversion", async () => {
    const engine = await makeEngine();
    set(engine, { niveau: "'III.1'" });
    const result = get(engine, "salaire minimum annuel conventionnel");
    assert.equal(result.nodeValue, 37381);
    assert.equal(result.unit?.denominators?.includes("an"), true);
  });
});