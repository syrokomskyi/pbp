/*
<MODULE_CONTRACT>
<purpose>pbpTimingSchema — per-field timing semantics for time-bound policy
fields (start event, clock, timezone, optional business hours, boundary), attached
to policySchema.timing (RFC-1293).</purpose>
<non-goals>
  <item>Do not decide any site's contract terms — values are owner decisions.</item>
  <item>Do not validate IANA timezones here — PBP-TIMING-03 lives in the
  werkstatt-site gate so schema parsing stays IANA-library-free.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1293: initial schema — pbpTimingSchema + clock/boundary/businessHours enums; PBP_TIMING_CLOCKS derived from schema options (DNA-103).</item>
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
 * Timing semantics for a time-bound policy field.
 *
 * @see RFC-1293 — unambiguous timing semantics on time-bound PBP policies
 */

import { z } from "zod";

export const pbpTimingClockSchema = z.enum(["calendar", "business"]);
export const pbpTimingBoundarySchema = z.enum([
  "exact",
  "end-of-day",
  "end-of-calendar-month",
]);
export const pbpBusinessHoursSchema = z
  .object({
    days: z.array(z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"])).min(1),
    from: z.string().regex(/^\d{2}:\d{2}$/),
    to: z.string().regex(/^\d{2}:\d{2}$/),
    excludesPublicHolidaysOf: z.string().optional(), // e.g. "DE-BW"
  })
  .strict();

export const pbpTimingSchema = z
  .object({
    startEvent: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/), // e.g. request-received, material-receipt, notice-received, contract-end
    clock: pbpTimingClockSchema,
    timezone: z.string().min(1), // IANA, e.g. Europe/Berlin
    businessHours: pbpBusinessHoursSchema.optional(),
    boundary: pbpTimingBoundarySchema.default("exact"),
    note: z.string().optional(),
  })
  .strict();

export type PbpTiming = z.infer<typeof pbpTimingSchema>;
export type PbpTimingClock = z.infer<typeof pbpTimingClockSchema>;
export const PBP_TIMING_CLOCKS: readonly PbpTimingClock[] = pbpTimingClockSchema.options;
