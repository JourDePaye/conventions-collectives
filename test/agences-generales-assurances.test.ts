import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "2335-agences-generales-assurances";
const ns = "salarié . convention collective . agences générales assurances";

async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find((v) => v.version === "2026.1");
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
    [`${ns} . date de calcul`]: "11/10/2026",
    [`${ns} . champ juridique`]: "'tous employeurs après extension'",
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

describe("IDCC 2335 — legal scope and effective date", () => {
  for (const [date, scope, expected] of [
    ["31/12/2025", "employeur signataire ou adhérent", null],
    ["01/01/2026", "employeur signataire ou adhérent", 23194],
    ["18/03/2026", "tous employeurs après extension", null],
    ["19/03/2026", "tous employeurs après extension", 23194],
    ["11/10/2026", "non renseigné", null],
  ] as const) {
    it(`${date} with ${scope} has expected availability`, async () => {
      const engine = await makeEngine();
      set(engine, { classe: "'1'", "date de calcul": date, "champ juridique": `'${scope}'` });
      assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, expected);
    });
  }
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
