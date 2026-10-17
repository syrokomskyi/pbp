/*
<MODULE_CONTRACT>
<purpose>
Unit tests for contact point covering CONTACT_POINT_SCHEMA_ID; isPbpContactChannel. It also guards the documented public contract and regression-sensitive edge cases.
</purpose>
<non-goals>
  <item>Not a contract source of truth — the module under test owns the authoritative behavior; fixtures are minimal scaffolding only.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1311: Compass header sweep — declares the contact suite's contract for test-file scaffold coverage.</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import {
  CONTACT_POINT_SCHEMA_ID,
  isPbpContactChannel,
  PBP_CONTACT_CHANNELS,
} from "./contact-point.ts";

describe("CONTACT_POINT_SCHEMA_ID", () => {
  it("equals pbp/contact-point@1", () => {
    expect(CONTACT_POINT_SCHEMA_ID).toBe("pbp/contact-point@1");
  });
});

describe("isPbpContactChannel", () => {
  it("accepts all valid channels", () => {
    for (const ch of PBP_CONTACT_CHANNELS) {
      expect(isPbpContactChannel(ch)).toBe(true);
    }
  });

  it("rejects invalid channel", () => {
    expect(isPbpContactChannel("invalid")).toBe(false);
  });
});
