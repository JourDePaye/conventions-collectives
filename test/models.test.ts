import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const models = [
  { name: "2941-aide-soins-domicile", value: "aide et soins à domicile", classification: "niveau", input: "'TAM.1.1'", minimums: { "2026.1": 2157.98 } },
  { name: "1486-syntec", value: "syntec", classification: "coefficient", input: 355, minimums: { "2025.1": 2045 } },
  { name: "1979-hotels-cafes-restaurants", value: "HCR", classification: "niveau", input: "'II.3'", minimums: { "2024.1": 1997.45 } },
  { name: "1996-pharmacie-officine", value: "pharmacie", classification: "coefficient", input: 470, minimums: { "2025.1": 3717.51, "2026.1": 3762.42 } },
  { name: "2216-commerce-detail-gros-predominance-alimentaire", value: "commerce alimentaire", classification: "niveau", input: "'4B'", minimums: { "2025.1": 2032.03, "2026.1": 2054.33 } },
] as const;

const lock = JSON.parse(readFileSync(new URL("../rules/versions.lock.json", import.meta.url), "utf8")) as Record<string, string>;

describe("compiled collective agreement models", () => {
  it("exports all released versions with their original hashes and legal references", async () => {
    const keys: string[] = [];
    for (const [name, versions] of Object.entries(COMPILED_VERSIONS)) {
      for (const version of versions) {
        const key = `${name}.${version.version}`;
        keys.push(key);
        const hash = createHash("sha256")
          .update(JSON.stringify({ validFrom: version.validFrom, rules: await version.loadRules() }))
          .digest("hex").slice(0, 16);
        assert.equal(hash, lock[key], key);
        assert.equal(version.contentHash, lock[key], key);
        assert.ok(version.sources.length > 0, key);
      }
    }
    assert.deepEqual(keys.sort(), Object.keys(lock).sort());
  });

  for (const model of models) {
    for (const [versionNumber, minimum] of Object.entries(model.minimums)) {
      it(`${model.name} ${versionNumber} evaluates the sourced minimum with modele-social`, async () => {
        const version = COMPILED_VERSIONS[model.name]?.find((v) => v.version === versionNumber);
        assert.ok(version);
        const extension = await version.loadRules();
        const rules: Record<string, Rule> = { ...modeleSocial };
        const namespace = `salarié . convention collective . ${model.value}`;
        for (const name of Object.keys(extension)) {
          assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
          assert.ok(!(name in rules), `Duplicate modele-social rule: ${name}`);
        }
        const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
        rules["salarié . convention collective"] = {
          ...choice,
          "une possibilité": [...new Set([...choice["une possibilité"], model.value])],
        } as Rule;
        Object.assign(rules, extension);
        const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
        engine.setSituation({
          "salarié . convention collective": `'${model.value}'`,
          [`${namespace} . ${model.classification}`]: model.input,
          "salarié . contrat . statut cadre": "non",
        });
        const amount = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
        assert.equal(typeof amount, "number");
        assert.equal(Math.round((amount as number) * 100) / 100, minimum);
      });
    }
  }
});
