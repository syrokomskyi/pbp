import { describe, it, expect } from "vitest";
import type { PbpSchemaOrgMapping, PbpSchemaOrgLossReport } from "./schema-org.js";

describe("PbpSchemaOrgMapping", () => {
  it("defines a valid schema.org mapping", () => {
    const mapping: PbpSchemaOrgMapping = {
      mappingRef: "schema-org-v15",
      targetSchema: "schema.org",
      schemaOrgVersion: "15.0",
    };
    expect(mapping.targetSchema).toBe("schema.org");
    expect(mapping.schemaOrgVersion).toBe("15.0");
  });
});

describe("PbpSchemaOrgLossReport", () => {
  it("defines a valid loss report", () => {
    const report: PbpSchemaOrgLossReport = {
      losses: [
        { sourcePath: "pricing.charges", reason: "No schema.org equivalent", fallback: "offers" },
      ],
    };
    expect(report.losses).toHaveLength(1);
    expect(report.losses[0]?.sourcePath).toBe("pricing.charges");
  });
});
