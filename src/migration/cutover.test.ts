import { describe, it, expect } from "vitest";
import type {
  PbpMigrationCoverageReport,
  PbpCutoverChecklist,
} from "./cutover.js";

describe("PbpMigrationCoverageReport", () => {
  it("defines a valid coverage report shape", () => {
    const report: PbpMigrationCoverageReport = {
      totalLegacyEntities: 100,
      mappedEntities: 95,
      unmappedEntities: ["legacy-1", "legacy-2", "legacy-3", "legacy-4", "legacy-5"],
      verifiedEntities: 90,
      coveragePercentage: 95,
    };
    expect(report.coveragePercentage).toBe(95);
    expect(report.unmappedEntities).toHaveLength(5);
  });
});

describe("PbpCutoverChecklist", () => {
  it("defines a valid cutover checklist with all checks passing", () => {
    const checklist: PbpCutoverChecklist = {
      allEntitiesMapped: true,
      allEntitiesVerified: true,
      noSiteImportsFromLegacy: true,
      legacyTestsPass: true,
      pbpTestsPass: true,
      ready: true,
    };
    expect(checklist.ready).toBe(true);
  });

  it("defines a cutover checklist that is not ready", () => {
    const checklist: PbpCutoverChecklist = {
      allEntitiesMapped: false,
      allEntitiesVerified: false,
      noSiteImportsFromLegacy: true,
      legacyTestsPass: true,
      pbpTestsPass: false,
      ready: false,
    };
    expect(checklist.ready).toBe(false);
  });
});
