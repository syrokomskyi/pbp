import { describe, it, expect } from "vitest";
import { POLICY_SCHEMA_ID, isPbpPolicyKind, PBP_POLICY_KINDS, policySchema } from "./policy.ts";

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

  it("includes the RFC-1155 contract-term kinds", () => {
    for (const kind of ["liability", "partner-program", "portability", "renewal"]) {
      expect(isPbpPolicyKind(kind), `Expected ${kind} in PBP_POLICY_KINDS`).toBe(true);
    }
  });
});

describe("policySchema generic permissiveness (RFC-1155 AC-9)", () => {
  const genericPolicy = {
    schema: "pbp/policy@1",
    id: "https://warpgogol.com/policies/legacy",
    type: "policy" as const,
    status: "published" as const,
    name: "Legacy Policy",
  };

  it("still validates pre-existing cancellation/price-changes kind files", () => {
    for (const kind of ["cancellation", "price-changes"]) {
      const result = policySchema.safeParse({ ...genericPolicy, kind });
      expect(result.success, `generic policy@1 must accept kind ${kind}`).toBe(true);
    }
  });

  it("accepts the new kind literals on the generic schema (per-file opt-in to specialized)", () => {
    for (const kind of ["liability", "partner-program", "portability", "renewal"]) {
      const result = policySchema.safeParse({ ...genericPolicy, kind });
      expect(result.success, `generic policy@1 must accept kind ${kind}`).toBe(true);
    }
  });
});
