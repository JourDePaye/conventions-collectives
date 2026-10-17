import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "2335-agences-generales-assurances";
const ns = "salarié . convention collective . agences générales assurances";

async function makeEngine(revision = "2026.1") {
  const version = COMPILED_VERSIONS[id]?.find((v) => v.version === revision);
  assert.ok(version, "IDCC 2335 must be exported");
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "agences générales assurances"] } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

function set(engine: Engine, inputs: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié": "oui",
    "dirigeant": "non",
    "salarié . convention collective": "'agences générales assurances'",
    [`${ns} . classe`]: "'1'",
    ...Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key.includes(" . ") ? key : `${ns} . ${key}`, value])),
  });
}

const get = (engine: Engine, rule: string) => engine.evaluate(`${ns} . ${rule}`);

const annual = {
  "1": 23194,
  "2": 24085,
  "3": 26079,
  "4": 29132,
  "5": 34029,
  "5 bis": 39206,
  "6": 44383,
} as const;

describe("IDCC 2335 — 2026 annual minimum salaries", () => {
  for (const [classe, amount] of Object.entries(annual)) {
    it(`class ${classe} annual minimum is ${amount} euros`, async () => {
      const engine = await makeEngine();
      set(engine, { classe: `'${classe}'` });
      assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, amount);
    });
  }

  it("rejects a class outside the sourced grid", async () => {
    const engine = await makeEngine();
    set(engine, { classe: "'7'" });
    assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, null);
  });
});

describe("IDCC 2335 — annual endpoint", () => {
  it("keeps the sourced minimum in euros per year without inventing a monthly conversion", async () => {
    const engine = await makeEngine();
    set(engine, { classe: "'6'" });
    const result = get(engine, "salaire minimum annuel conventionnel");
    assert.equal(result.nodeValue, 44383);
    assert.equal(result.unit?.denominators?.includes("an"), true);
  });
});

// Avenant n° 5 du 17 décembre 2024 (KALITEXT000051694318): + 2 % on the whole grid from 1 January
// 2025, extended by the order of 5 May 2025 (JORF of 10 May 2025).
describe("IDCC 2335 — 2025.1 (avenant n° 5)", () => {
  const grid2025 = {
    "1": 22784,
    "2": 23659,
    "3": 25618,
    "4": 28617,
    "5": 33427,
    "5 bis": 38513,
    "6": 43598,
  };
  for (const [classe, amount] of Object.entries(grid2025)) {
    it(`class ${classe} annual minimum is ${amount} euros`, async () => {
      const engine = await makeEngine("2025.1");
      set(engine, { classe: `'${classe}'` });
      assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, amount);
    });
  }

  it("rejects a class outside the sourced grid", async () => {
    const engine = await makeEngine("2025.1");
    set(engine, { classe: "'7'" });
    assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, null);
  });

  it("applies from 1 January 2025, to every employer from the extension on 10 May 2025", () => {
    const version = COMPILED_VERSIONS[id]?.find((v) => v.version === "2025.1");
    assert.equal(version?.validFrom, "2025-01-01");
    assert.equal(version?.extension, "2025-05-10");
  });
});

// Avenant n° 7 du 27 mai 2026: class 1 raised by 1.4 % from 1 June 2026, the other classes unchanged.
describe("IDCC 2335 — 2026.2 (avenant n° 7)", () => {
  const june = { ...annual, "1": 23524 };
  for (const [classe, amount] of Object.entries(june)) {
    it(`class ${classe} annual minimum is ${amount} euros`, async () => {
      const engine = await makeEngine("2026.2");
      set(engine, { classe: `'${classe}'` });
      assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, amount);
    });
  }

  it("applies from 1 June 2026, to every employer from the extension on 19 September 2026", () => {
    const version = COMPILED_VERSIONS[id]?.find((v) => v.version === "2026.2");
    assert.equal(version?.validFrom, "2026-06-01");
    assert.equal(version?.extension, "2026-09-19");
  });
});
