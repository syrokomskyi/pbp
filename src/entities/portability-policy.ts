/*
<MODULE_CONTRACT>
<purpose>portability-policy entity — canonical PBP data/service portability policy contract: Zod schema, inferred types (RFC-1155, DNA-103).</purpose>
<non-goals>
  <item>Do not add runtime logic — entity modules declare the schema only.</item>
  <item>Do not redeclare the inherited terms record — policySchema already carries it.</item>
</non-goals>
</MODULE_CONTRACT>
<CHANGE_SUMMARY>
  <item>RFC-1155: created specialized portability policy schema — export package reference and continuity guarantees.</item>
</CHANGE_SUMMARY>
*/

/**
 * PBP Portability Policy specialized schema.
 *
 * Canonical home for portability contract terms: link to the exit-package
 * policy and continuity guarantees (e.g. runnable copy).
 *
 * @see pbp-specification-package/entity-model §23.2 (Portability / Exit)
 * @see RFC-1155
 */

import { z } from "zod";
import { policySchema } from "./policy.js";
import { pbpEntityRefSchema } from "../schemas/entity-ref.js";

export const portabilityPolicySchema = policySchema
  .extend({
    kind: z.literal("portability"),
    exportPackageRef: pbpEntityRefSchema.optional(),
    continuity: z
      .object({ runnableCopy: z.boolean().optional() })
      .optional(),
  })
  .strict();

export type PbpPortabilityPolicy = z.infer<typeof portabilityPolicySchema>;
