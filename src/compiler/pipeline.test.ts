import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { compilePbpProfile } from "./pipeline.js";
import type { PbpCompilerInput } from "./types.js";

let testDir: string;

beforeEach(() => {
  testDir = join(
    tmpdir(),
    `pbp-pipeline-test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  mkdirSync(testDir, { recursive: true });
});

afterEach(() => {
  rmSync(testDir, { recursive: true, force: true });
});

function writeEntity(locale: string, filename: string, data: Record<string, unknown>): void {
  const dir = join(testDir, locale);
  mkdirSync(dir, { recursive: true });
  const yaml = Object.entries(data)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join("\n");
  writeFileSync(join(dir, filename), `---\n${yaml}\n---\n`);
}

describe("compilePbpProfile", () => {
  it("runs the full 14-phase pipeline and returns a result", async () => {
    writeEntity("de", "business.md", {
      schema: "pbp/business@1",
      id: "https://warpgogol.com/business",
      type: "business",
      status: "published",
      name: "Test Business",
      summary: "Software development studio",
    });

    const input: PbpCompilerInput = {
      sourceDirectory: testDir,
      locale: "de",
      defaultLocale: "de",
      strictness: "production",
    };

    const result = await compilePbpProfile(input);

    expect(result.context).toBeDefined();
    expect(result.context.locale).toBe("de");
    expect(result.inventory.recordsDiscovered).toBe(1);
    expect(result.resolvedGraph.business).toBeDefined();
  });

  it("throws on empty source directory (no business entity found)", async () => {
    const input: PbpCompilerInput = {
      sourceDirectory: testDir,
      locale: "de",
      defaultLocale: "de",
      strictness: "production",
    };

    await expect(compilePbpProfile(input)).rejects.toThrow("No Business entity found");
  });

  it("passes buildTime through to the context", async () => {
    writeEntity("de", "business.md", {
      schema: "pbp/business@1",
      id: "https://warpgogol.com/business",
      type: "business",
      status: "published",
      name: "Test Business",
      summary: "Software development studio",
    });

    const input: PbpCompilerInput = {
      sourceDirectory: testDir,
      locale: "de",
      defaultLocale: "de",
      strictness: "production",
      buildTime: "2026-01-01T00:00:00Z",
    };

    const result = await compilePbpProfile(input);

    expect(result.context.buildTime).toBe("2026-01-01T00:00:00Z");
  });
});
