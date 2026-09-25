/*
<MODULE_CONTRACT>
<purpose>Internal compiler types for the PBP 14-phase pipeline for the werkstatt-site domain layer (RFC-0467).</purpose>
<non-goals>
  <item>Does not define compiler phase contract types — those are in compiler-pipeline.ts (RFC-0428).</item>
  <item>Does not define entity types — those are in src/entities/.</item>
  <item>Does not define validation error types — those are in src/validation-errors.ts.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: step 6 — compass.migrate codemod run

Mechanical v1 to v2 header migration across the workspace: 942 files rewritten — CHANGE_SUMMARY windows collapsed into history, forbidden v1 blocks stripped, KEY_DECISIONS seeded from @ai-invariant comments (5 files) or TODO placeholders (103 files), blocks reordered to canonical order.</item>
  <item>RFC-1097: sweep — werkstatt-engine clean

Sweep batch 4: 73 Compass headers on headerless engine files (certification, component-runtime, isolation, evolution, testing), real KEY_DECISIONS on 75 files (kernel, cache, dht, swim, gitmesh, runtime), ~80 purpose expansions (CONTRACT-02/PURPOSE-02), non-goals on 13 CONTRACT-03 files, CS-07 history literal fix repo-wide (253 files). Policy: .template.ts/.template.astro excludedPaths. werkstatt-engine now 0 diagnostics.</item>
  <item>RFC-1097: sweep — werkstatt-site clean, zero diagnostics workspace-wide

Sweep batch 5: 90 Compass headers on headerless site files (PBP entities/projections/schemas, .d.ts, .css, barrels), 211 non-goals (CONTRACT-03, mostly re-export shims), ~265 purpose expansions (CONTRACT-02/PURPOSE-02), 2 CHANGE_SUMMARY additions, boilerplate purpose rewrite. Policy: domain/ui/icons/gen excludedPath (2326 generated-icon diags), .template.css excludedPath, .e2e.config.ts testPattern. compass.validate --mode error now returns 0 diagnostics across the whole workspace.</item>
</CHANGE_SUMMARY>
*/

import type { PbpBuildContext, PbpBuildStrictness } from "../compiler-pipeline.js";
import type { PbpSourceInventoryReport } from "../compiler-pipeline.js";
import type { PbpEntity } from "../envelope.ts";
import type { PbpEntityRef } from "../entity-ref.ts";
import type { PbpBusiness } from "../entities/business.ts";
import type { PbpLegalIdentity } from "../entities/legal-identity.ts";
import type { PbpBrand } from "../entities/brand.ts";
import type { PbpPlace } from "../entities/place.ts";
import type { PbpContactPoint } from "../entities/contact-point.ts";
import type { PbpWebPresence } from "../entities/web-presence.ts";
import type { PbpProduct } from "../entities/product.ts";
import type { PbpCatalog, PbpCatalogEntry } from "../entities/catalog.ts";
import type { PbpOffering } from "../entities/offering.ts";
import type { PbpPolicy } from "../entities/policy.ts";
import type { PbpClaim } from "../entities/claim.ts";
import type { PbpEvidenceSource } from "../entities/evidence-source.ts";
import type { PbpDisclosure } from "../entities/disclosure.ts";
import type { PbpPublicDocument } from "../entities/public-document.ts";
import type { PbpCategory } from "../entities/category.ts";
import type { PbpRatePolicy } from "../entities/rate-policy.ts";
import type { PbpRateSnapshot } from "../entities/rate-snapshot.ts";
import type { PbpDerivationContract, PbpDerivationResult } from "../derivation.js";
import type { PbpFallbackReport } from "../locale.js";
import type { PbpGraphIntegrityError, PbpCycleCheckResult } from "../reference-resolution.js";
import type { PbpValidationError } from "../validation-errors.js";
import type { PbpBuyerViewSection } from "../entities/buyer-view-schema.ts";
import type { PbpWebsiteProjection } from "../projections/website.js";
import type { PbpAiAnswerProjection } from "../projections/ai-answer.js";
import type { PbpPublicationSnapshot } from "../publication.js";
import type { PbpMaterializedDerivedPrice } from "../materialized-derived-price.js";
import type { WorkspaceIO } from "@warpgogol/werkstatt-shared/kernel/workspace-io";

export interface PbpCompilerInput {
  sourceDirectory: string;
  locale: string;
  defaultLocale: string;
  strictness: PbpBuildStrictness;
  derivations?: PbpDerivationContract[];
  buyerViewSchemaRef?: PbpEntityRef;
  buildTime?: string;
  /** RFC-1075: site origin URL for canonical URI derivation. When absent, no @id is emitted. */
  siteOrigin?: string;
  /** RFC-1149: WorkspaceIO port for filesystem/process work. Defaults to createDefaultIO() at entry points. */
  io?: WorkspaceIO;
}

export interface PbpResolvedGraph {
  business: PbpBusiness;
  legalIdentity?: PbpLegalIdentity;
  brand?: PbpBrand;
  places: Record<string, PbpPlace>;
  contactPoints: Record<string, PbpContactPoint>;
  webPresences: Record<string, PbpWebPresence>;
  products: Record<string, PbpProduct>;
  categories: Record<string, PbpCategory>;
  catalog?: PbpCatalog;
  catalogEntries: Record<string, PbpCatalogEntry>;
  offerings: Record<string, PbpOffering>;
  policies: Record<string, PbpPolicy>;
  claims: Record<string, PbpClaim>;
  evidenceSources: Record<string, PbpEvidenceSource>;
  disclosures: Record<string, PbpDisclosure>;
  publicDocuments: Record<string, PbpPublicDocument>;
  ratePolicies: Record<string, PbpRatePolicy>;
  rateSnapshots: Record<string, PbpRateSnapshot>;
  derivedPrices?: Record<string, PbpMaterializedDerivedPrice[]>;
}

export interface PbpBuyerView {
  schemaRef: PbpEntityRef;
  sections: Record<string, PbpBuyerViewSection>;
}

export interface PbpProjectionSet {
  website: PbpWebsiteProjection[];
  aiAnswer: PbpAiAnswerProjection[];
  schemaOrg: Record<string, unknown>;
}

export interface PbpCompilerResult {
  context: PbpBuildContext;
  inventory: PbpSourceInventoryReport;
  entityIndex: Map<string, PbpEntity>;
  resolvedGraph: PbpResolvedGraph;
  fallbackReport: PbpFallbackReport;
  graphErrors: PbpGraphIntegrityError[];
  cycleResults: PbpCycleCheckResult[];
  validationErrors: PbpValidationError[];
  derivationResults: PbpDerivationResult[];
  buyerView?: PbpBuyerView;
  projections: PbpProjectionSet;
  publication?: PbpPublicationSnapshot;
}

export type PartialCompilerResult = Partial<PbpCompilerResult>;
