/*
<MODULE_CONTRACT>
<purpose>Phase 7: Assembles the full Business profile graph from the entity index.</purpose>
<non-goals>
  <item>Does not apply runtime overlays — that is Phase 8 (overlays.ts).</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1328/AMD-005: isPublicPbpEntity gate at profile resolution — the resolved graph is the projection boundary; non-public entities stay in the entity index only.</item>
  <item>RFC-1097: step 6 — compass.migrate codemod run

Mechanical v1 to v2 header migration across the workspace: 942 files rewritten — CHANGE_SUMMARY windows collapsed into history, forbidden v1 blocks stripped, KEY_DECISIONS seeded from @ai-invariant comments (5 files) or TODO placeholders (103 files), blocks reordered to canonical order.</item>
  <item>RFC-1097: sweep — werkstatt-engine clean

Sweep batch 4: 73 Compass headers on headerless engine files (certification, component-runtime, isolation, evolution, testing), real KEY_DECISIONS on 75 files (kernel, cache, dht, swim, gitmesh, runtime), ~80 purpose expansions (CONTRACT-02/PURPOSE-02), non-goals on 13 CONTRACT-03 files, CS-07 history literal fix repo-wide (253 files). Policy: .template.ts/.template.astro excludedPaths. werkstatt-engine now 0 diagnostics.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

import type { PbpEntity } from "../envelope.ts";
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
import { isPublicPbpEntity } from "../publication.ts";
import type { PbpResolvedGraph } from "./types.ts";

export async function resolveProfile(index: Map<string, PbpEntity>): Promise<PbpResolvedGraph> {
  const sortedIds = [...index.keys()].sort();
  const byType = new Map<string, PbpEntity[]>();

  for (const id of sortedIds) {
    const entity = index.get(id)!;
    // RFC-1328 (AMD-005): the resolved graph is the projection boundary — only
    // public entities (status published, visibility not private) enter it. The
    // entity index still carries drafts for reference resolution and
    // validation; refs to non-public entities resolve to absent downstream.
    if (!isPublicPbpEntity(entity)) continue;
    const list = byType.get(entity.type) ?? [];
    list.push(entity);
    byType.set(entity.type, list);
  }

  const businesses = byType.get("business") ?? [];
  if (businesses.length === 0) {
    throw new Error("PBP-REF: No Business entity found in the entity index.");
  }

  const business = businesses[0] as unknown as PbpBusiness;
  const businessRecord = business as unknown as Record<string, unknown>;

  const legalIdentity = resolveRef(byType, businessRecord.legalIdentityRef) as
    PbpLegalIdentity | undefined;
  const brand = resolveRef(byType, businessRecord.brandRef) as PbpBrand | undefined;

  const places = collectByType(byType, "place") as Record<string, PbpPlace>;
  const contactPoints = collectByType(byType, "contact-point") as Record<string, PbpContactPoint>;
  const webPresences = collectByType(byType, "web-presence") as Record<string, PbpWebPresence>;
  const products = collectByType(byType, "product") as Record<string, PbpProduct>;
  const categories = collectByType(byType, "category") as Record<string, PbpCategory>;
  const catalog = (byType.get("catalog") ?? [])[0] as PbpCatalog | undefined;
  const catalogEntries = collectByType(byType, "catalog-entry") as Record<string, PbpCatalogEntry>;
  const offerings = collectByType(byType, "offering") as Record<string, PbpOffering>;
  const policies = collectByType(byType, "policy") as Record<string, PbpPolicy>;
  const claims = collectByType(byType, "claim") as Record<string, PbpClaim>;
  const evidenceSources = collectByType(byType, "evidence-source") as Record<
    string,
    PbpEvidenceSource
  >;
  const disclosures = collectByType(byType, "disclosure") as Record<string, PbpDisclosure>;
  const publicDocuments = collectByType(byType, "public-document") as Record<
    string,
    PbpPublicDocument
  >;
  const ratePolicies = collectByType(byType, "rate-policy") as Record<string, PbpRatePolicy>;
  const rateSnapshots = collectByType(byType, "rate-snapshot") as Record<string, PbpRateSnapshot>;

  return {
    business,
    legalIdentity,
    brand,
    places,
    contactPoints,
    webPresences,
    products,
    categories,
    catalog,
    catalogEntries,
    offerings,
    policies,
    claims,
    evidenceSources,
    disclosures,
    publicDocuments,
    ratePolicies,
    rateSnapshots,
  };
}

function resolveRef(byType: Map<string, PbpEntity[]>, refObj: unknown): PbpEntity | undefined {
  if (!refObj || typeof refObj !== "object") return undefined;
  const ref = (refObj as Record<string, unknown>).ref;
  if (typeof ref !== "string") return undefined;
  for (const entities of byType.values()) {
    for (const entity of entities) {
      if (entity.id === ref) return entity;
    }
  }
  return undefined;
}

function collectByType(byType: Map<string, PbpEntity[]>, type: string): Record<string, PbpEntity> {
  const result: Record<string, PbpEntity> = {};
  const entities = byType.get(type) ?? [];
  for (const entity of entities) {
    result[entity.id] = entity;
  }
  return result;
}
