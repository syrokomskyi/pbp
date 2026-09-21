import { describe, it, expect } from "vitest";
import { validatePbpUri } from "./uri.js";

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
