/*
<MODULE_CONTRACT>
<purpose>publication — PBP git revision types for entity publication tracking and the isPublicPbpEntity projection gate (RFC-1328).</purpose>
<non-goals>
  <item>Do not publish — this module defines the revision contract.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1328: isPublicPbpEntity — the single publication gate all public projections consume (published + visibility != private).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP git revision, canonical snapshot, and publication snapshot contract.
 *
 * @see pbp-specification-package/compiler §4 (Build context), §24 (Canonical Snapshot)
 * @see RFC-0435, RFC-0442
 */

export interface PbpGitRevision {
  ref: string;
  commitSha: string;
  clean: boolean;
}

export type PbpCanonicalSerializationStep =
  | "convert-to-json-compatible"
  | "validate-i-json"
  | "preserve-decimal-as-string"
  | "remove-undefined"
  | "canonicalize-rfc-8785"
  | "hash";

export const PBP_CANONICAL_SERIALIZATION_STEPS: readonly PbpCanonicalSerializationStep[] = [
  "convert-to-json-compatible",
  "validate-i-json",
  "preserve-decimal-as-string",
  "remove-undefined",
  "canonicalize-rfc-8785",
  "hash",
] as const;

export function isPbpCanonicalSerializationStep(
  value: string,
): value is PbpCanonicalSerializationStep {
  return PBP_CANONICAL_SERIALIZATION_STEPS.includes(value as PbpCanonicalSerializationStep);
}

export interface PbpCanonicalSerialization {
  steps: PbpCanonicalSerializationStep[];
}

export interface PbpCanonicalSnapshotIncluded {
  resolvedEntityGraphSubset: unknown;
  locale: string;
  schemaIds: string[];
  sourceRevision: string;
  derivationIds: string[];
  normativeFacts: unknown;
  projectionType?: string;
}

export interface PbpCanonicalSnapshotExcluded {
  buildPath: true;
  localFilesystemPath: true;
  irrelevantTimestamps: true;
  logOrder: true;
  nonDeterministicMetrics: true;
  signature: true;
}

export interface PbpCanonicalSnapshot {
  included: PbpCanonicalSnapshotIncluded;
  excluded: PbpCanonicalSnapshotExcluded;
  serialization: PbpCanonicalSerialization;
}

export interface PbpPublicationSnapshot {
  canonicalSnapshot: PbpCanonicalSnapshot;
  digest: string;
  publishedAt: string;
  signature?: { algorithm: string; value: string };
}

export interface PbpJcsCanonicalization {
  rfc: "RFC 8785";
  excludeUndefined: true;
  preserveDecimalStrings: true;
}

/**
 * RFC-1328 (AMD-005): the single publication gate for every public
 * projection — agent API emitters, llms.txt, JSON-LD, NLWeb indexing.
 * An entity is public only when `status === "published"` and its optional
 * `publication.visibility` is not `"private"` (absent means public —
 * `visibility` exists only on schemas that declare it, e.g. evidence-source;
 * `draft`/`suspended`/`retired`/`superseded` entities never project).
 */
export function isPublicPbpEntity(entity: {
  status: string;
  publication?: { visibility?: string };
}): boolean {
  return entity.status === "published" && entity.publication?.visibility !== "private";
}
