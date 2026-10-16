import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "0176-industrie-pharmaceutique";
const ns = "salarié . convention collective . industrie pharmaceutique";

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((v) => v.version === "2026.2");
  assert.ok(version, "IDCC 176 must be exported");
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "industrie pharmaceutique"] } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

function set(engine: Engine, groupe: string, quotité = "100%", ancienneté?: number) {
  engine.setSituation({
    "salarié": "oui",
    "dirigeant": "non",
    "salarié . convention collective": "'industrie pharmaceutique'",
    [`${ns} . groupe`]: `'${groupe}'`,
    ["salarié . contrat . temps de travail . quotité"]: quotité,
    ...(ancienneté === undefined ? {} : { [`${ns} . ancienneté en mois`]: `${ancienneté} mois` }),
  });
}

const article1 = {
  "1A": 1837.34, "1B": 1837.34, "1C": 1856.06, "2A": 1856.06, "2B": 1893.51,
  "2C": 1977.76, "3A": 1977.76, "3B": 2024.57, "3C": 2193.07, "4A": 2193.07,
  "4B": 2267.96, "4C": 2483.27, "5A": 2483.27, "5B": 2586.24, "5C": 2867.08,
  "6A": 2867.08, "6B": 2998.14, "6C": 3344.51, "7A": 3475.57, "7B": 4065.33,
  "8A": 4196.39, "8B": 4898.49, "9A": 5029.55, "9B": 5862.70, "10": 6386.93, "11": 6911.17,
} as const;
// Article 3, from 18 months of seniority: only groups 1A to 2B differ.
const article3 = { ...article1, "1A": 1844.57, "1B": 1844.57, "1C": 1863.36, "2A": 1863.36, "2B": 1900.95 } as const;

const minimum = (engine: Engine) => engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue;

describe("IDCC 176 — 2026.2 selection", () => {
  it("is the highest revision for validFrom 2026-01-01", () => {
    const versions = (COMPILED_VERSIONS[id] ?? []).filter((v) => v.validFrom === "2026-01-01");
    assert.deepEqual(versions.map((v) => v.version).sort(), ["2026.1", "2026.2"]);
  });
});

describe("IDCC 176 — article 1 grid (seniority unknown or under 18 months)", () => {
  for (const [groupe, expected] of Object.entries(article1)) {
    it(`${groupe}: ${expected}`, async () => {
      const engine = await makeEngine();
      set(engine, groupe);
      assert.equal(minimum(engine), expected);
      set(engine, groupe, "100%", 17);
      assert.equal(minimum(engine), expected);
    });
  }
});

describe("IDCC 176 — article 3 grid (at least 18 months of seniority)", () => {
  for (const [groupe, expected] of Object.entries(article3)) {
    it(`${groupe}: ${expected}`, async () => {
      const engine = await makeEngine();
      set(engine, groupe, "100%", 18);
      assert.equal(minimum(engine), expected);
      set(engine, groupe, "100%", 60);
      assert.equal(minimum(engine), expected);
    });
  }

  it("rejects out-of-grid groups whatever the seniority", async () => {
    const engine = await makeEngine();
    for (const groupe of ["0", "1", "12", "non renseigné"]) {
      set(engine, groupe, "100%", 24);
      assert.equal(minimum(engine), null, groupe);
      set(engine, groupe);
      assert.equal(minimum(engine), null, groupe);
    }
  });

  it("prorates the article 3 minimum once for part-time work", async () => {
    const engine = await makeEngine();
    set(engine, "1C", "50%", 18);
    assert.equal(minimum(engine), 931.68);
    set(engine, "6C", "50%", 18);
    assert.equal(minimum(engine), 1672.255);
  });
});
