# `@warpgogol/pbp` — Agent Guide

RFC-1119: Framework-free Public Business Profile domain layer extracted from `@warpgogol/werkstatt-site`. Owns PBP entity contracts (DNA-103), the compiler pipeline, derivations, projections, and rate adapters.

**Workspace type:** Package

## Boundary rules

- This package MUST NOT import `astro`, `astro:*`, or `@astrojs/*` — it is framework-free.
- This package MUST NOT import from `@warpgogol/werkstatt-site` or `@warpgogol/werkstatt-engine` — it is a leaf domain package depending only on `@warpgogol/werkstatt-shared` and declared deps.
- The Astro adapter surface (`astro:content` collections, `PbpContentSource` implementation) lives in `@warpgogol/werkstatt-site/pbp/astro` — never here.
- PBP entity contracts are single-sourced in `src/entities/<name>.ts` (DNA-103): the Zod schema is canonical, the entity type is `z.infer<typeof schema>`, and `PBP_*` const arrays derive from the schema's `.options`. Never declare a parallel `interface PbpX` duplicating a schema's shape.

## Scripts

| Script        | Command                                   |
| ------------- | ----------------------------------------- |
| `lint`        | `pnpm exec eslint "src/**/*.ts"`          |
| `typecheck`   | `pnpm exec tsc -p tsconfig.json --noEmit` |
| `build`       | `pnpm exec tsc -p tsconfig.json --noEmit` |
| `build:check` | `pnpm exec tsc -p tsconfig.json --noEmit` |
| `test`        | `vitest run`                              |
