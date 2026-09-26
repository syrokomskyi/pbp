import { describe, it, expect } from "vitest";
import { POLICY_SCHEMA_ID, isPbpPolicyKind, PBP_POLICY_KINDS } from "./policy.js";

describe("POLICY_SCHEMA_ID", () => {
  it("equals pbp/policy@1", () => {
    expect(POLICY_SCHEMA_ID).toBe("pbp/policy@1");
  });
});

describe("isPbpPolicyKind", () => {
  it("accepts all valid policy kinds", () => {
    for (const kind of PBP_POLICY_KINDS) {
      expect(isPbpPolicyKind(kind)).toBe(true);
    }
  });

  it("rejects invalid kind", () => {
    expect(isPbpPolicyKind("invalid")).toBe(false);
  });
});
