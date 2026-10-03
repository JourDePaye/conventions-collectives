/** Runs the compilation script on temporary files. */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const SCRIPT = fileURLToPath(new URL("../scripts/compile-collective-agreements.ts", import.meta.url));

const METADATA = "validFrom: 2025-01-01\nsources:\n  - Test legal reference\n---\n";
const RULES = "salarié . convention collective . demo:\n  valeur: oui\n";

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "collective-agreements-"));
  mkdirSync(join(dir, "rules", "0001-demo"), { recursive: true });
});

afterEach(() => rmSync(dir, { recursive: true, force: true }));

const write = (file: string, content: string) =>
  writeFileSync(join(dir, "rules", "0001-demo", file), content);

const compile = () => spawnSync(process.execPath, [SCRIPT], { cwd: dir, encoding: "utf8" });

const lock = () =>
  JSON.parse(readFileSync(join(dir, "rules", "versions.lock.json"), "utf8"));

describe("compile-collective-agreements", () => {
  it("compiles each version and locks its content hash", () => {
    write("0001-demo.2025.1.publicodes", METADATA + RULES);
    const { status, stderr } = compile();
    assert.equal(status, 0, stderr);

    const compiled = join(dir, "src", "compiled");
    assert.deepEqual(JSON.parse(readFileSync(join(compiled, "0001-demo.2025.1.json"), "utf8")), {
      "salarié . convention collective . demo": { valeur: "oui" },
    });
    assert.match(readFileSync(join(compiled, "index.ts"), "utf8"), /version: "2025\.1"/);
    assert.match(lock()["0001-demo.2025.1"], /^[0-9a-f]{16}$/);
  });

  it("rejects a change to a released version", () => {
    write("0001-demo.2025.1.publicodes", METADATA + RULES);
    assert.equal(compile().status, 0);

    write("0001-demo.2025.1.publicodes", METADATA + RULES.replace("oui", "non"));
    const { status, stderr } = compile();
    assert.notEqual(status, 0);
    assert.match(stderr, /is released and must not change/);
  });

  it("accepts a new version next to released ones", () => {
    write("0001-demo.2025.1.publicodes", METADATA + RULES);
    assert.equal(compile().status, 0);
    write("0001-demo.2026.1.publicodes", METADATA.replace("2025-01-01", "2026-01-01") + RULES.replace("oui", "non"));
    assert.equal(compile().status, 0);
    assert.deepEqual(Object.keys(lock()), ["0001-demo.2025.1", "0001-demo.2026.1"]);
  });

  it("changes the hash when only the effective date changes", () => {
    write("0001-demo.2025.1.publicodes", METADATA + RULES);
    assert.equal(compile().status, 0);
    write("0001-demo.2025.1.publicodes", METADATA.replace("2025-01-01", "2025-02-01") + RULES);
    assert.notEqual(compile().status, 0);
  });

  it("rejects files without a version in their name", () => {
    write("0001-demo.publicodes", METADATA + RULES);
    assert.match(compile().stderr, /expected <idcc>-<agreement>\.<year>\.<revision>\.publicodes/);
  });

  it("requires an effective date", () => {
    write("0001-demo.2025.1.publicodes", "sources: []\n---\n" + RULES);
    assert.match(compile().stderr, /validFrom must be a YYYY-MM-DD date/);
  });

  it("requires a metadata document and a rules document", () => {
    write("0001-demo.2025.1.publicodes", RULES);
    assert.match(compile().stderr, /expected a metadata document and a rules document/);
  });

  it("rejects deleting a released version", () => {
    write("0001-demo.2025.1.publicodes", METADATA + RULES);
    assert.equal(compile().status, 0);
    unlinkSync(join(dir, "rules", "0001-demo", "0001-demo.2025.1.publicodes"));
    const { status, stderr } = compile();
    assert.notEqual(status, 0);
    assert.match(stderr, /Released version .* is missing/);
  });

  it("rejects a source in the wrong agreement directory", () => {
    write("0002-other.2025.1.publicodes", METADATA + RULES);
    assert.match(compile().stderr, /expected the rules\/0002-other\/ directory/);
  });

  it("requires legal sources and a real calendar date", () => {
    write("0001-demo.2025.1.publicodes", "validFrom: 2025-01-01\n---\n" + RULES);
    assert.match(compile().stderr, /sources must be a non-empty list/);
    write("0001-demo.2025.1.publicodes", METADATA.replace("2025-01-01", "2025-02-30") + RULES);
    assert.match(compile().stderr, /validFrom must be a YYYY-MM-DD date/);
  });

});
