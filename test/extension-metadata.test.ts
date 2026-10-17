import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { COMPILED_VERSIONS } from "../src/index.ts";

// Date from which each version also binds the employers outside a signatory organisation: the
// publication in the Journal officiel of its extension order (effect from publication, unless
// the note says otherwise). A version that is not listed has no extension order: it binds only
// the employers of a signatory organisation.
const EXTENSIONS: Record<string, Record<string, string>> = {
  "0158-industries-bois": {
    "2025.1": "2025-05-02", // avenant n° 6, arrêté du 25 avril 2025, JORFTEXT000051540518
    "2026.2": "2026-07-11", // avenant n° 7, arrêté du 7 juillet 2026, JORFTEXT000054415943
  },
  "0275-transport-aerien-personnel-sol": {
    // arrêté du 2 juin 2025, JORF du 27 juin 2025; article 7: a clear day after the publication
    "2025.2": "2025-06-29",
    "2025.3": "2025-06-29",
    "2025.4": "2025-06-29",
  },
  "1555-produits-pharmaceutiques": { "2026.1": "2026-05-08" }, // JORF du 8 mai 2026
  "1671-maisons-etudiants": {
    "2025.1": "2025-04-09", // avenant n° 73, JORF du 9 avril 2025
    "2026.2": "2026-07-11", // avenants n° 74 and 75, JORF du 11 juillet 2026
    "2026.3": "2026-10-03", // avenant n° 76, JORF du 3 octobre 2026
  },
  "1987-pates-alimentaires-seches": {
    "2024.3": "2024-06-01", // arrêté du 21 mai 2024, JORFTEXT000049630689
    "2026.3": "2026-05-29", // arrêté du 20 mai 2026, JORFTEXT000054149468
  },
  "2335-agences-generales-assurances": {
    "2025.1": "2025-05-10", // avenant n° 5, JORFTEXT000051576272
    "2026.1": "2026-03-19", // avenant n° 6, JORF du 19 mars 2026
    "2026.2": "2026-09-19", // avenant n° 7, JORFTEXT000054860951
  },
  "2728-sucreries": { "2026.2": "2026-06-27" },
  "3221-agences-presse": { "2026.2": "2026-09-04" },
};

// Agreements whose latest accord is in force but not extended (as of October 2026).
const NOT_EXTENDED = [
  "0478-societes-financieres",
  "1672-societes-assurances",
  "2205-notariat",
  "2420-batiment-cadres",
  "2931-activites-marches-financiers",
  "3203-structures-associatives-peche",
];

describe("extension of the accords to the employers outside a signatory organisation", () => {
  for (const [model, versions] of Object.entries(EXTENSIONS)) {
    for (const [version, extension] of Object.entries(versions)) {
      it(`${model}.${version} binds non-members from ${extension}`, () => {
        const found = COMPILED_VERSIONS[model]?.find((entry) => entry.version === version);
        assert.ok(found, `${model}.${version}`);
        assert.equal(found.extension, extension);
      });
    }
  }

  for (const model of NOT_EXTENDED) {
    it(`${model} has no extension order`, () => {
      const versions = COMPILED_VERSIONS[model];
      assert.ok(versions && versions.length > 0, model);
      for (const version of versions) assert.equal(version.extension, undefined, version.version);
    });
  }

  it("only the versions above declare an extension", () => {
    const declared = Object.entries(COMPILED_VERSIONS).flatMap(([model, versions]) =>
      versions.filter((v) => v.extension !== undefined).map((v) => `${model}.${v.version}`),
    );
    const expected = Object.entries(EXTENSIONS).flatMap(([model, versions]) =>
      Object.keys(versions).map((version) => `${model}.${version}`),
    );
    assert.deepEqual(declared.sort(), expected.sort());
  });
});
