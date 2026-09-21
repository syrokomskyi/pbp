/*
<MODULE_CONTRACT>
<purpose>Barrel export for all PBP entity contracts — canonical Zod schemas, inferred types, derived consts — plus the pbpSchemaById registry and pbpEntityDiscriminatedUnion aggregate (RFC-1102, DNA-103).</purpose>
<non-goals>
  <item>Does not declare entity shapes — each entity module owns its contract; this barrel only aggregates.</item>
  <item>Does not export infrastructure (envelope, primitives, entity-ref) — those stay in ../schemas/.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: created barrel — re-exports all 37 entity modules; relocated pbpSchemaById and pbpEntityDiscriminatedUnion from schemas/index.ts (DNA-103).</item>
</CHANGE_SUMMARY>
*/

import { z } from "zod";

// Entity contract modules — schema + z.infer types + derived consts (30 merged)
export * from "./brand.js";
export * from "./business.js";
export * from "./catalog.js";
export * from "./category.js";
export * from "./claim.js";
export * from "./client-testimonial.js";
export * from "./consent.js";
export * from "./contact-point.js";
export * from "./currency-pricing-policy.js";
export * from "./data-retention-policy.js";
export * from "./disclosure.js";
export * from "./evidence-source.js";
export * from "./exit-policy.js";
export * from "./guarantee-policy.js";
export * from "./legal-identity.js";
export * from "./offering.js";
export * from "./ownership-policy.js";
export * from "./place.js";
export * from "./policy.js";
export * from "./pricing.js";
export * from "./product.js";
export * from "./product-group.js";
export * from "./product-variant.js";
export * from "./public-document.js";
export * from "./rate-policy.js";
export * from "./rate-snapshot.js";
export * from "./rate-source.js";
export * from "./sla-policy.js";
export * from "./terms.js";
export * from "./web-presence.js";

// Types-only entity modules — no runtime schema (RFC-1102: nothing to merge)
export * from "./buyer-view-schema.js";
export * from "./comparison-profile.js";
export * from "./credential.js";
export * from "./fulfillment.js";
export * from "./machine-use-policy.js";
export * from "./review.js";
export * from "./tax.js";

// ---------------------------------------------------------------------------
// pbpSchemaById registry — maps schema ID strings to their Zod schemas
// ---------------------------------------------------------------------------

import { businessSchema as _business } from "./business.js";
import { legalIdentitySchema as _legalIdentity } from "./legal-identity.js";
import { brandSchema as _brand } from "./brand.js";
import { placeSchema as _place } from "./place.js";
import { contactPointSchema as _contactPoint } from "./contact-point.js";
import { webPresenceSchema as _webPresence } from "./web-presence.js";
import { categorySchema as _category } from "./category.js";
import { productSchema as _product } from "./product.js";
import { productGroupSchema as _productGroup } from "./product-group.js";
import { productVariantSchema as _productVariant } from "./product-variant.js";
import { catalogSchema as _catalog, catalogEntrySchema as _catalogEntry } from "./catalog.js";
import { offeringSchema as _offering } from "./offering.js";
import { policySchema as _policy } from "./policy.js";
import { slaPolicySchema as _slaPolicy } from "./sla-policy.js";
import { guaranteePolicySchema as _guaranteePolicy } from "./guarantee-policy.js";
import { ownershipPolicySchema as _ownershipPolicy } from "./ownership-policy.js";
import { exitPolicySchema as _exitPolicy } from "./exit-policy.js";
import { dataRetentionPolicySchema as _dataRetentionPolicy } from "./data-retention-policy.js";
import { claimSchema as _claim } from "./claim.js";
import { evidenceSourceSchema as _evidenceSource } from "./evidence-source.js";
import { disclosureSchema as _disclosure } from "./disclosure.js";
import { consentSchema as _consent } from "./consent.js";
import { clientTestimonialSchema as _clientTestimonial } from "./client-testimonial.js";
import { publicDocumentSchema as _publicDocument } from "./public-document.js";
import { pbpCurrencyPricingPolicySchema as _currencyPricingPolicy } from "./currency-pricing-policy.js";
import {
  pbpRatePolicySchema as _ratePolicy,
  pbpRateScheduleSchema as _rateSchedule,
} from "./rate-policy.js";
import { rateSnapshotSchema as _rateSnapshot } from "./rate-snapshot.js";
import { pbpRateSourceSchema as _rateSource } from "./rate-source.js";

import { pbpSchemaId } from "../schema-id.js";

export const pbpSchemaById: Record<string, z.ZodType> = {
  [pbpSchemaId("business")]: _business,
  [pbpSchemaId("legal-identity")]: _legalIdentity,
  [pbpSchemaId("brand")]: _brand,
  [pbpSchemaId("place")]: _place,
  [pbpSchemaId("contact-point")]: _contactPoint,
  [pbpSchemaId("web-presence")]: _webPresence,
  [pbpSchemaId("category")]: _category,
  [pbpSchemaId("product")]: _product,
  [pbpSchemaId("product-group")]: _productGroup,
  [pbpSchemaId("product-variant")]: _productVariant,
  [pbpSchemaId("catalog")]: _catalog,
  [pbpSchemaId("catalog-entry")]: _catalogEntry,
  [pbpSchemaId("offering")]: _offering,
  [pbpSchemaId("policy")]: _policy,
  [pbpSchemaId("sla-policy")]: _slaPolicy,
  [pbpSchemaId("guarantee-policy")]: _guaranteePolicy,
  [pbpSchemaId("ownership-policy")]: _ownershipPolicy,
  [pbpSchemaId("exit-policy")]: _exitPolicy,
  [pbpSchemaId("data-retention-policy")]: _dataRetentionPolicy,
  [pbpSchemaId("claim")]: _claim,
  [pbpSchemaId("evidence-source")]: _evidenceSource,
  [pbpSchemaId("disclosure")]: _disclosure,
  [pbpSchemaId("consent")]: _consent,
  [pbpSchemaId("client-testimonial")]: _clientTestimonial,
  [pbpSchemaId("public-document")]: _publicDocument,
  [pbpSchemaId("currency-pricing-policy")]: _currencyPricingPolicy,
  [pbpSchemaId("rate-policy")]: _ratePolicy,
  [pbpSchemaId("rate-schedule")]: _rateSchedule,
  [pbpSchemaId("rate-snapshot")]: _rateSnapshot,
  [pbpSchemaId("rate-source")]: _rateSource,
};

// ---------------------------------------------------------------------------
// Discriminated union on the `schema` field for collection-level validation
// ---------------------------------------------------------------------------

export const pbpEntityDiscriminatedUnion = z.discriminatedUnion("schema", [
  _business,
  _legalIdentity,
  _brand,
  _place,
  _contactPoint,
  _webPresence,
  _category,
  _product,
  _productGroup,
  _productVariant,
  _catalog,
  _catalogEntry,
  _offering,
  _policy,
  _slaPolicy,
  _guaranteePolicy,
  _ownershipPolicy,
  _exitPolicy,
  _dataRetentionPolicy,
  _claim,
  _evidenceSource,
  _disclosure,
  _consent,
  _clientTestimonial,
  _publicDocument,
  _currencyPricingPolicy,
  _ratePolicy,
  _rateSchedule,
  _rateSnapshot,
  _rateSource,
]);
