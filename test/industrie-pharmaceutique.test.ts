import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "0176-industrie-pharmaceutique";
const ns = "salarié . convention collective . industrie pharmaceutique";

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((v) => v.version === "2026.1");
  assert.ok(version, "IDCC 176 must be exported");
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "industrie pharmaceutique"] } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

function set(engine: Engine, groupe: string, quotité = "100%") {
  engine.setSituation({
    "salarié": "oui",
    "dirigeant": "non",
    "salarié . convention collective": "'industrie pharmaceutique'",
    [`${ns} . groupe`]: `'${groupe}'`,
    ["salarié . contrat . temps de travail . quotité"]: quotité,
  });
}

const grid = {
  "1A": 1837.34, "1B": 1837.34, "1C": 1856.06, "2A": 1856.06,
  "2B": 1893.51, "2C": 1977.76, "3A": 1977.76, "3B": 2024.57,
  "3C": 2193.07, "4A": 2193.07, "4B": 2267.96, "4C": 2483.27,
  "5A": 2483.27, "5B": 2586.24, "5C": 2867.08, "6A": 2867.08,
  "6B": 2998.14, "6C": 3344.51, "7A": 3475.57, "7B": 4065.33,
  "8A": 4196.39, "8B": 4898.49, "9A": 5029.55, "9B": 5862.70,
  "10": 6386.93, "11": 6911.17,
} as const;

describe("IDCC 176 — January 2026 salary grid", () => {
  for (const [groupe, minimum] of Object.entries(grid)) {
    it(`${groupe} minimum is ${minimum} euros`, async () => {
      const engine = await makeEngine();
      set(engine, groupe);
      assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, minimum);
    });
  }

  for (const groupe of ["0", "1", "12", "non renseigné"]) {
    it(`rejects out-of-grid group ${groupe}`, async () => {
      const engine = await makeEngine();
      set(engine, groupe);
      assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, null);
    });
  }
});

describe("IDCC 176 — part time", () => {
  it("prorates the monthly minimum once by contract fraction", async () => {
    const engine = await makeEngine();
    set(engine, "6C", "50%");
    assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, 1672.255);
  });
});
