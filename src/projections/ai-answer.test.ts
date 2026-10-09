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
