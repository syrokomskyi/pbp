import { describe, it, expect } from "vitest";
import {
  isPbpSemanticStatus,
  PBP_SEMANTIC_STATUSES,
} from "./semantic-status.js";

describe("isPbpSemanticStatus", () => {
  it("accepts all valid semantic statuses", () => {
    for (const status of PBP_SEMANTIC_STATUSES) {
      expect(isPbpSemanticStatus(status)).toBe(true);
    }
  });

  it("rejects invalid status", () => {
    expect(isPbpSemanticStatus("active")).toBe(false);
  });
});
