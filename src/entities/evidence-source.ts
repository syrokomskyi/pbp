/*
<MODULE_CONTRACT>
<purpose>evidence-source entity — canonical PBP evidence source contract: Zod schema, inferred types, derived consts (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/evidence-source.ts — schema canonical, types via z.infer, consts via schema options (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP EvidenceSource entity.
 *
 * @see pbp-specification-package/entity-model §25 (EvidenceSource)
 * @see RFC-0416
 * @see RFC-0706 (Nachweisregister evidence kind + items extensions)
 * @see RFC-0872 (technical-assessment kind, artifact roles, assessment field)
 * @see RFC-0885 (display control, website fields)
 * @see RFC-0890 (raw screenshot artifact, optional display fields)
 * @see ADR-0028 (Nachweisregister as PBP trust-layer extension)
 * @see ADR-0054 (technical assessments as first-class Nachweisregister evidence profile)
 */

import { z } from "zod";
import { pbpEntitySchema } from "../schemas/envelope.ts";
import { nonEmptyString } from "../schemas/primitives.ts";
import { pbpSchemaId } from "../schema-id.ts";

export const EVIDENCE_SOURCE_SCHEMA_ID = pbpSchemaId("evidence-source");

const pbpEvidenceKindSchema = z.enum([
  "external-web-sources",
  "verified-record",
  "third-party-registry",
  // RFC-0706: Nachweisregister evidence types
  "client-statement",
  "project-confirmation",
  "certificate",
  "operational-evidence",
  // RFC-0872: technical assessment evidence type
  "technical-assessment",
]);

// RFC-0872: artifact role for technical-assessment evidence items
const pbpEvidenceArtifactRoleSchema = z.enum([
  "raw-result",
  "report",
  "screenshot",
  "summary",
  "methodology",
]);

// RFC-0872: technical assessment nested schemas
const assessmentExecutionModeSchema = z.enum(["operator-run", "provider-run"]);
const assessmentAuthorizationBasisSchema = z.enum([
  "site-owner",
  "service-contract",
  "explicit-operator",
]);
// RFC-1102: widened to the full declared status set — the pre-merge interface and
// nachweis-card UI (RFC-1058) use "unavailable"/"not-applicable"; the old schema
// was stale and would have rejected real data.
const assessmentDimensionStatusSchema = z.enum([
  "pass",
  "fail",
  "not-checked",
  "unavailable",
  "not-applicable",
]);

const assessmentProviderSchema = z.object({
  id: nonEmptyString,
  name: nonEmptyString,
  homepage: nonEmptyString.optional(),
});

const assessmentToolSchema = z.object({
  id: nonEmptyString,
  name: nonEmptyString,
  version: nonEmptyString.optional(),
});

const assessmentMethodologySchema = z.object({
  id: nonEmptyString,
  version: nonEmptyString,
  runCount: z.number().int().min(1),
  aggregation: z.enum(["provider", "median", "none"]),
});

const assessmentDimensionSchema = z
  .object({
    id: nonEmptyString,
    providerLabel: nonEmptyString,
    score: z.number().min(0).max(100).optional(),
    numerator: z.number().optional(),
    denominator: z.number().optional(),
    status: assessmentDimensionStatusSchema.optional(),
    level: nonEmptyString.optional(),
    experimental: z.boolean().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    samples: z.array(z.number().min(0).max(100)).optional(),
  })
  .refine(
    (d) => {
      if (d.numerator != null || d.denominator != null) {
        if (d.numerator == null || d.denominator == null) return false;
        if (d.denominator <= 0) return false;
        if (d.numerator < 0 || d.numerator > d.denominator) return false;
      }
      return true;
    },
    {
      message:
        "numerator/denominator must occur as a valid pair: 0 <= numerator <= denominator, denominator > 0",
    },
  )
  .refine(
    (d) => {
      if (d.samples != null && d.samples.length > 0) {
        const sampleMin = Math.min(...d.samples);
        const sampleMax = Math.max(...d.samples);
        if (d.min != null && d.min !== sampleMin) return false;
        if (d.max != null && d.max !== sampleMax) return false;
      }
      return true;
    },
    { message: "min/max must match sample extrema when samples are present" },
  );

const technicalAssessmentSchema = z.object({
  profile: z.literal("technical-assessment"),
  seriesId: nonEmptyString,
  observationId: nonEmptyString,
  subject: z.object({
    url: nonEmptyString,
    canonicalUrl: nonEmptyString.optional(),
  }),
  provider: assessmentProviderSchema,
  tool: assessmentToolSchema,
  executionMode: assessmentExecutionModeSchema,
  authorizationBasis: assessmentAuthorizationBasisSchema,
  observedAt: nonEmptyString.regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/,
    "observedAt must be valid ISO 8601 with timezone",
  ),
  methodology: assessmentMethodologySchema,
  overall: z
    .object({
      score: z.number().min(0).max(100).optional(),
      level: nonEmptyString.optional(),
    })
    .optional(),
  dimensions: z.array(assessmentDimensionSchema).min(1),
  freshness: z.object({ maxAgeDays: z.number().int().positive() }),
  providerReportUrl: z
    .string()
    .url()
    .regex(/^https:/)
    .optional(),
});

