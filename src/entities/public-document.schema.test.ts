/*
<MODULE_CONTRACT>
<purpose>
Unit tests for public document.schema covering publicDocumentSchema. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the public suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { publicDocumentSchema } from "./public-document.ts";

const validPublicDocument = {
  schema: "pbp/public-document@1",
  id: "https://warpgogol.com/documents/terms",
  type: "public-document" as const,
  status: "published" as const,
  kind: "terms-and-conditions" as const,
  name: "Terms and Conditions",
  canonicalUrl: "https://warpgogol.com/terms",
  governance: { authorityRef: "https://warpgogol.com/business" },
};

describe("publicDocumentSchema", () => {
  it("parses a valid public-document entity", () => {
    const result = publicDocumentSchema.safeParse(validPublicDocument);
    expect(result.success).toBe(true);
  });

  it("rejects invalid kind enum", () => {
    const result = publicDocumentSchema.safeParse({ ...validPublicDocument, kind: "contract" });
    expect(result.success).toBe(false);
  });

  it("rejects missing canonicalUrl", () => {
    const result = publicDocumentSchema.safeParse({
      ...validPublicDocument,
      canonicalUrl: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing governance", () => {
    const result = publicDocumentSchema.safeParse({
      ...validPublicDocument,
      governance: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown keys (strict)", () => {
    const result = publicDocumentSchema.safeParse({ ...validPublicDocument, extra: "x" });
    expect(result.success).toBe(false);
  });
});
