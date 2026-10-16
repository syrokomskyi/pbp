# `@warpgogol/pbp` — Agent Guide

RFC-1119: Framework-free Public Business Profile domain layer extracted from `@warpgogol/werkstatt-site`. Owns PBP entity contracts (DNA-103), the compiler pipeline, derivations, projections, and rate adapters.

**Workspace type:** Package

## Boundary rules

- This package MUST NOT import `astro`, `astro:*`, or `@astrojs/*` — it is framework-free.
- This package MUST NOT import from `@warpgogol/werkstatt-site` or `@warpgogol/werkstatt-engine` — it is a leaf domain package depending only on `@warpgogol/werkstatt-shared` and declared deps.
- The Astro adapter surface (`astro:content` collections, `PbpContentSource` implementation) lives in `@warpgogol/werkstatt-site/pbp/astro` — never here.
- PBP entity contracts are single-sourced in `src/entities/<name>.ts` (DNA-103): the Zod schema is canonical, the entity type is `z.infer<typeof schema>`, and `PBP_*` const arrays derive from the schema's `.options`. Never declare a parallel `interface PbpX` duplicating a schema's shape.

## Contract-term canonical homes (RFC-1155)

Contract terms live in exactly one canonical field — prose and documents bind to them via `=(business-profile.<collection>/<slug>.<field>)` expressions (render durations with the `| duration` pipe formatter, RFC-1156). `pbp.terms-reference.validate` (sites-check pipeline, warn-level; `--strict` promotes to blocking) detects literal drift (TERMS-DRIFT-01), dangling references (TERMS-DRIFT-02) and policy slug/kind mismatches (TERMS-KIND-01). Agents MUST place new contract terms in the canonical home below — never inline into prose.

| Policy file (slug) | Kind | Terms hosted |
| --- | --- | --- |
| `policies/cancellation.md` | `cancellation` | `ordinaryNotice.period`, `ordinaryNotice.effective`, `extraordinaryNotice.period`, `paymentDefault.gracePeriod`, `paymentDefault.consolidationInterval` |
| `policies/price-changes.md` | `price-changes` | `priceFixPeriod`, `announcementNotice`, `exitRight` |
| `policies/liability.md` | `liability` | `cap.basis`, `cap.period`, `cap.exclusions[]` |
| `policies/partner-program.md` | `partner-program` | `trustedPartners.*`, `referral.*`, `referredCustomerBenefit.*` |
| `policies/portability.md` | `portability` | `exportPackageRef`, `continuity.*` |
| `policies/renewal.md` | `renewal` | `renewalPeriod`, `reminder` |
| `policies/sla.md` | `service-level` | `objectives.*`, `remedies.*` (existing, RFC-0439) |
| `policies/support-response.md` | `service-level` | `objectives.*` (response window), `terms.responseWithin` |
| `policies/small-changes.md` | `service-level` | `objectives.*` (small-change window), `terms.maxEffort` |
| `policies/availability-sla.md` | `service-level` | `objectives.*` (uptime), `terms.downtimeThreshold`, `terms.maintenanceWindow` |
| `policies/delivery-guarantee.md` | `guarantee` | `objectives.*` (delivery window), `terms.acceptanceReminder`, `terms.acceptanceDeadline` |
| `policies/exit-package.md` | `exit` | `deliveryTarget.duration` |
| `policies/warranty.md` | `guarantee` | `terms.fixedPriceWarranty`, `terms.subscriptionWarranty` |
| `policies/data-retention.md` | `data-retention` | `retention.*` — the Datenschutz retention matrix (technicalLogs, matomo, unprocessedRequest, rejectedProspect, activeOffer, projectMaterials, correspondence, accounting, aiAgentLogs, chatRecords, redisEventId, crmBuffer, makeLogs, projectArchive) |
| `policies/backup-retention.md` | `data-retention` | `retention.backups`, `terms.restoreTarget` |
| `business.md` | — | `presentation.businessHours`, `presentation.businessDays`, `presentation.holidaysRegion` (per-lang display strings) |
| `offerings/*.md` | — | `terms.paymentDue` (invoice payment-due period per offering) |
| `documents/terms.md` | — | `terms.amendmentNotice`, `terms.preLitigationPeriod`, `presentation.version`, `presentation.dates.*` |
| `documents/*.md` | any document kind | `terms.*` record (e.g. `terms.preLitigationPeriod`, `terms.amendmentNotice`) |

Duration bindings inside case-governing prepositional phrases MUST carry `case=` on the `| duration` pipe (nominative|accusative|genitive|dative): de `nach`/`innerhalb von`/`von`/`bis zu` → `dative`; uk `протягом`/`до`/`після` → `genitive`, `за`/`через`/`понад`/`на` → `accusative` (uk numeral-governed: few → nom.pl form, many → gen.pl form). `short` style never inflects; missing forms fall back to nominative.

## Timing semantics (RFC-1293)

The base `policySchema` carries an optional `timing` map (`pbpTimingSchema`, `entities/policy-timing.ts`): keys are dot paths to time-bound fields inside the entity frontmatter (e.g. `objective.threshold`), values declare `startEvent`, `clock` (`calendar`|`business`), `timezone` (IANA), optional `businessHours`, and `boundary`. `pbp.content.validate` (werkstatt-site) emits PBP-TIMING-01..04 for time-bound fields without timing — the `TIMED_FIELDS` registry in `packages/werkstatt-site/src/checks/lib/pbp-timing.ts` covers structured `{value, unitRef}` fields per schema id, and an ISO-8601 sweep catches all other duration literals. **Adding a policy schema with a new structured-unit field shape requires a `TIMED_FIELDS` entry** — update the registry in the same change. Timing values are owner decisions; agents never author them.

## Scripts

| Script        | Command                                   |
| ------------- | ----------------------------------------- |
| `lint`        | `pnpm exec eslint "src/**/*.ts"`          |
| `typecheck`   | `pnpm exec tsc -p tsconfig.json --noEmit` |
| `build`       | `pnpm exec tsc -p tsconfig.json --noEmit` |
| `build:check` | `pnpm exec tsc -p tsconfig.json --noEmit` |
| `test`        | `vitest run`                              |
