/**
 * Compiles rules/<idcc>-<agreement>/<idcc>-<agreement>.<year>.<revision>.publicodes, and the
 * shared files rules/commun/<name>/<name>.<year>.<revision>.publicodes, whose metadata lists the
 * agreements (`agreements`) that publish the same version.
 * Rule hashes retain the original JourDePaye algorithm for historical payroll results.
 * The browser and server load compiled JSON without a YAML parser.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { parseAllDocuments } from "yaml";

const SOURCE_DIR = "rules";
const LOCK_FILE = join(SOURCE_DIR, "versions.lock.json");
const OUTPUT_DIR = join("src", "compiled");
const FILE_NAME = /^(\d{4}-[a-z][a-z0-9-]*)\.(\d{4}\.\d+)\.publicodes$/;
const SHARED_DIR = join(SOURCE_DIR, "commun");
const SHARED_FILE_NAME = /^([a-z][a-z0-9-]*)\.(\d{4}\.\d+)\.publicodes$/;
const AGREEMENT_NAME = /^\d{4}-[a-z][a-z0-9-]*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

type Version = {
  name: string;
  version: string;
  validFrom: string;
  extension?: string;
  contentHash: string;
  sources: string[];
};

const lock: Record<string, string> = existsSync(LOCK_FILE)
  ? JSON.parse(readFileSync(LOCK_FILE, "utf8"))
  : {};

rmSync(OUTPUT_DIR, { recursive: true, force: true });
mkdirSync(OUTPUT_DIR, { recursive: true });

const versions: Version[] = [];
for (const file of readdirSync(SOURCE_DIR, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".publicodes"))
  .map((entry) => join(entry.parentPath, entry.name))
  .sort()) {
  const shared = file.startsWith(`${SHARED_DIR}/`);
  const match = (shared ? SHARED_FILE_NAME : FILE_NAME).exec(basename(file));
  if (!match) {
    throw new Error(
      shared
        ? `${file}: expected <name>.<year>.<revision>.publicodes`
        : `${file}: expected <idcc>-<agreement>.<year>.<revision>.publicodes`,
    );
  }
  const [, fileName, version] = match as unknown as [string, string, string];

  const directory = shared ? join(SHARED_DIR, fileName) : join(SOURCE_DIR, fileName);
  if (dirname(file) !== directory) {
    throw new Error(`${file}: expected the ${directory}/ directory`);
  }
  const documents = parseAllDocuments(readFileSync(file, "utf8"));
  if (!Array.isArray(documents) || documents.length !== 2) {
    throw new Error(`${file}: expected a metadata document and a rules document`);
  }
  for (const document of documents) {
    if (document.errors.length > 0) throw new Error(`${file}: ${document.errors[0]!.message}`);
  }
  const [metadata, rules] = documents.map((d) => d.toJS()) as [unknown, unknown];
  const validFrom = (metadata as { validFrom?: unknown } | null)?.validFrom;
  if (typeof validFrom !== "string" || !ISO_DATE.test(validFrom) ||
      Number.isNaN(Date.parse(validFrom)) || new Date(validFrom).toISOString().slice(0, 10) !== validFrom) {
    throw new Error(`${file}: validFrom must be a YYYY-MM-DD date`);
  }
  // Date from which the version also binds the employers outside a signatory organisation (the
  // publication of its extension order; they are bound from the later of that date and validFrom).
  // Absent: the version binds only those employers.
  const extension = (metadata as { extension?: unknown } | null)?.extension;
  if (extension !== undefined && (typeof extension !== "string" || !ISO_DATE.test(extension) ||
      Number.isNaN(Date.parse(extension)) || new Date(extension).toISOString().slice(0, 10) !== extension)) {
    throw new Error(`${file}: extension must be a YYYY-MM-DD date`);
  }
  const sources = (metadata as { sources?: unknown } | null)?.sources;
  if (!Array.isArray(sources) || sources.length === 0 ||
      !sources.every((source) => typeof source === "string" && source.trim().length > 0)) {
    throw new Error(`${file}: sources must be a non-empty list of legal references`);
  }
  if (typeof rules !== "object" || rules === null || Array.isArray(rules)) {
    throw new Error(`${file}: expected a mapping of publicodes rules`);
  }
  // A shared file publishes the same version under each agreement it lists.
  const agreements = (metadata as { agreements?: unknown } | null)?.agreements;
  if (!shared && agreements !== undefined) {
    throw new Error(`${file}: only a shared file of ${SHARED_DIR}/ lists agreements`);
  }
  if (shared && (!Array.isArray(agreements) || agreements.length === 0 ||
      !agreements.every((a) => typeof a === "string" && AGREEMENT_NAME.test(a) && existsSync(join(SOURCE_DIR, a))))) {
    throw new Error(`${file}: agreements must list the <idcc>-<agreement> directories of rules/ that publish it`);
  }
  const names = shared ? (agreements as string[]) : [fileName];

  const contentHash = createHash("sha256")
    .update(JSON.stringify({ validFrom, rules }))
    .digest("hex")
    .slice(0, 16);
  for (const name of names) {
    const key = `${name}.${version}`;
    if (versions.some((v) => v.name === name && v.version === version)) {
      throw new Error(`${file}: version ${key} is already defined by another file`);
    }
    if (lock[key] === undefined) {
      lock[key] = contentHash;
      console.log(`Locked new version ${key}`);
    } else if (lock[key] !== contentHash) {
      throw new Error(
        `${file}: version ${key} is released and must not change ` +
          `(hash ${lock[key]}, now ${contentHash}). Create a new version instead.`,
      );
    }

    writeFileSync(join(OUTPUT_DIR, `${key}.json`), `${JSON.stringify(rules, null, 2)}\n`);
    versions.push({ name, version, validFrom, ...(extension !== undefined && { extension }), contentHash, sources });
  }
  console.log(`Compiled ${file} (${Object.keys(rules).length} rules${shared ? `, for ${names.join(", ")}` : ""})`);
}

const present = new Set(versions.map((v) => `${v.name}.${v.version}`));
for (const key of Object.keys(lock)) {
  if (!present.has(key)) throw new Error(`Released version ${key} is missing. Restore its source file.`);
}

const byAgreement = new Map<string, Version[]>();
for (const v of versions) byAgreement.set(v.name, [...(byAgreement.get(v.name) ?? []), v]);
for (const list of byAgreement.values()) {
  list.sort((a, b) => a.validFrom.localeCompare(b.validFrom) || compareVersions(a, b));
}

const entries = [...byAgreement].map(
  ([name, list]) =>
    `  ${JSON.stringify(name)}: [\n${list
      .map(
        (v) =>
          `    {\n      version: ${JSON.stringify(v.version)},\n` +
          `      validFrom: ${JSON.stringify(v.validFrom)},\n` +
          (v.extension === undefined ? "" : `      extension: ${JSON.stringify(v.extension)},\n`) +
          `      contentHash: ${JSON.stringify(v.contentHash)},\n` +
          `      sources: ${JSON.stringify(v.sources)},\n` +
          `      loadRules: async () =>\n` +
          `        (await import("./${v.name}.${v.version}.json", { with: { type: "json" } }))\n` +
          `          .default as Record<string, Rule>,\n    },`,
      )
      .join("\n")}\n  ],`,
);
writeFileSync(
  join(OUTPUT_DIR, "index.ts"),
  `// Generated by scripts/compile-collective-agreements.ts. Do not edit.
import type { Rule } from "publicodes";
import type { CollectiveAgreementVersion } from "../index.ts";

/** Compiled versions of each collective agreement, sorted by effective date. */
export const COMPILED_VERSIONS: Record<string, readonly CollectiveAgreementVersion[]> = {
${entries.join("\n")}
};
`,
);
writeFileSync(LOCK_FILE, `${JSON.stringify(sortKeys(lock), null, 2)}\n`);

function compareVersions(a: Version, b: Version): number {
  const [yearA, revisionA] = a.version.split(".").map(Number) as [number, number];
  const [yearB, revisionB] = b.version.split(".").map(Number) as [number, number];
  return yearA - yearB || revisionA - revisionB;
}

function sortKeys(record: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)));
}
