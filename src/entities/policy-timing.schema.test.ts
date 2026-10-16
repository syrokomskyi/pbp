/*
<MODULE_CONTRACT>
<purpose>Schema tests for RFC-1293 pbpTimingSchema — valid timing maps parse on
every specialized policy schema; strict-entry violations and bad enum values
reject.</purpose>
<non-goals>
  <item>Do not test gate diagnostics — that is content-pbp-timing.test.ts.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1293: initial suite — timing accepted on sla/guarantee/cancellation/exit, strict rejection, clock enum rejection.</item>
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

import { describe, it, expect } from "vitest";
import { slaPolicySchema } from "./sla-policy.ts";
import { guaranteePolicySchema } from "./guarantee-policy.ts";
import { cancellationPolicySchema } from "./cancellation-policy.ts";
import { exitPolicySchema } from "./exit-policy.ts";
import { PBP_TIMING_CLOCKS } from "./policy-timing.ts";

const base = {
  id: "acme-policy",
  type: "policy",
  status: "published",
};

const slaObjective = {
  metricRef: "response-time",
  operator: "less-than-or-equal",
  threshold: { value: "24", unitRef: "hours" },
  measurementWindow: "P1M",
};

const timing = {
  "objective.threshold": {
    startEvent: "request-received",
    clock: "business",
    timezone: "Europe/Berlin",
    businessHours: { days: ["mon", "tue", "wed", "thu", "fri"], from: "09:00", to: "17:00" },
  },
  "objective.measurementWindow": {
    startEvent: "calendar-month-start",
    clock: "calendar",
    timezone: "Europe/Berlin",
    boundary: "end-of-calendar-month",
  },
};

describe("pbpTimingSchema via specialized policy schemas (RFC-1293)", () => {
  it("slaPolicySchema accepts a policy carrying a valid timing map (AC-1)", () => {
    const result = slaPolicySchema.safeParse({
      ...base,
      schema: "pbp/sla-policy@1",
      kind: "service-level",
      name: "SLA",
      objective: slaObjective,
      timing,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.timing?.["objective.threshold"].clock).toBe("business");
      expect(result.data.timing?.["objective.measurementWindow"].boundary).toBe(
        "end-of-calendar-month",
      );
    }
  });

  it.each([
    ["guarantee", guaranteePolicySchema, "pbp/guarantee-policy@1"],
    ["cancellation", cancellationPolicySchema, "pbp/cancellation-policy@1"],
    ["exit", exitPolicySchema, "pbp/exit-policy@1"],
  ] as const)("%s policy schema inherits the timing field", (_label, schema, schemaId) => {
    // Minimal bodies differ per schema; only assert the timing field parses on
    // the base layer by checking a deliberately-underspecified entity carries
    // timing through safeParse's field validation (a missing required field
    // fails elsewhere — timing must not be the failure reason).
    const result = schema.safeParse({
      ...base,
      schema: schemaId,
      timing,
    });
    if (!result.success) {
      const timingIssue = result.error.issues.find((i) => i.path[0] === "timing");
      expect(timingIssue, "timing field itself must parse").toBeUndefined();
    }
  });

  it("rejects a timing entry with an unknown key (strict)", () => {
    const result = slaPolicySchema.safeParse({
      ...base,
      schema: "pbp/sla-policy@1",
      kind: "service-level",
      name: "SLA",
      objective: slaObjective,
      timing: {
        "objective.threshold": { ...timing["objective.threshold"], surprise: true },
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects a clock value outside the enum", () => {
    const result = slaPolicySchema.safeParse({
      ...base,
      schema: "pbp/sla-policy@1",
      kind: "service-level",
      name: "SLA",
      objective: slaObjective,
      timing: {
        "objective.threshold": {
          startEvent: "request-received",
          clock: "weekdays",
          timezone: "Europe/Berlin",
        },
      },
    });
    expect(result.success).toBe(false);
  });

  it("boundary defaults to exact; clocks derive from the schema (DNA-103)", () => {
    const result = slaPolicySchema.safeParse({
      ...base,
      schema: "pbp/sla-policy@1",
      kind: "service-level",
      name: "SLA",
      objective: slaObjective,
      timing: {
        "objective.threshold": {
          startEvent: "request-received",
          clock: "calendar",
          timezone: "UTC",
        },
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.timing?.["objective.threshold"].boundary).toBe("exact");
    }
    expect(PBP_TIMING_CLOCKS).toEqual(["calendar", "business"]);
  });
});
