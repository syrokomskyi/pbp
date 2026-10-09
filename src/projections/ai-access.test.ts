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
