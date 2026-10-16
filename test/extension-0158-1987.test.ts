import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

// Extension of two accords to non-member employers, from the arrêtés (effect: date of publication).
const AGREEMENTS = [
  {
    model: "0158-industries-bois",
    version: "2026.2",
    value: "industries du bois",
    input: { name: "classification", value: "'ACT 6.1'" },
    rule: "salaire minimum conventionnel",
    expected: 2448,
    extension: [2026, 7, 11],
    adherentFrom: [2026, 4, 1],
  },
  {
    model: "1987-pates-alimentaires-seches",
    version: "2026.3",
    value: "pâtes alimentaires sèches et couscous non préparé",
    input: { name: "coefficient", value: 135 },
    rule: "salaire minimum horaire",
    expected: 12.08,
    extension: [2026, 5, 29],
    adherentFrom: [2026, 1, 1],
  },
] as const;

const date = ([y, m, d]: readonly [number, number, number]) => `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
const dayBefore = ([y, m, d]: readonly [number, number, number]) => date([y, m, d - 1]);

async function minimum(a: (typeof AGREEMENTS)[number], legalField: string, calculationDate: string) {
  const found = COMPILED_VERSIONS[a.model]?.find((entry) => entry.version === a.version);
  assert.ok(found, a.model);
  const extension = await found.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...new Set([...choice["une possibilité"], a.value])] } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  const ns = `salarié . convention collective . ${a.value}`;
  engine.setSituation({
    "salarié . convention collective": `'${a.value}'`,
    "salarié . contrat . statut cadre": "non",
    [`${ns} . ${a.input.name}`]: a.input.value,
    [`${ns} . champ juridique`]: `'${legalField}'`,
    [`${ns} . date de calcul`]: calculationDate,
  });
  const result = engine.evaluate(`${ns} . ${a.rule}`).nodeValue;
  return typeof result === "number" ? Math.round(result * 100) / 100 : result;
}

for (const a of AGREEMENTS) {
  describe(`${a.model}.${a.version}: extension to non-member employers`, () => {
    it("applies to a member employer from the effective date", async () => {
      assert.equal(await minimum(a, "employeur signataire ou adhérent", date(a.adherentFrom)), a.expected);
    });
    it("does not apply to another employer the day before the extension is published", async () => {
      assert.equal(await minimum(a, "autre employeur", dayBefore(a.extension)) ?? null, null);
    });
    it("applies to another employer from the day the extension is published", async () => {
      assert.equal(await minimum(a, "autre employeur", date(a.extension)), a.expected);
    });
  });
}
