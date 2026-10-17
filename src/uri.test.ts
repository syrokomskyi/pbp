/*
<MODULE_CONTRACT>
<purpose>
Unit tests for uri covering validatePbpUri. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the uri suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { validatePbpUri } from "./uri.ts";

describe("validatePbpUri", () => {
  it("accepts valid HTTPS URI", () => {
    expect(validatePbpUri("https://warpgogol.com/business")).toEqual({ ok: true });
  });

  it("rejects non-absolute URI", () => {
    const result = validatePbpUri("not-a-uri");
    expect(result.ok).toBe(false);
  });

  it("rejects http by default (only https allowed)", () => {
    const result = validatePbpUri("http://warpgogol.com/business");
    expect(result.ok).toBe(false);
  });

  it("accepts http when allowedSchemes includes it", () => {
    const result = validatePbpUri("http://warpgogol.com/business", { allowedSchemes: ["http"] });
    expect(result.ok).toBe(true);
  });

  it("rejects locale markers in path (ADR-025)", () => {
    const result = validatePbpUri("https://warpgogol.com/de/business");
    expect(result.ok).toBe(false);
  });

  it("rejects array indices in path", () => {
    const result = validatePbpUri("https://warpgogol.com/0/business");
    expect(result.ok).toBe(false);
  });

  it("rejects local file paths", () => {
    const result = validatePbpUri("https://warpgogol.com/business");
    expect(result.ok).toBe(true);
    expect(validatePbpUri("/home/user/file").ok).toBe(false);
    expect(validatePbpUri("./src/file").ok).toBe(false);
  });
});
