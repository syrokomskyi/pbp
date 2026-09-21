import { describe, it, expectTypeOf } from "vitest";
import type {
  PbpCompilerInput,
  PbpResolvedGraph,
  PbpBuyerView,
  PbpProjectionSet,
  PbpCompilerResult,
  PartialCompilerResult,
} from "./types.js";

describe("PbpCompilerInput", () => {
  it("has required compiler input fields", () => {
    expectTypeOf<PbpCompilerInput>().toHaveProperty("sourceDirectory").toEqualTypeOf<string>();
    expectTypeOf<PbpCompilerInput>().toHaveProperty("locale").toEqualTypeOf<string>();
    expectTypeOf<PbpCompilerInput>().toHaveProperty("defaultLocale").toEqualTypeOf<string>();
  });
});

describe("PbpResolvedGraph", () => {
  it("has business as required field", () => {
    expectTypeOf<PbpResolvedGraph>().toHaveProperty("business");
    expectTypeOf<PbpResolvedGraph>().toHaveProperty("places").toEqualTypeOf<Record<string, unknown>>();
    expectTypeOf<PbpResolvedGraph>().toHaveProperty("products").toEqualTypeOf<Record<string, unknown>>();
  });
});

describe("PbpBuyerView", () => {
  it("has schemaRef and sections", () => {
    expectTypeOf<PbpBuyerView>().toHaveProperty("schemaRef");
    expectTypeOf<PbpBuyerView>().toHaveProperty("sections").toEqualTypeOf<Record<string, unknown>>();
  });
});

describe("PbpProjectionSet", () => {
  it("has website, aiAnswer, and schemaOrg", () => {
    expectTypeOf<PbpProjectionSet>().toHaveProperty("website").toEqualTypeOf<unknown[]>();
    expectTypeOf<PbpProjectionSet>().toHaveProperty("aiAnswer").toEqualTypeOf<unknown[]>();
    expectTypeOf<PbpProjectionSet>().toHaveProperty("schemaOrg").toEqualTypeOf<Record<string, unknown>>();
  });
});

describe("PbpCompilerResult", () => {
  it("has required result fields", () => {
    expectTypeOf<PbpCompilerResult>().toHaveProperty("context");
    expectTypeOf<PbpCompilerResult>().toHaveProperty("inventory");
    expectTypeOf<PbpCompilerResult>().toHaveProperty("entityIndex").toEqualTypeOf<Map<string, unknown>>();
    expectTypeOf<PbpCompilerResult>().toHaveProperty("resolvedGraph");
    expectTypeOf<PbpCompilerResult>().toHaveProperty("projections");
  });
});

describe("PartialCompilerResult", () => {
  it("is Partial<PbpCompilerResult>", () => {
    expectTypeOf<PartialCompilerResult>().toEqualTypeOf<Partial<PbpCompilerResult>>();
  });
});
