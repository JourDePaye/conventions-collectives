# conventions-collectives

Versioned publicodes extensions to modele-social, consumed by JourDePaye.

- Use Node 24 and npm. Run `npm ci`, `npm test`, `npm run typecheck`, and `npm run build`.
- Write identifiers, code comments, and commit messages in English. Publicodes rule names and legal references stay in French.
- Sources live in `rules/<idcc>-<French-agreement-name>/<idcc>-<French-agreement-name>.<year>.<revision>.publicodes`.
- Each source has a metadata document (`validFrom`, `sources`) followed by a rules document.
- Released versions in `rules/versions.lock.json` are immutable and must never be removed. Add a new version for any rule correction.
- Preserve the historical hash algorithm: SHA-256 of `JSON.stringify({ validFrom, rules })`, truncated to 16 hex characters.
- Never redefine a modele-social rule: use `remplace` or `rend non applicable`. Keep agreement rules under their French namespace and guard them with `applicable si`.
- No dependency on payroll-core. Keep payroll period selection, CaseValue mapping, and payroll calculation in JourDePaye.
- Generated JSON and the version index live in `src/compiled/` and are not committed. Build before packing; consumers install the compiled package.
