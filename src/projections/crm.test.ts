/*
<MODULE_CONTRACT>
<purpose>
Unit tests for crm covering PbpCrmProjection. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the crm suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import type { PbpCrmProjection } from "./crm.ts";

describe("PbpCrmProjection", () => {
  it("defines a valid CRM projection shape", () => {
    const projection: PbpCrmProjection = {
      projectionTarget: "crm",
      payload: {
        businessId: "biz-1",
        catalogEntryId: "entry-1",
        offeringId: "offering-1",
        planId: "plan-1",
        charges: { monthly: { value: "70.00" } },
        relatedOfferingIds: ["offering-2"],
        sourceRevision: "abc123",
      },
    };
    expect(projection.projectionTarget).toBe("crm");
    expect(projection.payload.businessId).toBe("biz-1");
    expect(projection.payload.relatedOfferingIds).toHaveLength(1);
  });
});
