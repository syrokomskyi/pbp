/*
<MODULE_CONTRACT>
<purpose>
Unit tests for web presence.schema covering webPresenceSchema. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the web suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { webPresenceSchema } from "./web-presence.ts";

const validWebPresence = {
  schema: "pbp/web-presence@1",
  id: "https://warpgogol.com/web/main",
  type: "web-presence" as const,
  status: "published" as const,
  name: "Main Website",
  kind: "primary-website" as const,
  canonicalUrl: "https://warpgogol.com",
  businessRef: { ref: "https://warpgogol.com/business" },
  control: "business-controlled" as const,
};

describe("webPresenceSchema", () => {
  it("parses a valid web-presence entity", () => {
    const result = webPresenceSchema.safeParse(validWebPresence);
    expect(result.success).toBe(true);
  });

  it("rejects invalid kind enum", () => {
    const result = webPresenceSchema.safeParse({ ...validWebPresence, kind: "blog" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid control enum", () => {
    const result = webPresenceSchema.safeParse({ ...validWebPresence, control: "unknown" });
    expect(result.success).toBe(false);
  });

  it("accepts optional sameAs array", () => {
    const result = webPresenceSchema.safeParse({
      ...validWebPresence,
      sameAs: ["https://twitter.com/warpgogol"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing canonicalUrl", () => {
    const result = webPresenceSchema.safeParse({ ...validWebPresence, canonicalUrl: undefined });
    expect(result.success).toBe(false);
  });

  it("rejects unknown keys (strict)", () => {
    const result = webPresenceSchema.safeParse({ ...validWebPresence, extra: "x" });
    expect(result.success).toBe(false);
  });
});
