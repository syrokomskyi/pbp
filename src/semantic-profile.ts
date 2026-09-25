/*
<MODULE_CONTRACT>
<purpose>PBP semantic profile adapter — maps PBP compiler output to SemanticSiteProfile (RFC-0469).</purpose>
<non-goals>
  <item>Does not define SemanticSiteProfile — that lives in @warpgogol/werkstatt-shared/semantic.</item>
  <item>Does not implement the compiler — delegates to @warpgogol/werkstatt-site/pbp/compiler.</item>
  <item>Does not handle page-level semantic models — use buildPbpPageSemanticModel instead.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-0743: added loadTargetCurrencies — extracts target currencies from CurrencyPricingPolicy, compiler errors propagate (review fix E-1).</item>
  <item>RFC-1075: populate canonicalUri on SemanticOffer from offering entity ID.</item>
  <item>RFC-1097: step 6 — compass.migrate codemod run

Mechanical v1 to v2 header migration across the workspace: 942 files rewritten — CHANGE_SUMMARY windows collapsed into history, forbidden v1 blocks stripped, KEY_DECISIONS seeded from @ai-invariant comments (5 files) or TODO placeholders (103 files), blocks reordered to canonical order.</item>
  <item>RFC-1097: sweep — werkstatt-engine clean

Sweep batch 4: 73 Compass headers on headerless engine files (certification, component-runtime, isolation, evolution, testing), real KEY_DECISIONS on 75 files (kernel, cache, dht, swim, gitmesh, runtime), ~80 purpose expansions (CONTRACT-02/PURPOSE-02), non-goals on 13 CONTRACT-03 files, CS-07 history literal fix repo-wide (253 files). Policy: .template.ts/.template.astro excludedPaths. werkstatt-engine now 0 diagnostics.</item>
</CHANGE_SUMMARY>
*/

import { join } from "node:path";
import { createDefaultIO, type WorkspaceIO } from "@warpgogol/werkstatt-shared/kernel/workspace-io";
import {
  buildOrganizationProfile,
  type SemanticSiteProfile,
} from "@warpgogol/werkstatt-shared/semantic";
import { deriveCanonicalUri } from "@warpgogol/werkstatt-shared/semantic/canonical-uri";
import { compilePbpProfile } from "./compiler/index.js";
import type { PbpCompilerResult } from "./compiler/types.js";

async function resolveSourceDirectory(sourceDirectory: string, io: WorkspaceIO): Promise<string> {
  if (await io.exists(sourceDirectory)) return sourceDirectory;
  const fallback = join(process.cwd(), "src/content/business-profile");
  if (await io.exists(fallback)) return fallback;
  return sourceDirectory;
}

// RFC-1119: buildPageSemanticModel stays in the Astro adapter — import it from
// @warpgogol/werkstatt-site/pbp/semantic-model (it uses astro:content + import.meta.glob).

export type { SemanticSiteProfile };

export async function loadTargetCurrencies(
  sourceDirectory: string,
  locale: string,
  io: WorkspaceIO = createDefaultIO().io,
): Promise<Array<{ code: string; label: string }>> {
  const resolvedDirectory = await resolveSourceDirectory(sourceDirectory, io);
  const result = await compilePbpProfile({
    sourceDirectory: resolvedDirectory,
    locale,
    defaultLocale: "de",
    strictness: "production",
    io,
  });
  for (const entity of result.entityIndex.values()) {
    if (entity.type === "currency-pricing-policy") {
      const policy = entity as unknown as {
        baseCurrency: string;
        targetCurrencies: Record<string, { currency: string }>;
      };
      const targets = Object.values(policy.targetCurrencies).map((t) => ({
        code: t.currency,
        label: t.currency,
      }));
      return [{ code: policy.baseCurrency, label: policy.baseCurrency }, ...targets];
    }
  }
  return [];
}

export async function buildPbpSemanticProfile(
  locale: string,
  siteUrl: URL | string,
  sourceDirectory: string,
  io: WorkspaceIO = createDefaultIO().io,
): Promise<SemanticSiteProfile> {
  const resolvedDirectory = await resolveSourceDirectory(sourceDirectory, io);

  const result = await compilePbpProfile({
    sourceDirectory: resolvedDirectory,
    locale,
    defaultLocale: "de",
    strictness: "production",
    io,
  });

  return projectToSemanticSiteProfile(result, siteUrl);
}

