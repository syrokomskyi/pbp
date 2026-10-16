/*
<MODULE_CONTRACT>
<purpose>policy entity — canonical PBP contract: Zod schema, inferred types, derived consts (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: merged Zod schema from schemas/policy.ts — schema is canonical, entity type derived via z.infer, const arrays derived from schema options (DNA-103).</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
  <item>RFC-1293: require timing semantics on time-bound policy fields via contractTerms.gate (RFC-1293)

policySchema gains an optional timing map (pbpTimingSchema: startEvent, clock,
timezone, businessHours, boundary) inherited by every specialized policy.
pbp.content.validate sweeps each pbp/* entity's frontmatter — TIMED_FIELDS
registry paths plus every ISO-8601 duration literal — and emits
PBP-TIMING-01..04 at contractTerms.gate severity (warn|enforce in system.md;
absent = warn). enforce also makes pbp.terms-reference.validate behave as
--strict. New sites register with contractTerms.gate: enforce
(sternsystem-register stub + both onboarding system templates). Live warpgogol
run: 129 PBP-TIMING-01 warnings across policies/offerings/documents/claims —
the owner's contract-decision agenda; no timing values authored, no site gate
flipped. Known registry gap: renewal.renewalPeriod/reminder are not ISO-shaped
and escape the sweep (documented in the RFC evidence). Canary C10 active.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Policy base entity and scope.
 *
 * @see pbp-specification-package/entity-model §20 (Policy base)
 * @see RFC-0439
 */

import { z } from "zod";
import { pbpEntitySchema } from "../schemas/envelope.ts";
import { pbpEntityRefSchema } from "../schemas/entity-ref.ts";
import { nonEmptyString } from "../schemas/primitives.ts";
import { pbpSchemaId } from "../schema-id.ts";
import { pbpTimingSchema } from "./policy-timing.ts";

export const POLICY_SCHEMA_ID = pbpSchemaId("policy");

export const pbpPolicyKindSchema = z.enum([
  "service-level",
  "guarantee",
  "ownership",
  "exit",
  "data-retention",
  "cancellation",
  "price-changes",
  "liability",
  "partner-program",
  "portability",
  "renewal",
]);

export const policySchema = pbpEntitySchema
  .extend({
    type: z.literal("policy"),
    kind: pbpPolicyKindSchema,
    name: nonEmptyString,
    scope: z
      .object({
        offeringRefs: z.record(z.string(), pbpEntityRefSchema),
      })
      .optional(),
    terms: z.record(z.string(), z.unknown()).optional(),
    /**
     * RFC-1293: per-field timing semantics for time-bound fields. Keys are dot
     * paths inside this entity's frontmatter (e.g. "objective.threshold"); the
     * value declares when the period starts, how it is counted, and in which
     * timezone. Optional — sites enforce completeness via contractTerms.gate.
     */
    timing: z.record(z.string(), pbpTimingSchema).optional(),
  })
  .strict();

export type PbpPolicy = z.infer<typeof policySchema>;

export type PbpPolicyKind = z.infer<typeof pbpPolicyKindSchema>;
export const PBP_POLICY_KINDS: readonly PbpPolicyKind[] = pbpPolicyKindSchema.options;

export function isPbpPolicyKind(value: string): value is PbpPolicyKind {
  return PBP_POLICY_KINDS.includes(value as PbpPolicyKind);
}
