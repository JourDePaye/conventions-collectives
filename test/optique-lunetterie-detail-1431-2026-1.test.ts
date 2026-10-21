import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "1431-optique-lunetterie-detail";
const ns = "salarié . convention collective . optique-lunetterie de détail";

async function makeEngine(revision = "2026.1") {
  const version = COMPILED_VERSIONS[id]?.find((candidate) => candidate.version === revision);
  assert.ok(version, `IDCC 1431 ${revision} must be exported`);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "optique-lunetterie de détail"] } as Rule;
  Object.assign(rules, await version.loadRules());
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

const situation = (extra: Record<string, string> = {}) => ({
  salarié: "oui",
  dirigeant: "non",
  "salarié . convention collective": "'optique-lunetterie de détail'",
  "salarié . contrat . salaire brut": "2500 €/mois",
  [`${ns} . coefficient`]: "'K'",
  ...extra,
});

const round = (value: unknown) => Math.round((value as number) * 100) / 100;

describe("IDCC 1431 — 2026.1", () => {
  it("applies from 1 March 2026, extended on 11 July 2026", () => {
    const version = COMPILED_VERSIONS[id]?.find((candidate) => candidate.version === "2026.1");
    assert.equal(version?.validFrom, "2026-03-01");
    assert.equal(version?.extension, "2026-07-11");
    assert.ok(version?.sources.some((source) => source.includes("KALITEXT000054303823")));
  });

  it("keeps the grid of 2024.4", async () => {
    const engine = await makeEngine();
    engine.setSituation(situation());
    assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, 3700);
  });

  it("adds 0.08 % of the gross salary to the employer contributions (avenant du 25 février 2026)", async () => {
    const employer = async (revision: string, gross: number) => {
      const engine = await makeEngine(revision);
      engine.setSituation(situation({ "salarié . contrat . salaire brut": `${gross} €/mois` }));
      return engine.evaluate("salarié . cotisations . employeur").nodeValue as number;
    };
    for (const gross of [2500, 6000]) {
      assert.equal(round((await employer("2026.1", gross)) - (await employer("2024.4", gross))), round(gross * 0.0008), String(gross));
    }
  });

  it("is inactive outside the selected convention", async () => {
    const engine = await makeEngine();
    engine.setSituation(situation({ "salarié . convention collective": "'droit commun'" }));
    assert.equal(engine.evaluate(`${ns} . financement du paritarisme`).nodeValue, null);
  });
});
