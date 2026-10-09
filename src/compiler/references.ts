/*
<MODULE_CONTRACT>
<purpose>Phase 6: Resolves cross-entity references and detects cycles in the entity graph.</purpose>
<non-goals>
  <item>Does not assemble the business profile graph — that is Phase 7 (profile.ts).</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1097: step 6 — compass.migrate codemod run

Mechanical v1 to v2 header migration across the workspace: 942 files rewritten — CHANGE_SUMMARY windows collapsed into history, forbidden v1 blocks stripped, KEY_DECISIONS seeded from @ai-invariant comments (5 files) or TODO placeholders (103 files), blocks reordered to canonical order.</item>
  <item>RFC-1097: sweep — werkstatt-engine clean

Sweep batch 4: 73 Compass headers on headerless engine files (certification, component-runtime, isolation, evolution, testing), real KEY_DECISIONS on 75 files (kernel, cache, dht, swim, gitmesh, runtime), ~80 purpose expansions (CONTRACT-02/PURPOSE-02), non-goals on 13 CONTRACT-03 files, CS-07 history literal fix repo-wide (253 files). Policy: .template.ts/.template.astro excludedPaths. werkstatt-engine now 0 diagnostics.</item>
  <item>RFC-1249: wire werkstatt.commands.validate into packages.check + retire CMD-OUTPUT debt</item>
</CHANGE_SUMMARY>
*/

import type { PbpEntity } from "../envelope.ts";
import type { PbpEntityRef } from "../entity-ref.ts";
import type { PbpGraphIntegrityError, PbpCycleCheckResult } from "../reference-resolution.ts";

export interface ReferenceResolutionResult {
  errors: PbpGraphIntegrityError[];
  cycleResults: PbpCycleCheckResult[];
}

const LOCALE_SUFFIX_RE =
  /\.(de|uk|en|fr|es|it|nl|pl|pt|ru|tr)$|\/(de|uk|en|fr|es|it|nl|pl|pt|ru|tr)\/|_(de|uk|en|fr|es|it|nl|pl|pt|ru|tr)$/i;

export async function resolveReferences(
  index: Map<string, PbpEntity>,
): Promise<ReferenceResolutionResult> {
  const errors: PbpGraphIntegrityError[] = [];
  const cycleResults: PbpCycleCheckResult[] = [];

  for (const [entityId, entity] of index) {
    const refs = collectRefs(entity);
    for (const ref of refs) {
      if (LOCALE_SUFFIX_RE.test(ref.ref)) {
        errors.push({
          kind: "locale-suffix-in-id",
          entityId,
          refPath: ref.ref,
          message: `Entity ID contains locale suffix: "${ref.ref}" (ADR-025).`,
        });
        continue;
      }

      const target = index.get(ref.ref);
      if (!target) {
        errors.push({
          kind: "missing-internal-ref",
          entityId,
          refPath: ref.ref,
          message: `Reference target not found: "${ref.ref}".`,
        });
        continue;
      }

      if (ref.expectedType && target.type !== ref.expectedType) {
        errors.push({
          kind: "type-mismatch",
          entityId,
          refPath: ref.ref,
          message: `Reference type mismatch: expected "${ref.expectedType}", got "${target.type}".`,
        });
      }
    }
  }

  for (const cycleType of [
    "requires",
    "category-broader",
    "successor-chain",
    "product-intrinsic-composition",
    "offering-optional-relation",
  ] as const) {
    const result = detectCycles(index, cycleType);
    cycleResults.push(result);
  }

  errors.sort((a, b) => a.entityId.localeCompare(b.entityId) || a.refPath.localeCompare(b.refPath));

  return { errors, cycleResults };
}

