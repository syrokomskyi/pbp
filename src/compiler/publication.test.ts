/*
<MODULE_CONTRACT>
<purpose>
Unit tests for publication covering publish. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the publication suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { publish } from "./publication.ts";
import type { PbpCompilerInput, PartialCompilerResult } from "./types.ts";

describe("publish", () => {
  it("assembles PbpCompilerResult from partial results and input", async () => {
    const input: PbpCompilerInput = {
      sourceDirectory: "/test",
      locale: "de",
      defaultLocale: "de",
      strictness: "production",
    };

    const result = await publish({}, input);

    expect(result.context.locale).toBe("de");
    expect(result.context.defaultLocale).toBe("de");
    expect(result.entityIndex).toBeInstanceOf(Map);
    expect(result.projections.website).toEqual([]);
    expect(result.projections.aiAnswer).toEqual([]);
  });

  it("fills defaults for missing partial fields", async () => {
    const input: PbpCompilerInput = {
      sourceDirectory: "/nonexistent-path",
      locale: "uk",
      defaultLocale: "de",
      strictness: "production",
    };

    const result = await publish({}, input);

    expect(result.fallbackReport.locale).toBe("uk");
    expect(result.fallbackReport.fallbacks).toEqual([]);
    expect(result.graphErrors).toEqual([]);
    expect(result.cycleResults).toEqual([]);
    expect(result.validationErrors).toEqual([]);
    expect(result.derivationResults).toEqual([]);
  });

  it("preserves provided partial fields", async () => {
    const input: PbpCompilerInput = {
      sourceDirectory: "/test",
      locale: "de",
      defaultLocale: "de",
      strictness: "production",
    };

    const partial: PartialCompilerResult = {
      graphErrors: [{ kind: "missing-internal-ref", entityId: "x", refPath: "y", message: "test" }],
    };

    const result = await publish(partial, input);

    expect(result.graphErrors).toHaveLength(1);
    expect(result.graphErrors[0]?.entityId).toBe("x");
  });

  it("generates a buildId from source revision, locale, and strictness", async () => {
    const input: PbpCompilerInput = {
      sourceDirectory: "/test",
      locale: "de",
      defaultLocale: "de",
      strictness: "production",
    };

    const result = await publish({}, input);

    expect(result.context.buildId).toBeTruthy();
    expect(typeof result.context.buildId).toBe("string");
  });
});
