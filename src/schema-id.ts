/*
<MODULE_CONTRACT>
<purpose>schema-id — PBP namespace and schema identifier constants for the werkstatt-site domain layer.</purpose>
<non-goals>
  <item>Do not assign ids — this module defines the namespace constants.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP schema ID utilities — `pbp/{entity}@1` pattern.
 *
 * @see pbp-specification-package/entity-model §2 (Namespace and schema IDs)
 * @see RFC-0399
 */

export const PBP_NAMESPACE = "pbp";
export const PBP_MAJOR_VERSION = 1;

export function pbpSchemaId(entity: string): string {
  return `${PBP_NAMESPACE}/${entity}@${PBP_MAJOR_VERSION}`;
}

const SCHEMA_ID_RE = /^pbp\/([a-z][a-z0-9-]*)@(\d+)$/;

export function validateSchemaId(schema: string): {
  entity: string;
  major: number;
} {
  const match = SCHEMA_ID_RE.exec(schema);
  if (!match) {
    throw new Error(
      `Invalid PBP schema ID "${schema}". Expected pattern: pbp/{entity}@{major}, e.g. "pbp/business@1".`,
    );
  }
  return { entity: match[1], major: Number(match[2]) };
}