// RFC-0885: display control aspect
const pbpEvidenceDisplayAspectSchema = z.enum(["visible", "hidden"]);

// RFC-0885: display control for evidence rendering
const pbpEvidenceDisplaySchema = z.object({
  document: pbpEvidenceDisplayAspectSchema,
  screenshot: pbpEvidenceDisplayAspectSchema,
  websiteLink: pbpEvidenceDisplayAspectSchema,
  hashCode: pbpEvidenceDisplayAspectSchema.optional(),
});

// RFC-0890: raw screenshot artifact (the original full-page capture)
const pbpRawScreenshotArtifactSchema = z.object({
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
  mediaType: nonEmptyString,
  originalFilename: nonEmptyString,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  r2Key: nonEmptyString.optional(),
  localPath: nonEmptyString.optional(),
  capturedAt: nonEmptyString.optional(),
});

// RFC-0885: client website screenshot artifact
// RFC-0890: display fields optional when only rawArtifact is present (ingest before upload)
const pbpWebsiteScreenshotSchema = z
  .object({
    sha256: z
      .string()
      .regex(/^[a-f0-9]{64}$/)
      .optional(),
    mediaType: nonEmptyString.optional(),
    storage: z.enum(["private", "public"]).optional(),
    url: nonEmptyString.optional(),
    // RFC-0887: capture date for UI display
    capturedAt: nonEmptyString.optional(),
    // RFC-0890: raw original artifact (populated by nachweis.screenshot.ingest)
    rawArtifact: pbpRawScreenshotArtifactSchema.optional(),
    // RFC-0892: display aspect ratio — "landscape" (16:9, default) or "portrait" (9:16 mobile)
    aspectRatio: z.enum(["landscape", "portrait"]).optional(),
  })
  .superRefine((data, ctx) => {
    const hasDisplay = data.sha256 != null && data.mediaType != null && data.storage != null;
    const hasRaw = data.rawArtifact != null;
    if (!hasDisplay && !hasRaw) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "websiteScreenshot must have either display variant (sha256, mediaType, storage) or rawArtifact (RFC-0890)",
        path: ["rawArtifact"],
      });
    }
  });

// ADR-0056: Nachweis evidence kinds that require a mandatory slug at schema level.
// Mirrors NACHWEIS_EVIDENCE_KINDS in packages/werkstatt/src/nachweis/nachweis-validate.ts.
// Defined locally to avoid engine→stack import (werkstatt-site must not import from werkstatt).
const NACHWEIS_EVIDENCE_KINDS = new Set([
  "client-statement",
  "project-confirmation",
  "certificate",
  "operational-evidence",
  "technical-assessment",
]);

