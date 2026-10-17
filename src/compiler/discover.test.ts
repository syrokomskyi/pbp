/*
<MODULE_CONTRACT>
<purpose>
Unit tests for discover covering discover. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the discover suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { discover } from "./discover.ts";
import type { PbpCompilerInput } from "./types.ts";

let testDir: string;

beforeEach(() => {
  testDir = join(
    tmpdir(),
    `pbp-discover-test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  mkdirSync(testDir, { recursive: true });
});

afterEach(() => {
  rmSync(testDir, { recursive: true, force: true });
});

function writeMd(locale: string, filename: string, frontmatter: Record<string, unknown>): void {
  const dir = join(testDir, locale);
  mkdirSync(dir, { recursive: true });
  const yaml = Object.entries(frontmatter)
    .map(([k, v]) => `${k}: ${typeof v === "string" ? JSON.stringify(v) : v}`)
    .join("\n");
  writeFileSync(join(dir, filename), `---\n${yaml}\n---\nBody text\n`);
}

describe("discover", () => {
  it("discovers .md files and extracts entity ID, schema, and locale", async () => {
    writeMd("de", "business.md", { id: "biz-1", schema: "business" });
    writeMd("uk", "business.md", { id: "biz-1", schema: "business" });

    const input: PbpCompilerInput = {
      sourceDirectory: testDir,
      locale: "uk",
      defaultLocale: "de",
      strictness: "production",
    };

    const report = await discover(input);

    expect(report.recordsDiscovered).toBe(2);
    expect(report.sources).toHaveLength(2);
    expect(report.sources[0]?.entityId).toBe("biz-1");
    expect(report.sources[0]?.schema).toBe("business");
    expect(report.sources.some((s) => s.locale === "de")).toBe(true);
    expect(report.sources.some((s) => s.locale === "uk")).toBe(true);
  });

  it("counts records by schema", async () => {
    writeMd("de", "business.md", { id: "biz-1", schema: "business" });
    writeMd("de", "offering.md", { id: "off-1", schema: "offering" });
    writeMd("de", "offering2.md", { id: "off-2", schema: "offering" });

    const report = await discover({
      sourceDirectory: testDir,
      locale: "de",
      defaultLocale: "de",
      strictness: "production",
    });

    expect(report.recordsBySchema["business"]).toBe(1);
    expect(report.recordsBySchema["offering"]).toBe(2);
  });

  it("skips directories starting with old- or dash", async () => {
    writeMd("de", "business.md", { id: "biz-1", schema: "business" });
    const oldDir = join(testDir, "old-de");
    mkdirSync(oldDir, { recursive: true });
    writeFileSync(join(oldDir, "old.md"), "---\nid: old\nschema: business\n---\n");

    const report = await discover({
      sourceDirectory: testDir,
      locale: "de",
      defaultLocale: "de",
      strictness: "production",
    });

    expect(report.recordsDiscovered).toBe(1);
  });

  it("returns empty report for non-existent directory", async () => {
    const report = await discover({
      sourceDirectory: join(testDir, "nonexistent"),
      locale: "de",
      defaultLocale: "de",
      strictness: "production",
    });

    expect(report.recordsDiscovered).toBe(0);
    expect(report.sources).toHaveLength(0);
  });

  it("sorts sources by entityId", async () => {
    writeMd("de", "c.md", { id: "ccc", schema: "business" });
    writeMd("de", "a.md", { id: "aaa", schema: "business" });
    writeMd("de", "b.md", { id: "bbb", schema: "business" });

    const report = await discover({
      sourceDirectory: testDir,
      locale: "de",
      defaultLocale: "de",
      strictness: "production",
    });

    expect(report.sources.map((s) => s.entityId)).toEqual(["aaa", "bbb", "ccc"]);
  });
});
