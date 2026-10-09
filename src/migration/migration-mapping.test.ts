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
