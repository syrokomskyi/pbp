/*
<MODULE_CONTRACT>
<purpose>Zod schema for PBP entity envelope, status, and governance (RFC-0399, RFC-0466).</purpose>
<non-goals>
  <item>Does not define entity-specific schemas — those extend this base.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: step 6 — compass.migrate codemod run

Mechanical v1 to v2 header migration across the workspace: 942 files rewritten — CHANGE_SUMMARY windows collapsed into history, forbidden v1 blocks stripped, KEY_DECISIONS seeded from @ai-invariant comments (5 files) or TODO placeholders (103 files), blocks reordered to canonical order.</item>
  <item>RFC-1097: sweep — werkstatt-engine clean

Sweep batch 4: 73 Compass headers on headerless engine files (certification, component-runtime, isolation, evolution, testing), real KEY_DECISIONS on 75 files (kernel, cache, dht, swim, gitmesh, runtime), ~80 purpose expansions (CONTRACT-02/PURPOSE-02), non-goals on 13 CONTRACT-03 files, CS-07 history literal fix repo-wide (253 files). Policy: .template.ts/.template.astro excludedPaths. werkstatt-engine now 0 diagnostics.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

import { z } from "zod";
import { nonEmptyString } from "./primitives.ts";

export const pbpEntityStatusSchema = z.enum([
  "draft",
  "published",
  "suspended",
  "retired",
  "superseded",
]);

export const pbpGovernanceSchema = z.object({
  authorityRef: nonEmptyString,
  effectiveFrom: nonEmptyString.optional(),
  reviewedAt: nonEmptyString.optional(),
  reviewEvery: nonEmptyString.optional(),
  maintenanceOwnerRef: nonEmptyString.optional(),
});

// ADR-025: entity IDs must not contain locale markers
const entityIdSchema = nonEmptyString.refine(
  (s) => !/(?:^|[\/\-_.])(de|en|uk|fr|es|it|nl|pl|ru)(?:[\/\-_.]|$)/.test(s.toLowerCase()),
  { message: "Entity IDs must not contain locale markers (ADR-025)" },
);

// RFC-0399: schema ID pattern pbp/{entity}@{major}
const schemaIdSchema = nonEmptyString.refine((s) => /^pbp\/[a-z][a-z0-9-]*@\d+$/.test(s), {
  message: "Schema ID must match pattern: pbp/{entity}@{major} (RFC-0399)",
});

export const pbpEntitySchema = z.object({
  schema: schemaIdSchema,
  id: entityIdSchema,
  type: nonEmptyString,
  status: pbpEntityStatusSchema,
  name: nonEmptyString.optional(),
  summary: nonEmptyString.optional(),
  governance: pbpGovernanceSchema.optional(),
  /** RFC-1075: persistent canonical URI for Linked Data @id. */
  canonicalUri: nonEmptyString.optional(),
});

export { entityIdSchema, schemaIdSchema };
