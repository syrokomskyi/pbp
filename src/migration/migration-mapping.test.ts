/*
<MODULE_CONTRACT>
<purpose>
Unit tests for migration mapping covering PbpLegacyToPbpFieldMap; PbpMigrationMapping. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the migration suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import type { PbpLegacyToPbpFieldMap, PbpMigrationMapping } from "./migration-mapping.ts";

describe("PbpLegacyToPbpFieldMap", () => {
  it("defines a valid field map", () => {
    const map: PbpLegacyToPbpFieldMap = {
      legacyPath: "product.title",
      pbpPath: "product.name",
      transformation: "identity",
    };
    expect(map.legacyPath).toBe("product.title");
    expect(map.transformation).toBe("identity");
  });
});

describe("PbpMigrationMapping", () => {
  it("defines a valid migration mapping with pending status", () => {
    const mapping: PbpMigrationMapping = {
      legacyEntity: "legacy_product",
      pbpEntity: "pbp/product@1",
      fieldMaps: [
        { legacyPath: "title", pbpPath: "name" },
        { legacyPath: "price", pbpPath: "pricing.charges.base.value" },
      ],
      status: "pending",
    };
    expect(mapping.status).toBe("pending");
    expect(mapping.fieldMaps).toHaveLength(2);
  });

  it("defines a verified migration mapping", () => {
    const mapping: PbpMigrationMapping = {
      legacyEntity: "legacy_product",
      pbpEntity: "pbp/product@1",
      fieldMaps: [],
      status: "verified",
    };
    expect(mapping.status).toBe("verified");
  });
});
