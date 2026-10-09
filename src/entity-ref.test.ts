import { describe, it, expect } from "vitest";
import { PBP_IDENTITY_RELATIONS, type PbpIdentityRelation } from "./entity-ref.ts";

describe("PBP_IDENTITY_RELATIONS", () => {
  it("contains all expected identity relations", () => {
    expect(PBP_IDENTITY_RELATIONS).toContain("sameIdentityAs");
    expect(PBP_IDENTITY_RELATIONS).toContain("equivalentTo");
    expect(PBP_IDENTITY_RELATIONS).toContain("similarTo");
    expect(PBP_IDENTITY_RELATIONS).toContain("supersedes");
    expect(PBP_IDENTITY_RELATIONS).toContain("derivedFrom");
  });

  it("has exactly 5 relations", () => {
    expect(PBP_IDENTITY_RELATIONS).toHaveLength(5);
  });
});
