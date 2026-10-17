/*
<MODULE_CONTRACT>
<purpose>
Unit tests for validation errors covering isPbpValidationSeverity; isPbpErrorPrefix. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the validation suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import {
  isPbpValidationSeverity,
  isPbpErrorPrefix,
  PBP_VALIDATION_SEVERITIES,
  PBP_ERROR_PREFIXES,
} from "./validation-errors.ts";

describe("isPbpValidationSeverity", () => {
  it("accepts all valid severities", () => {
    for (const sev of PBP_VALIDATION_SEVERITIES) {
      expect(isPbpValidationSeverity(sev)).toBe(true);
    }
  });

  it("rejects invalid severity", () => {
    expect(isPbpValidationSeverity("critical")).toBe(false);
  });
});

describe("isPbpErrorPrefix", () => {
  it("accepts all valid prefixes", () => {
    for (const prefix of PBP_ERROR_PREFIXES) {
      expect(isPbpErrorPrefix(prefix)).toBe(true);
    }
  });

  it("rejects invalid prefix", () => {
    expect(isPbpErrorPrefix("PBP-INVALID")).toBe(false);
  });
});
