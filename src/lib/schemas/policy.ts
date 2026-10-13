import { z } from "zod";

export const policyTypeSchema = z.enum([
  "policy",
  "procedure",
  "approval_rules",
  "authority_limits",
  "escalation_rules",
  "contract_requirements",
]);

export const policyDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: policyTypeSchema,
  version: z.string(),
  uploadedAt: z.string().datetime(),
  status: z.enum(["active", "needs_review"]),
  syncStatus: z.enum(["synced", "syncing", "failed"]),
  sizeKb: z.number().nonnegative(),
  fileName: z.string(),
  owner: z.string(),
  summary: z.string(),
  clauses: z.array(z.object({ ref: z.string(), title: z.string(), text: z.string() })),
});

export type PolicyDocument = z.infer<typeof policyDocumentSchema>;
export type PolicyType = z.infer<typeof policyTypeSchema>;

export const policyTypeLabels: Record<PolicyType, string> = {
  policy: "Policy",
  procedure: "Procedure",
  approval_rules: "Approval rules",
  authority_limits: "Authority limits",
  escalation_rules: "Escalation rules",
  contract_requirements: "Contract requirements",
};
