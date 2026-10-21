import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { COMPILED_VERSIONS } from "../src/index.ts";

// Date from which each version also binds the employers outside a signatory organisation: the
// publication in the Journal officiel of its extension order (effect from publication, unless
// the note says otherwise). A version that is not listed has no extension order: it binds only
// the employers of a signatory organisation.
const EXTENSIONS: Record<string, Record<string, string>> = {
  "0018-industries-textiles": {
    // accord du 15 janvier 2026, JORFTEXT000053907664 (the accord of the artificial textiles
    // sector, JORF du 19 mars 2026, is extended earlier)
    "2026.2": "2026-04-17",
    "2026.3": "2026-09-04", // accord du 17 juin 2026, JORFTEXT000054794573
  },
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
  // avenant n° 31, arrêté du 4 mai 2026, JORFTEXT000054048652 (JORF du 8 mai 2026); article 3: first day
  // of the following month
  "0493-vins-cidres-spiritueux": { "2026.2": "2026-06-01" },
  // Arrêtés of 11 December 2023 (JORF 14 December 2023) and 5 February 2026 (JORF 10 February 2026).
  "0787-experts-comptables": { "2024.1": "2023-12-14", "2026.2": "2026-02-10" },
  "1405-expedition-exportation-fruits-legumes": { "2026.2": "2026-05-29" }, // JORFTEXT000054149405
  // accord du 13 mars 2025, arrêté du 27 mai 2025, JORF du 31 mai 2025; the accord of 3 April 2026 (2026.1) is not extended
  "1408-distribution-logistique-energies": { "2025.3": "2025-05-31" },
  "1555-produits-pharmaceutiques": { "2026.1": "2026-05-08" }, // JORF du 8 mai 2026
  // avenant du 21 juillet 2025, arrêté du 17 février 2026, JORF du 24 février 2026
  "3090-spectacle-vivant-prive": { "2025.4": "2026-02-24" },
  // The shared building version: each regional grid applies from the publication of its own
  // extension order (in its rules), and it has no grid of the cadres, whose accord of 2026 is not
  // extended.
  "1596-batiment-ouvriers-petites-entreprises": { "2026.4": "2020-01-01", "2026.5": "2020-01-01", "2026.6": "2020-01-01" },
  "1597-batiment-ouvriers-plus-de-10": { "2026.4": "2020-01-01", "2026.5": "2020-01-01", "2026.6": "2020-01-01" },
  "2420-batiment-cadres": { "2026.4": "2020-01-01", "2026.5": "2020-01-01", "2026.6": "2020-01-01" },
  "2609-batiment-etam": { "2026.4": "2020-01-01", "2026.5": "2020-01-01", "2026.6": "2020-01-01" },
  // 2332: every territorial accord applies from the month after the publication of its own
  // extension order, in its rules.
  "2332-entreprises-architecture": { "2026.2": "2026-01-01" },
  // 3241: the accord of 15 December 2023, extended in 2024, then the accord of 11 May 2026, from
  // 1 June 2026 for a member and from its extension order (JORF of 24 July 2026) for the others.
  "3241-telediffusion": { "2026.3": "2026-01-01", "2026.4": "2026-07-24" },
  // 3213: the version starts in 2026 and the grid applies from the effective date of its
  // extended accord (11 July 2026), in its rules.
  "3213-economistes-construction": { "2026.2": "2026-01-01" },
  // The shared public works version: each regional grid applies from the publication of its own
  // extension order (in its rules).
  "1702-travaux-publics-ouvriers": { "2026.4": "2026-01-01", "2026.5": "2026-01-01" },
  "2614-travaux-publics-etam": { "2026.4": "2026-01-01", "2026.5": "2026-01-01" },
  "3212-travaux-publics-cadres": { "2026.4": "2026-01-01", "2026.5": "2026-01-01" },
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
  // accords du 2 et du 30 juin 2023, arrêté du 22 septembre 2025, JORFTEXT000052353580 (JORF du
  // 4 octobre 2025); articles 8 and 9: first day of the following month
  "3242-presse-regions": { "2023.3": "2025-11-01", "2023.4": "2025-11-01", "2023.5": "2025-11-01" },
};

// Agreements whose latest accord is in force but not extended (as of October 2026).
const NOT_EXTENDED = [
  "0478-societes-financieres",
  "1672-societes-assurances",
  "2205-notariat",
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
