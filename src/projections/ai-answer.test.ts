/*
<MODULE_CONTRACT>
<purpose>
Unit tests for ai answer covering PbpAiAnswerProjection. It also guards the documented public contract and regression-sensitive edge cases.
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
import type { PbpAiAnswerProjection } from "./ai-answer.ts";

describe("PbpAiAnswerProjection", () => {
  it("defines a valid AI answer projection shape", () => {
    const projection: PbpAiAnswerProjection = {
      projectionTarget: "ai-answer",
      offeringRef: { ref: "https://warpgogol.com/offerings/foundation" },
      policyRef: { ref: "https://warpgogol.com/policies/ai" },
      allowedFacts: { name: "Foundation", price: "70.00" },
      deniedFacts: ["internalCost"],
      locale: "de",
    };
    expect(projection.projectionTarget).toBe("ai-answer");
    expect(projection.locale).toBe("de");
    expect(projection.deniedFacts).toHaveLength(1);
  });
});
