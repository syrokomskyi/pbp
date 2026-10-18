/*
<MODULE_CONTRACT>
<purpose>
Unit tests for semantic-profile covering projectToSemanticSiteProfile — the PBP
resolvedGraph → SemanticSiteProfile projection. Guards the RFC-1324 service
mapping: products of kind service/composite-service must reach
organization.services so Service JSON-LD is satisfiable on a PBP-native site.
</purpose>
<non-goals>
  <item>Does not test the compiler — the resolvedGraph is stubbed directly.</item>
  <item>Does not test JSON-LD emission — buildServiceNodes lives in werkstatt-shared.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1324: initial — service-kind products project into organization.services; non-service kinds do not.</item>
  <item>RFC-1324: project service-kind PBP products into organization.services (Service JSON-LD satisfiable on PBP-native sites); compose seam gains src-root files for the image-delivery escape hatch</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect } from "vitest";
import { projectToSemanticSiteProfile } from "./semantic-profile.ts";
import type { PbpCompilerResult, PbpResolvedGraph } from "./compiler/types.ts";

function graph(products: PbpResolvedGraph["products"]): PbpCompilerResult {
  return {
    context: {
      buildId: "test",
      sourceRevision: "test",
      buildTime: "2026-10-18T00:00:00Z",
      locale: "de",
      defaultLocale: "de",
      schemaSetDigest: "x",
      derivationSetDigest: "x",
      runtimeSnapshotId: null,
    },
    resolvedGraph: {
      business: { id: "business/acme", name: "Acme", type: "business" },
      products,
      places: {},
      contactPoints: {},
      webPresences: {},
      categories: {},
      catalogEntries: {},
      offerings: {},
      policies: {},
      claims: {},
      evidenceSources: {},
      disclosures: {},
      publicDocuments: {},
      ratePolicies: {},
      rateSnapshots: {},
    },
  } as unknown as PbpCompilerResult;
}

describe("projectToSemanticSiteProfile services projection", () => {
  it("maps service-kind products into organization.services", () => {
    const profile = projectToSemanticSiteProfile(
      graph({
        "product/info": {
          schema: "pbp/product@1",
          id: "product/info",
          type: "product",
          status: "published",
          kind: "service",
          name: "Informationsmaterial",
          summary: "Beschreibung des Unternehmens für Geschäftspartner.",
        },
      } as unknown as PbpResolvedGraph["products"]),
      "https://example.com/",
    );
    expect(profile.organization.services).toEqual([
      {
        id: "product/info",
        name: "Informationsmaterial",
        description: "Beschreibung des Unternehmens für Geschäftspartner.",
      },
    ]);
  });

  it("projects composite-service and skips non-service kinds", () => {
    const profile = projectToSemanticSiteProfile(
      graph({
        "product/composite": {
          id: "product/composite",
          kind: "composite-service",
          name: "Composite",
        },
        "product/good": { id: "product/good", kind: "physical-good", name: "Good" },
      } as unknown as PbpResolvedGraph["products"]),
      "https://example.com/",
    );
    expect(profile.organization.services).toEqual([{ id: "product/composite", name: "Composite" }]);
  });

  it("omits services entirely when no service products exist", () => {
    const profile = projectToSemanticSiteProfile(graph({}), "https://example.com/");
    expect(profile.organization.services).toBeUndefined();
  });
});