function collectRefs(entity: PbpEntity): PbpEntityRef[] {
  const refs: PbpEntityRef[] = [];
  const visited = new Set<string>();

  // fs.walk.lint: allow — walks an object graph (PbpEntityRef extraction), not the filesystem
  function walk(obj: unknown) {
    if (!obj || typeof obj !== "object") return;
    if (Array.isArray(obj)) {
      for (const item of obj) walk(item);
      return;
    }
    const record = obj as Record<string, unknown>;
    if (typeof record.ref === "string" && !visited.has(record.ref)) {
      visited.add(record.ref);
      refs.push({
        ref: record.ref,
        expectedType: typeof record.expectedType === "string" ? record.expectedType : undefined,
      });
    }
    for (const key of Object.keys(record).sort()) {
      if (key !== "ref") walk(record[key]);
    }
  }

  walk(entity);
  return refs;
}

function detectCycles(index: Map<string, PbpEntity>, cycleType: string): PbpCycleCheckResult {
  const adjacency = buildAdjacency(index, cycleType);
  const visited = new Set<string>();
  const inStack = new Set<string>();
  let hasCycle = false;

  function dfs(node: string, path: string[]): boolean {
    if (inStack.has(node)) {
      hasCycle = true;
      return true;
    }
    if (visited.has(node)) return false;
    visited.add(node);
    inStack.add(node);
    path.push(node);

    const neighbors = adjacency.get(node) ?? [];
    for (const neighbor of neighbors.sort()) {
      if (dfs(neighbor, path)) return true;
    }

    inStack.delete(node);
    path.pop();
    return false;
  }

  for (const nodeId of [...index.keys()].sort()) {
    if (!visited.has(nodeId)) {
      dfs(nodeId, []);
    }
  }

  return {
    checkType: cycleType as PbpCycleCheckResult["checkType"],
    hasCycle,
  };
}

function buildAdjacency(index: Map<string, PbpEntity>, cycleType: string): Map<string, string[]> {
  const adjacency = new Map<string, string[]>();

  for (const [id, entity] of index) {
    const targets: string[] = [];
    const entityRecord = entity as unknown as Record<string, unknown>;

    switch (cycleType) {
      case "requires":
        if (entity.type === "offering" && entityRecord.relatedOfferings) {
          const related = entityRecord.relatedOfferings as Record<string, Record<string, unknown>>;
          for (const r of Object.values(related)) {
            if (r.relation === "requires") {
              const offeringRef = r.offeringRef as Record<string, unknown> | undefined;
              if (offeringRef && typeof offeringRef.ref === "string") {
                targets.push(offeringRef.ref);
              }
            }
          }
        }
        break;
      case "category-broader":
        if (entity.type === "category" && entityRecord.broaderRef) {
          const broader = entityRecord.broaderRef as Record<string, unknown>;
          if (typeof broader.ref === "string") targets.push(broader.ref);
        }
        break;
      case "successor-chain":
        if (entity.type === "product" && entityRecord.supersedes) {
          const supersedes = entityRecord.supersedes as Record<string, unknown>;
          if (typeof supersedes.ref === "string") targets.push(supersedes.ref);
        }
        break;
      case "product-intrinsic-composition":
        if (entity.type === "product" && entityRecord.intrinsicComposition) {
          const comp = entityRecord.intrinsicComposition as Record<string, unknown>;
          if (Array.isArray(comp.components)) {
            for (const c of comp.components as Array<Record<string, unknown>>) {
              if (typeof c.ref === "string") targets.push(c.ref);
            }
          }
        }
        break;
      case "offering-optional-relation":
        if (entity.type === "offering" && entityRecord.relatedOfferings) {
          const related = entityRecord.relatedOfferings as Record<string, Record<string, unknown>>;
          for (const r of Object.values(related)) {
            if (r.relation !== "requires") {
              const offeringRef = r.offeringRef as Record<string, unknown> | undefined;
              if (offeringRef && typeof offeringRef.ref === "string") {
                targets.push(offeringRef.ref);
              }
            }
          }
        }
        break;
    }

    if (targets.length > 0) {
      adjacency.set(id, targets);
    }
  }

  return adjacency;
}