export const evidenceSourceSchema = pbpEntitySchema
  .extend({
    type: z.literal("evidence-source"),
    name: nonEmptyString,
    kind: pbpEvidenceKindSchema,
    authority: z.object({ kind: nonEmptyString }),
    // RFC-0876: Nachweis operational fields used by manifest generator and routes
    slug: nonEmptyString.optional(),
    recordId: nonEmptyString.optional(),
    version: z.number().int().positive().optional(),
    publication: z
      .object({
        visibility: z.enum(["public", "private"]),
        publishedAt: nonEmptyString.optional(),
      })
      .optional(),
    items: z
      .record(
        z.string(),
        z.object({
          // RFC-0706: url and retrievedAt are optional for private file-based evidence
          url: nonEmptyString.optional(),
          retrievedAt: nonEmptyString.optional(),
          // RFC-0706: file-based evidence fields
          sha256: z
            .string()
            .regex(/^[a-f0-9]{64}$/)
            .optional(),
          storage: z.enum(["private", "public"]).optional(),
          mediaType: nonEmptyString.optional(),
          qualityStatus: z
            .enum(["unverified", "verified", "verified_with_quality_issue", "changed", "rejected"])
            .optional(),
          // RFC-0872: artifact semantics for technical-assessment evidence
          role: pbpEvidenceArtifactRoleSchema.optional(),
          canonical: z.boolean().optional(),
        }),
      )
      .optional(),
    // RFC-0872: normalized technical assessment metadata
    assessment: technicalAssessmentSchema.optional(),
    // RFC-0885: display control — required for Nachweis evidence kinds, rejected for others
    display: pbpEvidenceDisplaySchema.optional(),
    // RFC-0885: client website link
    websiteUrl: nonEmptyString.optional(),
    // RFC-0885: client website screenshot
    websiteScreenshot: pbpWebsiteScreenshotSchema.optional(),
    // RFC-0892: client website header tagline (or footer logo tagline)
    websiteTagline: nonEmptyString.optional(),
    // RFC-0892: client website footer tagline (bottom-right corner)
    websiteFooterTagline: nonEmptyString.optional(),
    // RFC-0893: manual sort order for Nachweis card display (ascending, default 100)
    sortOrder: z.number().int().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    // ADR-0056: slug MUST be present and non-empty for Nachweis evidence kinds
    if (NACHWEIS_EVIDENCE_KINDS.has(data.kind)) {
      const slug = (data as Record<string, unknown>).slug as string | undefined;
      if (typeof slug !== "string" || slug.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `slug is required for Nachweis evidence kind '${data.kind}' (RFC-0880, ADR-0056)`,
          path: ["slug"],
        });
      }
    }
    // RFC-0885: display MUST be present for Nachweis evidence kinds, MUST be absent for others
    const isNachweisKind = NACHWEIS_EVIDENCE_KINDS.has(data.kind);
    const hasDisplay = data.display != null;
    if (isNachweisKind && !hasDisplay) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `display is required for Nachweis evidence kind '${data.kind}' (RFC-0885)`,
        path: ["display"],
      });
    }
    if (!isNachweisKind && hasDisplay) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `display is only allowed on Nachweis evidence kinds (got kind '${data.kind}') (RFC-0885)`,
        path: ["display"],
      });
    }
    // RFC-0872 section 3: assessment MUST be absent when kind !== "technical-assessment"
    if (data.kind !== "technical-assessment" && data.assessment != null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "assessment field is only allowed on kind 'technical-assessment'",
        path: ["assessment"],
      });
    }
    // RFC-0872 section 2: screenshot canonical invariant — if any item has
    // role: screenshot and canonical: true, there MUST also be an item with
    // role: raw-result and canonical: true
    if (data.items) {
      const hasCanonicalScreenshot = Object.values(data.items).some(
        (item) => item.role === "screenshot" && item.canonical === true,
      );
      const hasCanonicalRawResult = Object.values(data.items).some(
        (item) => item.role === "raw-result" && item.canonical === true,
      );
      if (hasCanonicalScreenshot && !hasCanonicalRawResult) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "canonical screenshot artifact requires a canonical raw-result artifact (screenshots cannot be the sole canonical artifact)",
          path: ["items"],
        });
      }
    }
  });

export type PbpEvidenceKind = z.infer<typeof pbpEvidenceKindSchema>;
export const PBP_EVIDENCE_KINDS: readonly PbpEvidenceKind[] = pbpEvidenceKindSchema.options;

export function isPbpEvidenceKind(value: string): value is PbpEvidenceKind {
  return PBP_EVIDENCE_KINDS.includes(value as PbpEvidenceKind);
}

// RFC-0872: artifact role for technical-assessment evidence items
export type PbpEvidenceArtifactRole = z.infer<typeof pbpEvidenceArtifactRoleSchema>;

// RFC-0872: technical assessment sub-types
export type NachweisAssessmentExecutionMode = z.infer<typeof assessmentExecutionModeSchema>;
export type NachweisAssessmentAuthorizationBasis = z.infer<
  typeof assessmentAuthorizationBasisSchema
>;
export type NachweisAssessmentDimensionStatus = z.infer<typeof assessmentDimensionStatusSchema>;
export type NachweisAssessmentProvider = z.infer<typeof assessmentProviderSchema>;
export type NachweisAssessmentTool = z.infer<typeof assessmentToolSchema>;
export type NachweisAssessmentMethodology = z.infer<typeof assessmentMethodologySchema>;
export type NachweisAssessmentDimension = z.infer<typeof assessmentDimensionSchema>;
export type NachweisTechnicalAssessmentV1 = z.infer<typeof technicalAssessmentSchema>;

// RFC-0885: display control aspects for Nachweis evidence kinds
export type PbpEvidenceDisplayAspect = z.infer<typeof pbpEvidenceDisplayAspectSchema>;
export type PbpEvidenceDisplay = z.infer<typeof pbpEvidenceDisplaySchema>;

// RFC-0890: raw screenshot artifact (the original full-page capture)
export type PbpRawScreenshotArtifact = z.infer<typeof pbpRawScreenshotArtifactSchema>;

// RFC-0885: client website screenshot artifact
export type PbpWebsiteScreenshot = z.infer<typeof pbpWebsiteScreenshotSchema>;

export type PbpEvidenceSource = z.infer<typeof evidenceSourceSchema>;
