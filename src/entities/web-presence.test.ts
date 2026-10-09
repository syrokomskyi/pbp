import { describe, it, expect } from "vitest";
import {
  WEB_PRESENCE_SCHEMA_ID,
  isPbpWebPresenceKind,
  isPbpWebControlStatus,
  PBP_WEB_PRESENCE_KINDS,
  PBP_WEB_CONTROL_STATUSES,
} from "./web-presence.ts";

describe("WEB_PRESENCE_SCHEMA_ID", () => {
  it("equals pbp/web-presence@1", () => {
    expect(WEB_PRESENCE_SCHEMA_ID).toBe("pbp/web-presence@1");
  });
});

describe("isPbpWebPresenceKind", () => {
  it("accepts all valid kinds", () => {
    for (const kind of PBP_WEB_PRESENCE_KINDS) {
      expect(isPbpWebPresenceKind(kind)).toBe(true);
    }
  });

  it("rejects invalid kind", () => {
    expect(isPbpWebPresenceKind("invalid")).toBe(false);
  });
});

describe("isPbpWebControlStatus", () => {
  it("accepts all valid control statuses", () => {
    for (const status of PBP_WEB_CONTROL_STATUSES) {
      expect(isPbpWebControlStatus(status)).toBe(true);
    }
  });

  it("rejects invalid status", () => {
    expect(isPbpWebControlStatus("invalid")).toBe(false);
  });
});
