import { describe, it, expect } from "vitest";
import { isPbpOverlayStaleBehavior, PBP_OVERLAY_STALE_BEHAVIORS } from "./runtime-overlay.js";

describe("isPbpOverlayStaleBehavior", () => {
  it("accepts all valid stale behaviors", () => {
    for (const behavior of PBP_OVERLAY_STALE_BEHAVIORS) {
      expect(isPbpOverlayStaleBehavior(behavior)).toBe(true);
    }
  });

  it("rejects invalid behavior", () => {
    expect(isPbpOverlayStaleBehavior("invalid")).toBe(false);
  });
});