export function projectToSemanticSiteProfile(
  result: PbpCompilerResult,
  siteUrl: URL | string,
): SemanticSiteProfile {
  const graph = result.resolvedGraph;
  const business = graph.business as unknown as Record<string, unknown>;
  const businessName = (business.name as string) ?? "";
  const description = (business.description as string) ?? (business.summary as string) ?? "";
  const foundingYear = business.yearEstablished ? String(business.yearEstablished) : undefined;

  const legalIdentity = graph.legalIdentity as unknown as Record<string, unknown> | undefined;
  const legalName = legalIdentity?.legalName as string | undefined;
  const responsiblePerson = legalIdentity?.responsiblePerson as Record<string, unknown> | undefined;
  const representativeName = responsiblePerson?.name as string | undefined;

  const place = Object.values(graph.places)[0] as unknown as Record<string, unknown> | undefined;
  const address = place?.address as Record<string, unknown> | undefined;

  const contactPoint = Object.values(graph.contactPoints)[0] as unknown as
    Record<string, unknown> | undefined;
  const email = contactPoint?.value as string | undefined;
  const contactType = contactPoint?.channel as string | undefined;

  // RFC-0530: Extract externalIdentifiers from Business and convert to sameAs URLs.
  const businessExternalIds = (business.externalIdentifiers ?? {}) as Record<
    string,
    { schemeRef: string; value: string }
  >;
  const businessSameAs = Object.values(businessExternalIds).map(
    (id) => `${id.schemeRef}${id.value}`,
  );

  // RFC-0530: Extract sameAs from social-profile WebPresence entities.
  const webPresenceSameAs = Object.values(graph.webPresences)
    .filter((wp) => (wp as unknown as Record<string, unknown>).kind === "social-profile")
    .flatMap(
      (wp) => ((wp as unknown as Record<string, unknown>).sameAs as string[] | undefined) ?? [],
    );

  const sameAs = [...businessSameAs, ...webPresenceSameAs];

  const offerings = Object.values(graph.offerings).sort((a, b) => {
    const aPricing = (a as unknown as Record<string, unknown>).pricing as
      Record<string, unknown> | undefined;
    const bPricing = (b as unknown as Record<string, unknown>).pricing as
      Record<string, unknown> | undefined;
    const aCharges = Object.keys((aPricing?.charges as Record<string, unknown>) || {}).length;
    const bCharges = Object.keys((bPricing?.charges as Record<string, unknown>) || {}).length;
    if (bCharges !== aCharges) return bCharges - aCharges;
    return a.id.localeCompare(b.id);
  });
  const firstOffering = offerings[0] as unknown as Record<string, unknown> | undefined;
  const pricing = firstOffering?.pricing as Record<string, unknown> | undefined;
  const charges = pricing?.charges as Record<string, unknown> | undefined;

  const monthlyCharge = charges?.monthlySubscription as Record<string, unknown> | undefined;
  const monthlyAmount = (monthlyCharge?.amount as Record<string, unknown>)?.value as
    string | undefined;
  const yearlyCharge = charges?.yearlySubscription as Record<string, unknown> | undefined;
  const yearlyAmount = (yearlyCharge?.amount as Record<string, unknown>)?.value as
    string | undefined;
  const setupCharge = charges?.activation as Record<string, unknown> | undefined;
  const setupAmount = (setupCharge?.amount as Record<string, unknown>)?.value as string | undefined;
  const currency = pricing?.currency as string | undefined;

  const offer = firstOffering
    ? {
        canonicalUri: deriveCanonicalUri(
          typeof siteUrl === "string" ? siteUrl : siteUrl.toString(),
          "offering",
          (firstOffering as Record<string, unknown>).id as string | undefined,
        ),
        prices: [
          ...(monthlyAmount
            ? [
                {
                  id: "monthly",
                  label: "Monatlich",
                  amount: `${monthlyAmount} ${currency ?? "EUR"}`,
                },
              ]
            : []),
          ...(yearlyAmount
            ? [
                {
                  id: "yearly",
                  label: "Jährlich",
                  amount: `${yearlyAmount} ${currency ?? "EUR"}`,
                },
              ]
            : []),
          ...(setupAmount
            ? [
                {
                  id: "setup",
                  label: "Setup",
                  amount: `${setupAmount} ${currency ?? "EUR"}`,
                },
              ]
            : []),
        ],
      }
    : undefined;

  return buildOrganizationProfile({
    lang: result.context.locale,
    siteUrl,
    brandName: businessName,
    description,
    foundingYear,
    founders: [],
    boardMembers: [],
    legalName,
    representativeName,
    ...(address
      ? {
          address: {
            street: address.street as string | undefined,
            streetNumber: address.streetNumber as string | undefined,
            zip: address.postalCode as string | undefined,
            city: address.locality as string | undefined,
            country: address.countryCode as string | undefined,
          },
        }
      : {}),
    email,
    contactType,
    ...(offer ? { offer: offer as unknown as SemanticSiteProfile["organization"]["offer"] } : {}),
    schemaType: ["Organization", "ProfessionalService"],
    ...(sameAs.length ? { sameAs } : {}),
  });
}
