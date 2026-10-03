# @jourdepaye/conventions-collectives

Versioned French collective agreement rules written in publicodes, extending `modele-social`.

## Sources

| Agreement | IDCC | Directory |
|---|---|---|
| Syntec | 1486 | `rules/1486-syntec/` |
| Hotels, cafés, restaurants | 1979 | `rules/1979-hotels-cafes-restaurants/` |
| Pharmacy | 1996 | `rules/1996-pharmacie-officine/` |
| Food retail and wholesale | 2216 | `rules/2216-commerce-detail-gros-predominance-alimentaire/` |

Files follow `<idcc>-<agreement>.<year>.<revision>.publicodes`. Each contains two YAML documents: metadata (`validFrom`, `sources`), then publicodes rules. The original six JourDePaye versions were transferred byte-for-byte; only file paths and lock keys changed, preserving their content hashes.

Released versions are locked in `rules/versions.lock.json`. Never edit or delete their rules or effective date: add a new revision instead. New versions are locked on their first compilation; remove only an unpublished version's lock entry while developing it. Compilation checks that every locked version still exists. Source references are exported but are not included in the historical calculation hash.

## Usage

```ts
import { COMPILED_VERSIONS } from "@jourdepaye/conventions-collectives";

const version = COMPILED_VERSIONS["1486-syntec"]?.find((v) => v.version === "2025.1");
if (!version) throw new Error("Unknown version");
const rules = await version.loadRules();
```

The package exports effective dates, version numbers, content hashes, legal references and asynchronous rule loaders. It ships ESM JavaScript, TypeScript declarations, JSON rules and YAML sources. It does not load modele-social or instantiate an engine. Consumers must add new agreement values to modele-social's choices and reject duplicate rule definitions when merging models.

Compatibility is initially tested with `modele-social@11.1.0` and `publicodes@1.10.3`. These rules depend on modele-social contract and employee-status rules and are not standalone payroll models. Period selection, classification-to-CaseValue mapping, salary validation and payroll totals remain in JourDePaye.

## Development

Requires Node 24 or newer.

```sh
npm ci
npm test
npm run typecheck
npm run build
npm pack
```

The compiler generates `src/compiled/`; TypeScript produces `dist/`. Git installations build through `prepare`; npm tarballs are built through `prepack`. No YAML parser runs in the consuming browser or server.

The repository CI validates compilation, model compatibility, type checking and tarball contents. Publication to the npm registry is a separate operation; the package is initially consumed from a pinned Git commit.
