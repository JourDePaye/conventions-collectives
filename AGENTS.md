# conventions-collectives

Versioned publicodes extensions to modele-social, consumed by JourDePaye.

- Use Node 24 and npm. Run `npm ci`, `npm test`, `npm run typecheck`, and `npm run build`.
- Write identifiers, code comments, and commit messages in English. Publicodes rule names and legal references stay in French.
- Sources live in `rules/<idcc>-<French-agreement-name>/<idcc>-<French-agreement-name>.<year>.<revision>.publicodes`.
- Each source has a metadata document (`validFrom`, `sources`, and `extension` when the version's accord has an extension order: the date of its publication, from which the version also binds the employers outside a signatory organisation) followed by a rules document. A version without `extension` binds only the employers of a signatory organisation; the rules have no membership input, JourDePaye chooses the version (`selectVersionForEmployer`).
- Released versions in `rules/versions.lock.json` are immutable and must never be removed. Add a new version for any rule correction. Exception while JDP is in beta (see the workspace `AGENTS.md`): with the user's explicit go, published revisions may be renamed or rewritten in place, and their lock entries regenerated.
- Preserve the historical hash algorithm: SHA-256 of `JSON.stringify({ validFrom, rules })`, truncated to 16 hex characters.
- Never redefine a modele-social rule: use `remplace` or `rend non applicable`. Keep agreement rules under their French namespace and guard them with `applicable si`.
- No dependency on payroll-core. Keep payroll period selection, CaseValue mapping, and payroll calculation in JourDePaye.
- Generated JSON and the version index live in `src/compiled/` and are not committed. Build before packing; consumers install the compiled package.
- A Git tag `v*` publishes the package to npm (`.github/workflows/publish.yml`). While in beta, tag `vYYYY.MM.N-beta`: `YYYY.MM` is the year and month of the release date (a tag of 19 October 2026 is `v2026.10.N-beta`), `N` the next increment within that month. The workflow publishes `-beta` versions under the npm dist-tag `latest`, any other prerelease under `next`. Drop the suffix once out of beta.
