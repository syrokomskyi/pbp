/*
<MODULE_CONTRACT>
<purpose>review entity — PBP schema definition for the review entity type.</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Review and AggregateRating entities.
 *
 * @see pbp-specification-package/entity-model §29 (Review and AggregateRating)
 * @see RFC-0419
 */

import type { PbpEntity } from "../envelope.js";
import type { PbpEntityRef } from "../entity-ref.js";
import { pbpSchemaId } from "../schema-id.js";

export const REVIEW_SCHEMA_ID = pbpSchemaId("review");
export const AGGREGATE_RATING_SCHEMA_ID = pbpSchemaId("aggregate-rating");

export type PbpReviewContentMode = "linked-only" | "excerpt" | "full";

export const PBP_REVIEW_CONTENT_MODES: readonly PbpReviewContentMode[] = [
  "linked-only",
  "excerpt",
  "full",
] as const;

export function isPbpReviewContentMode(value: string): value is PbpReviewContentMode {
  return PBP_REVIEW_CONTENT_MODES.includes(value as PbpReviewContentMode);
}

export interface PbpReview extends PbpEntity {
  type: "review";
  subjectRef: PbpEntityRef;
  sourceRef: PbpEntityRef;
  rating: { value: string; best: string; worst: string };
  author: { displayName: string };
  publishedAt: string;
  retrievedAt: string;
  content: { mode: PbpReviewContentMode; sourceUrl?: string };
}

export interface PbpAggregateRating extends PbpEntity {
  type: "aggregate-rating";
  subjectRef: PbpEntityRef;
  sourceRef: PbpEntityRef;
  ratingValue: string;
  ratingCount: number;
  bestRating: string;
  worstRating: string;
  observedAt: string;
  freshness: string;
}
