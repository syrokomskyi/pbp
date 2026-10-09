/*
<MODULE_CONTRACT>
<purpose>Conformance test for RFC-1102 / DNA-103 — asserts each paired entity's exported type is bidirectionally identical to its Zod schema's z.infer output, and that pbpSchemaById enumerates exactly the 30 registered schema IDs.</purpose>
<non-goals>
  <item>Does not test validation behavior — per-entity *.schema.test.ts files cover parsing.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1102: created — type-identity assertions for all 30 paired entities (AC-3).</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

import { describe, it, expect, expectTypeOf } from "vitest";
import type { z } from "zod";

import { pbpSchemaById } from "./index.ts";

import { brandSchema, type PbpBrand } from "./brand.ts";
import { businessSchema, type PbpBusiness } from "./business.ts";
import {
  catalogSchema,
  catalogEntrySchema,
  type PbpCatalog,
  type PbpCatalogEntry,
} from "./catalog.ts";
import { categorySchema, type PbpCategory } from "./category.ts";
import { claimSchema, type PbpClaim } from "./claim.ts";
import { clientTestimonialSchema, type PbpClientTestimonial } from "./client-testimonial.ts";
import { consentSchema, type PbpConsent } from "./consent.ts";
import { contactPointSchema, type PbpContactPoint } from "./contact-point.ts";
import {
  pbpCurrencyPricingPolicySchema,
  type PbpCurrencyPricingPolicy,
} from "./currency-pricing-policy.ts";
import { dataRetentionPolicySchema, type PbpDataRetentionPolicy } from "./data-retention-policy.ts";
import { disclosureSchema, type PbpDisclosure } from "./disclosure.ts";
import { evidenceSourceSchema, type PbpEvidenceSource } from "./evidence-source.ts";
import { exitPolicySchema, type PbpExitPolicy } from "./exit-policy.ts";
import { guaranteePolicySchema, type PbpGuaranteePolicy } from "./guarantee-policy.ts";
import { legalIdentitySchema, type PbpLegalIdentity } from "./legal-identity.ts";
import { offeringSchema, type PbpOffering } from "./offering.ts";
import { ownershipPolicySchema, type PbpOwnershipPolicy } from "./ownership-policy.ts";
import { placeSchema, type PbpPlace } from "./place.ts";
import { policySchema, type PbpPolicy } from "./policy.ts";
import {
  pbpChargeSchema,
  pbpPlanSchema,
  pbpAdjustmentSchema,
  pbpExternalCostSchema,
  type PbpCharge,
  type PbpPlan,
  type PbpAdjustment,
  type PbpExternalCost,
} from "./pricing.ts";
import { productSchema, type PbpProduct } from "./product.ts";
import { productGroupSchema, type PbpProductGroup } from "./product-group.ts";
import { productVariantSchema, type PbpProductVariant } from "./product-variant.ts";
import { publicDocumentSchema, type PbpPublicDocument } from "./public-document.ts";
import {
  pbpRatePolicySchema,
  pbpRateScheduleSchema,
  type PbpRatePolicy,
  type PbpRateSchedule,
} from "./rate-policy.ts";
import { rateSnapshotSchema, type PbpRateSnapshot } from "./rate-snapshot.ts";
import { pbpRateSourceSchema, type PbpRateSource } from "./rate-source.ts";
import { slaPolicySchema, type PbpServiceLevelPolicy } from "./sla-policy.ts";
import { pbpTermsSchema, type PbpTerms } from "./terms.ts";
import { webPresenceSchema, type PbpWebPresence } from "./web-presence.ts";

describe("entity-schema conformance (RFC-1102, DNA-103)", () => {
  it("pbpSchemaById enumerates exactly the 36 registered schema IDs", () => {
    expect(Object.keys(pbpSchemaById)).toHaveLength(36);
  });

  it("entity types are z.infer of their canonical schemas", () => {
    expectTypeOf<PbpBrand>().toEqualTypeOf<z.infer<typeof brandSchema>>();
    expectTypeOf<PbpBusiness>().toEqualTypeOf<z.infer<typeof businessSchema>>();
    expectTypeOf<PbpCatalog>().toEqualTypeOf<z.infer<typeof catalogSchema>>();
    expectTypeOf<PbpCatalogEntry>().toEqualTypeOf<z.infer<typeof catalogEntrySchema>>();
    expectTypeOf<PbpCategory>().toEqualTypeOf<z.infer<typeof categorySchema>>();
    expectTypeOf<PbpClaim>().toEqualTypeOf<z.infer<typeof claimSchema>>();
    expectTypeOf<PbpClientTestimonial>().toEqualTypeOf<z.infer<typeof clientTestimonialSchema>>();
    expectTypeOf<PbpConsent>().toEqualTypeOf<z.infer<typeof consentSchema>>();
    expectTypeOf<PbpContactPoint>().toEqualTypeOf<z.infer<typeof contactPointSchema>>();
    expectTypeOf<PbpCurrencyPricingPolicy>().toEqualTypeOf<
      z.infer<typeof pbpCurrencyPricingPolicySchema>
    >();
    expectTypeOf<PbpDataRetentionPolicy>().toEqualTypeOf<
      z.infer<typeof dataRetentionPolicySchema>
    >();
    expectTypeOf<PbpDisclosure>().toEqualTypeOf<z.infer<typeof disclosureSchema>>();
    expectTypeOf<PbpEvidenceSource>().toEqualTypeOf<z.infer<typeof evidenceSourceSchema>>();
    expectTypeOf<PbpExitPolicy>().toEqualTypeOf<z.infer<typeof exitPolicySchema>>();
    expectTypeOf<PbpGuaranteePolicy>().toEqualTypeOf<z.infer<typeof guaranteePolicySchema>>();
    expectTypeOf<PbpLegalIdentity>().toEqualTypeOf<z.infer<typeof legalIdentitySchema>>();
    expectTypeOf<PbpOffering>().toEqualTypeOf<z.infer<typeof offeringSchema>>();
    expectTypeOf<PbpOwnershipPolicy>().toEqualTypeOf<z.infer<typeof ownershipPolicySchema>>();
    expectTypeOf<PbpPlace>().toEqualTypeOf<z.infer<typeof placeSchema>>();
    expectTypeOf<PbpPolicy>().toEqualTypeOf<z.infer<typeof policySchema>>();
    expectTypeOf<PbpCharge>().toEqualTypeOf<z.infer<typeof pbpChargeSchema>>();
    expectTypeOf<PbpPlan>().toEqualTypeOf<z.infer<typeof pbpPlanSchema>>();
    expectTypeOf<PbpAdjustment>().toEqualTypeOf<z.infer<typeof pbpAdjustmentSchema>>();
    expectTypeOf<PbpExternalCost>().toEqualTypeOf<z.infer<typeof pbpExternalCostSchema>>();
    expectTypeOf<PbpProduct>().toEqualTypeOf<z.infer<typeof productSchema>>();
    expectTypeOf<PbpProductGroup>().toEqualTypeOf<z.infer<typeof productGroupSchema>>();
    expectTypeOf<PbpProductVariant>().toEqualTypeOf<z.infer<typeof productVariantSchema>>();
    expectTypeOf<PbpPublicDocument>().toEqualTypeOf<z.infer<typeof publicDocumentSchema>>();
    expectTypeOf<PbpRatePolicy>().toEqualTypeOf<z.infer<typeof pbpRatePolicySchema>>();
    expectTypeOf<PbpRateSchedule>().toEqualTypeOf<z.infer<typeof pbpRateScheduleSchema>>();
    expectTypeOf<PbpRateSnapshot>().toEqualTypeOf<z.infer<typeof rateSnapshotSchema>>();
    expectTypeOf<PbpRateSource>().toEqualTypeOf<z.infer<typeof pbpRateSourceSchema>>();
    expectTypeOf<PbpServiceLevelPolicy>().toEqualTypeOf<z.infer<typeof slaPolicySchema>>();
    expectTypeOf<PbpTerms>().toEqualTypeOf<z.infer<typeof pbpTermsSchema>>();
    expectTypeOf<PbpWebPresence>().toEqualTypeOf<z.infer<typeof webPresenceSchema>>();
  });
});
