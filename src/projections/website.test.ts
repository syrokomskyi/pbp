import { describe, it, expect } from "vitest";
import type { PbpWebsiteProjection } from "./website.ts";

describe("PbpWebsiteProjection", () => {
  it("defines a valid website projection shape", () => {
    const projection: PbpWebsiteProjection = {
      projectionTarget: "website",
      offeringRef: { ref: "https://warpgogol.com/offerings/foundation" },
      renderedSections: { identity: { title: "About" } },
      locale: "de",
    };
    expect(projection.projectionTarget).toBe("website");
    expect(projection.locale).toBe("de");
    expect(projection.offeringRef.ref).toBe("https://warpgogol.com/offerings/foundation");
  });
});
