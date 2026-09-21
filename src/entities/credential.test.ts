import { describe, it, expect } from "vitest";
import {
  CREDENTIAL_SCHEMA_ID,
  isPbpCredentialKind,
  PBP_CREDENTIAL_KINDS,
} from "./credential.js";

describe("CREDENTIAL_SCHEMA_ID", () => {
  it("equals pbp/credential@1", () => {
    expect(CREDENTIAL_SCHEMA_ID).toBe("pbp/credential@1");
  });
});

describe("isPbpCredentialKind", () => {
  it("accepts all valid credential kinds", () => {
    for (const kind of PBP_CREDENTIAL_KINDS) {
      expect(isPbpCredentialKind(kind)).toBe(true);
    }
  });

  it("rejects invalid kind", () => {
    expect(isPbpCredentialKind("invalid")).toBe(false);
  });
});
