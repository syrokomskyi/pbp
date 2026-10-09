import { describe, it, expect } from "vitest";
import { LEGAL_IDENTITY_SCHEMA_ID } from "./legal-identity.ts";

describe("LEGAL_IDENTITY_SCHEMA_ID", () => {
  it("equals pbp/legal-identity@1", () => {
    expect(LEGAL_IDENTITY_SCHEMA_ID).toBe("pbp/legal-identity@1");
  });
});
