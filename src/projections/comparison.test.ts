import { describe, it, expect } from "vitest";
import {
  isPbpComparisonStatus,
  PBP_COMPARISON_STATUSES,
} from "./comparison.js";

describe("isPbpComparisonStatus", () => {
  it("accepts all valid statuses", () => {
    for (const status of PBP_COMPARISON_STATUSES) {
      expect(isPbpComparisonStatus(status)).toBe(true);
    }
  });

  it("rejects invalid status", () => {
    expect(isPbpComparisonStatus("invalid")).toBe(false);
  });
});
