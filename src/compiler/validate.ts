/*
<MODULE_CONTRACT>
<purpose>Phase 3: Validates raw entities against Zod schemas from RFC-0466.</purpose>
<non-goals>
  <item>Does not build the entity index — that is Phase 4 (entity-index.ts).</item>
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

import type { PbpEntity } from "../envelope.ts";
import type { PbpValidationError } from "../validation-errors.ts";
import type { PbpBuildStrictness } from "../compiler-pipeline.ts";
import { pbpSchemaById } from "../entities/index.ts";
import type { ParsedEntity } from "./parse.ts";

export interface RawValidationResult {
  entities: PbpEntity[];
  errors: PbpValidationError[];
}

export async function validateRaw(
  parsed: ParsedEntity[],
  strictness: PbpBuildStrictness,
): Promise<RawValidationResult> {
  const entities: PbpEntity[] = [];
  const errors: PbpValidationError[] = [];

  for (const entry of parsed) {
    const schema = pbpSchemaById[entry.schema];
    if (!schema) {
      errors.push({
        code: "PBP-SCHEMA-UNKNOWN",
        severity: "fatal",
        entityId: entry.entityId,
        message: `No Zod schema registered for schema ID "${entry.schema}".`,
        path: entry.physicalPath,
      });
      continue;
    }

    const result = schema.safeParse(entry.data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push({
          code: "PBP-SCHEMA-VALIDATION",
          severity: "error",
          entityId: entry.entityId,
          message: issue.message,
          path: issue.path.join("."),
        });
      }
      if (strictness === "migration") {
        // In migration mode, still attempt to use the data
        const entity = entry.data as unknown as PbpEntity;
        entity.locale = entry.locale;
        entities.push(entity);
      }
    } else {
      const entity = result.data as unknown as PbpEntity;
      entity.locale = entry.locale;
      entities.push(entity);
    }
  }

  return { entities, errors };
}
