import { describe, it, expect } from "vitest";
import type { PbpCrmProjection, PbpCrmPayload } from "./crm.js";

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
