import { describe, it, expect } from "vitest";
import { isPbpEntityStatus, PBP_ENTITY_STATUSES } from "./envelope.js";

describe("isPbpEntityStatus", () => {
  it("accepts all valid statuses", () => {
    for (const status of PBP_ENTITY_STATUSES) {
      expect(isPbpEntityStatus(status)).toBe(true);
    }
  });

  it("rejects invalid status", () => {
    expect(isPbpEntityStatus("active")).toBe(false);
    expect(isPbpEntityStatus("")).toBe(false);
  });
});
