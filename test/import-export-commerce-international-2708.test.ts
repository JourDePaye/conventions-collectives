import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2708-import-export-commerce-international";
const value = "import-export et commerce international";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2017.1");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

describe("IDCC 2708 — 2017.1 audit paie", () => {
  it("references the official convention container", () => {
    assert.equal(version.validFrom, "2017-01-01");
    assert.ok(version.sources.some((source) => source.includes("KALICONT000005635612")));
  });

  it("exposes the explicit payroll audit and isolates modele-social", () => {
    engine.setSituation({ "salarié . convention collective": `'${value}'` });
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
    assert.equal(Object.keys(extension).some((name) => name in modeleSocial), false);
    assert.equal(Object.keys(extension).some((name) => /cotisations|prévoyance|santé|formation professionnelle|retraite|AT/.test(name)), false);
  });

  it("is inapplicable for another collective agreement", () => {
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, null);
  });
});
