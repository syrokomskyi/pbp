/*
<MODULE_CONTRACT>
<purpose>sla-policy entity — canonical PBP service level policy contract: Zod schema, inferred types, derived consts (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/sla-policy.ts — schema canonical, types via z.infer, consts via schema options (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Service Level Policy specialized schema.
 *
 * @see pbp-specification-package/entity-model §21 (SLA Policy)
 * @see RFC-0447
 */

import { z } from "zod";
import { policySchema } from "./policy.js";
import { nonEmptyString } from "../schemas/primitives.js";

const pbpSlaOperatorSchema = z.enum(["greater-than-or-equal", "less-than-or-equal", "equals"]);

const pbpSlaObjectiveSchema = z.object({
  metricRef: nonEmptyString,
  operator: pbpSlaOperatorSchema,
  threshold: z.object({ value: nonEmptyString, unitRef: nonEmptyString }),
  measurementWindow: nonEmptyString,
});

const pbpSlaRemedyTypeSchema = z.enum(["service-credit", "continued-performance"]);

const pbpSlaRemedySchema = z.object({
  trigger: z.literal("objective-not-met"),
  type: pbpSlaRemedyTypeSchema,
  value: z.object({ model: nonEmptyString, periods: z.number().optional() }).optional(),
  application: z.enum(["automatic", "on-request"]),
});

export const slaPolicySchema = policySchema
  .extend({
    kind: z.literal("service-level"),
    objective: pbpSlaObjectiveSchema,
    measurement: z
      .object({ methodRef: nonEmptyString, evidenceSourceRef: nonEmptyString })
      .optional(),
    exclusions: z.record(z.string(), z.object({ reasonRef: nonEmptyString })).optional(),
    remedy: pbpSlaRemedySchema.optional(),
  })
  .strict();

export type PbpSlaOperator = z.infer<typeof pbpSlaOperatorSchema>;
export const PBP_SLA_OPERATORS: readonly PbpSlaOperator[] = pbpSlaOperatorSchema.options;

export function isPbpSlaOperator(value: string): value is PbpSlaOperator {
  return PBP_SLA_OPERATORS.includes(value as PbpSlaOperator);
}

export type PbpSlaObjective = z.infer<typeof pbpSlaObjectiveSchema>;

export type PbpSlaRemedyType = z.infer<typeof pbpSlaRemedyTypeSchema>;
export const PBP_SLA_REMEDY_TYPES: readonly PbpSlaRemedyType[] = pbpSlaRemedyTypeSchema.options;

export function isPbpSlaRemedyType(value: string): value is PbpSlaRemedyType {
  return PBP_SLA_REMEDY_TYPES.includes(value as PbpSlaRemedyType);
}

export type PbpSlaRemedy = z.infer<typeof pbpSlaRemedySchema>;
export type PbpServiceLevelPolicy = z.infer<typeof slaPolicySchema>;
