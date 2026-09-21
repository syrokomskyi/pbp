import { describe, it, expect } from "vitest";
import {
  CONTACT_POINT_SCHEMA_ID,
  isPbpContactChannel,
  PBP_CONTACT_CHANNELS,
} from "./contact-point.js";

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
