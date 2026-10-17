/*
<MODULE_CONTRACT>
<purpose>
Unit tests for ai access covering PbpAiAccessProjection. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the ai suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import type { PbpAiAccessProjection } from "./ai-access.ts";

describe("PbpAiAccessProjection", () => {
  it("defines a valid AI access projection shape", () => {
    const projection: PbpAiAccessProjection = {
      projectionTarget: "ai-answer",
      policyRef: { ref: "https://warpgogol.com/policies/ai" },
      allowedFacts: ["name", "price"],
      deniedFacts: ["internalCost"],
    };
    expect(projection.projectionTarget).toBe("ai-answer");
    expect(projection.allowedFacts).toHaveLength(2);
    expect(projection.deniedFacts).toHaveLength(1);
  });
});
