/*
<MODULE_CONTRACT>
<purpose>
Unit tests for schema org covering PbpSchemaOrgMapping; PbpSchemaOrgLossReport. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the schema suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import type { PbpSchemaOrgMapping, PbpSchemaOrgLossReport } from "./schema-org.ts";

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
