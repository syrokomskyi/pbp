/*
<MODULE_CONTRACT>
<purpose>
Unit tests for review covering REVIEW_SCHEMA_ID; AGGREGATE_RATING_SCHEMA_ID; isPbpReviewContentMode. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the review suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

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
