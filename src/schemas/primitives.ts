/*
<MODULE_CONTRACT>
<purpose>Zod schemas for PBP primitive value types — validates the entity shape and required fields (RFC-0400, RFC-0466).</purpose>
<non-goals>
  <item>Does not define entity schemas — those are in separate files per entity.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: step 6 — compass.migrate codemod run

Mechanical v1 to v2 header migration across the workspace: 942 files rewritten — CHANGE_SUMMARY windows collapsed into history, forbidden v1 blocks stripped, KEY_DECISIONS seeded from @ai-invariant comments (5 files) or TODO placeholders (103 files), blocks reordered to canonical order.</item>
  <item>RFC-1097: sweep — werkstatt-engine clean

Sweep batch 4: 73 Compass headers on headerless engine files (certification, component-runtime, isolation, evolution, testing), real KEY_DECISIONS on 75 files (kernel, cache, dht, swim, gitmesh, runtime), ~80 purpose expansions (CONTRACT-02/PURPOSE-02), non-goals on 13 CONTRACT-03 files, CS-07 history literal fix repo-wide (253 files). Policy: .template.ts/.template.astro excludedPaths. werkstatt-engine now 0 diagnostics.</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

import { z } from "zod";

// ADR-038: no empty strings in canonical fields
// ADR-037: no HTML in canonical string fields
const nonEmptyString = z
  .string()
  .min(1)
  .refine((s) => !/<[a-z][\s\S]*>/i.test(s), {
    message: "HTML tags are not allowed in canonical fields (ADR-037)",
  });
// Alias for clarity at call sites where HTML check is the primary concern
const noHtmlString = nonEmptyString;

// ADR-012: money value is a decimal string, not a number
const decimalString = nonEmptyString.refine((s) => /^\d+(\.\d+)?$/.test(s), {
  message: 'Money value must be a decimal string like "70.00" (ADR-012)',
});

export const pbpLocalizedStringSchema = z.object({
  value: nonEmptyString,
  language: nonEmptyString,
});

export const pbpMoneySchema = z.object({
  value: decimalString,
  currency: nonEmptyString,
});

export const pbpMoneyRangeSchema = z.object({
  minimum: pbpMoneySchema,
  maximum: pbpMoneySchema,
});

// RFC-1155: canonical ISO-8601 duration contract — at least one component,
// no bare "P"/"PT", no trailing "T" without time components, no weeks mixed
// with calendar components (ISO 8601-1 §D.4.3 alternative format).
const ISO_8601_DURATION =
  /^P(?:\d+W|(?:\d+Y)?(?:\d+M)?(?:\d+D)?)?(?:T(?:\d+H)?(?:\d+M)?(?:\d+S)?)?$/;
export const pbpIsoDurationSchema = nonEmptyString.refine(
  (s) => ISO_8601_DURATION.test(s) && !/^PT?$/.test(s) && !/T$/.test(s),
  {
    message:
      'Duration must be a canonical ISO 8601 duration like "P30D", "P1Y6M", "P2W", or "PT72H" (RFC-1155)',
  },
);

export const pbpQuantitativeDurationSchema = z.object({
  value: z.number(),
  unitRef: nonEmptyString,
});

export const pbpTimestampSchema = nonEmptyString;

export const pbpQuantitativeValueSchema = z.object({
  value: nonEmptyString.optional(),
  minimum: nonEmptyString.optional(),
  maximum: nonEmptyString.optional(),
  unitRef: nonEmptyString,
});

export const pbpExternalIdentifierSchema = z.object({
  schemeRef: nonEmptyString,
  value: nonEmptyString,
  authorityRef: nonEmptyString.optional(),
});

export const pbpControlledValueSchema = z.object({
  valueRef: nonEmptyString,
});

export { noHtmlString, nonEmptyString, decimalString };
