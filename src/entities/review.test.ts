import { describe, it, expect } from "vitest";
import {
  REVIEW_SCHEMA_ID,
  AGGREGATE_RATING_SCHEMA_ID,
  isPbpReviewContentMode,
  PBP_REVIEW_CONTENT_MODES,
} from "./review.ts";

describe("REVIEW_SCHEMA_ID", () => {
  it("equals pbp/review@1", () => {
    expect(REVIEW_SCHEMA_ID).toBe("pbp/review@1");
  });
});

describe("AGGREGATE_RATING_SCHEMA_ID", () => {
  it("equals pbp/aggregate-rating@1", () => {
    expect(AGGREGATE_RATING_SCHEMA_ID).toBe("pbp/aggregate-rating@1");
  });
});

describe("isPbpReviewContentMode", () => {
  it("accepts all valid content modes", () => {
    for (const mode of PBP_REVIEW_CONTENT_MODES) {
      expect(isPbpReviewContentMode(mode)).toBe(true);
    }
  });

  it("rejects invalid mode", () => {
    expect(isPbpReviewContentMode("invalid")).toBe(false);
  });
});
