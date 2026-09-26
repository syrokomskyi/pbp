import { describe, it, expect } from "vitest";
import { isPbpRegistryKind, PBP_REGISTRY_KINDS } from "./registry.js";

describe("isPbpRegistryKind", () => {
  it("accepts all valid registry kinds", () => {
    for (const kind of PBP_REGISTRY_KINDS) {
      expect(isPbpRegistryKind(kind)).toBe(true);
    }
  });

  it("rejects invalid kind", () => {
    expect(isPbpRegistryKind("invalid")).toBe(false);
  });
});
