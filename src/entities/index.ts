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
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

import { z } from "zod";

// Entity contract modules — schema + z.infer types + derived consts (30 merged)
export * from "./brand.ts";
export * from "./business.ts";
export * from "./cancellation-policy.ts";
export * from "./catalog.ts";
export * from "./category.ts";
export * from "./claim.ts";
export * from "./client-testimonial.ts";
export * from "./consent.ts";
export * from "./contact-point.ts";
export * from "./currency-pricing-policy.ts";
export * from "./data-retention-policy.ts";
export * from "./disclosure.ts";
export * from "./evidence-source.ts";
export * from "./exit-policy.ts";
export * from "./guarantee-policy.ts";
export * from "./legal-identity.ts";
export * from "./liability-policy.ts";
export * from "./offering.ts";
export * from "./ownership-policy.ts";
export * from "./partner-program-policy.ts";
export * from "./place.ts";
export * from "./policy.ts";
export * from "./portability-policy.ts";
export * from "./price-changes-policy.ts";
export * from "./pricing.ts";
export * from "./product.ts";
export * from "./product-group.ts";
export * from "./product-variant.ts";
export * from "./public-document.ts";
export * from "./rate-policy.ts";
export * from "./rate-snapshot.ts";
export * from "./rate-source.ts";
export * from "./renewal-policy.ts";
export * from "./sla-policy.ts";
export * from "./terms.ts";
export * from "./web-presence.ts";

// Types-only entity modules — no runtime schema (RFC-1102: nothing to merge)
export * from "./buyer-view-schema.ts";
export * from "./comparison-profile.ts";
export * from "./credential.ts";
export * from "./fulfillment.ts";
export * from "./machine-use-policy.ts";
export * from "./review.ts";
export * from "./tax.ts";

// ---------------------------------------------------------------------------
// pbpSchemaById registry — maps schema ID strings to their Zod schemas
// ---------------------------------------------------------------------------

import { businessSchema as _business } from "./business.ts";
import { legalIdentitySchema as _legalIdentity } from "./legal-identity.ts";
import { brandSchema as _brand } from "./brand.ts";
import { placeSchema as _place } from "./place.ts";
import { contactPointSchema as _contactPoint } from "./contact-point.ts";
import { webPresenceSchema as _webPresence } from "./web-presence.ts";
import { categorySchema as _category } from "./category.ts";
import { productSchema as _product } from "./product.ts";
import { productGroupSchema as _productGroup } from "./product-group.ts";
import { productVariantSchema as _productVariant } from "./product-variant.ts";
import { catalogSchema as _catalog, catalogEntrySchema as _catalogEntry } from "./catalog.ts";
import { offeringSchema as _offering } from "./offering.ts";
import { policySchema as _policy } from "./policy.ts";
import { slaPolicySchema as _slaPolicy } from "./sla-policy.ts";
import { guaranteePolicySchema as _guaranteePolicy } from "./guarantee-policy.ts";
import { ownershipPolicySchema as _ownershipPolicy } from "./ownership-policy.ts";
import { exitPolicySchema as _exitPolicy } from "./exit-policy.ts";
import { dataRetentionPolicySchema as _dataRetentionPolicy } from "./data-retention-policy.ts";
import { cancellationPolicySchema as _cancellationPolicy } from "./cancellation-policy.ts";
import { liabilityPolicySchema as _liabilityPolicy } from "./liability-policy.ts";
import { partnerProgramPolicySchema as _partnerProgramPolicy } from "./partner-program-policy.ts";
import { portabilityPolicySchema as _portabilityPolicy } from "./portability-policy.ts";
import { priceChangesPolicySchema as _priceChangesPolicy } from "./price-changes-policy.ts";
import { renewalPolicySchema as _renewalPolicy } from "./renewal-policy.ts";
import { claimSchema as _claim } from "./claim.ts";
import { evidenceSourceSchema as _evidenceSource } from "./evidence-source.ts";
import { disclosureSchema as _disclosure } from "./disclosure.ts";
import { consentSchema as _consent } from "./consent.ts";
import { clientTestimonialSchema as _clientTestimonial } from "./client-testimonial.ts";
import { publicDocumentSchema as _publicDocument } from "./public-document.ts";
import { pbpCurrencyPricingPolicySchema as _currencyPricingPolicy } from "./currency-pricing-policy.ts";
import {
  pbpRatePolicySchema as _ratePolicy,
  pbpRateScheduleSchema as _rateSchedule,
} from "./rate-policy.ts";
import { rateSnapshotSchema as _rateSnapshot } from "./rate-snapshot.ts";
import { pbpRateSourceSchema as _rateSource } from "./rate-source.ts";

import { pbpSchemaId } from "../schema-id.ts";

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
  [pbpSchemaId("cancellation-policy")]: _cancellationPolicy,
  [pbpSchemaId("liability-policy")]: _liabilityPolicy,
  [pbpSchemaId("partner-program-policy")]: _partnerProgramPolicy,
  [pbpSchemaId("portability-policy")]: _portabilityPolicy,
  [pbpSchemaId("price-changes-policy")]: _priceChangesPolicy,
  [pbpSchemaId("renewal-policy")]: _renewalPolicy,
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
  _cancellationPolicy,
  _liabilityPolicy,
  _partnerProgramPolicy,
  _portabilityPolicy,
  _priceChangesPolicy,
  _renewalPolicy,
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
