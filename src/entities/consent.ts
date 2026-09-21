/*
<MODULE_CONTRACT>
<purpose>PBP Consent entity — canonical contract for granular consent management: Zod schema, inferred types, derived consts (RFC-0706, RFC-0885, ADR-0028, RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Does not define consent lifecycle commands — those belong to RFC-0707.</item>
  <item>Does not define R2 storage integration — that belongs to RFC-0707.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/consent.ts — schema is canonical, entity type derived via z.infer, const arrays derived from schema options (DNA-103).</item>
  <item>RFC-0885 — Replaced consentStatus/grantedAt/method with consentScope (per-aspect granular consent).</item>
  <item>RFC-1097: step 6 — compass.migrate codemod run

Mechanical v1 to v2 header migration across the workspace: 942 files rewritten — CHANGE_SUMMARY windows collapsed into history, forbidden v1 blocks stripped, KEY_DECISIONS seeded from @ai-invariant comments (5 files) or TODO placeholders (103 files), blocks reordered to canonical order.</item>
  <item>RFC-1097: sweep — werkstatt-engine clean

Sweep batch 4: 73 Compass headers on headerless engine files (certification, component-runtime, isolation, evolution, testing), real KEY_DECISIONS on 75 files (kernel, cache, dht, swim, gitmesh, runtime), ~80 purpose expansions (CONTRACT-02/PURPOSE-02), non-goals on 13 CONTRACT-03 files, CS-07 history literal fix repo-wide (253 files). Policy: .template.ts/.template.astro excludedPaths. werkstatt-engine now 0 diagnostics.</item>
</CHANGE_SUMMARY>
*/

import { z } from "zod";
import { pbpEntitySchema } from "../schemas/envelope.js";
import { nonEmptyString } from "../schemas/primitives.js";
import { pbpSchemaId } from "../schema-id.js";

export const CONSENT_SCHEMA_ID = pbpSchemaId("consent");

const pbpConsentMethodSchema = z.enum(["verified_business_email", "signed_pdf", "qes", "none"]);

// RFC-0885: per-aspect consent scope status
const pbpConsentScopeStatusSchema = z.enum(["not_requested", "granted", "denied"]);

// RFC-0885: per-aspect consent scope entry
const pbpConsentScopeEntrySchema = z.object({
  status: pbpConsentScopeStatusSchema,
  grantedAt: z.union([z.string(), z.null()]),
  method: pbpConsentMethodSchema,
});

// RFC-0885: granular consent scope for document, screenshot, websiteLink aspects
const pbpConsentScopeSchema = z.object({
  document: pbpConsentScopeEntrySchema,
  screenshot: pbpConsentScopeEntrySchema,
  websiteLink: pbpConsentScopeEntrySchema,
});

export const consentSchema = pbpEntitySchema
  .extend({
    type: z.literal("consent"),
    name: nonEmptyString,
    textVersion: nonEmptyString,
    purposes: z.array(nonEmptyString),
    channels: z.array(nonEmptyString),
    dataElements: z.array(nonEmptyString),
    evidenceRef: z.union([z.string(), z.null()]),
    withdrawalContact: nonEmptyString.optional(),
    // RFC-0885: granular per-aspect consent scope (replaces consentStatus/grantedAt/method)
    consentScope: pbpConsentScopeSchema,
  })
  .refine((data) => {
    const aspects = [
      data.consentScope.document,
      data.consentScope.screenshot,
      data.consentScope.websiteLink,
    ];
    return aspects.every((entry) => !(entry.status === "granted" && entry.grantedAt === null));
  }, "granted consent scope entry must record when it was granted (grantedAt must not be null when status is 'granted')")
  .strict();

export type PbpConsent = z.infer<typeof consentSchema>;

export type PbpConsentMethod = z.infer<typeof pbpConsentMethodSchema>;
export const PBP_CONSENT_METHODS: readonly PbpConsentMethod[] = pbpConsentMethodSchema.options;

export function isPbpConsentMethod(value: string): value is PbpConsentMethod {
  return PBP_CONSENT_METHODS.includes(value as PbpConsentMethod);
}

export type PbpConsentScopeStatus = z.infer<typeof pbpConsentScopeStatusSchema>;
export const PBP_CONSENT_SCOPE_STATUSES: readonly PbpConsentScopeStatus[] =
  pbpConsentScopeStatusSchema.options;

export function isPbpConsentScopeStatus(value: string): value is PbpConsentScopeStatus {
  return PBP_CONSENT_SCOPE_STATUSES.includes(value as PbpConsentScopeStatus);
}

export type PbpConsentScopeEntry = z.infer<typeof pbpConsentScopeEntrySchema>;
export type PbpConsentScope = z.infer<typeof pbpConsentScopeSchema>;
