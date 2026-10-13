import { z } from "zod";
import { tierIdSchema } from "./request";

export const authorityTierSchema = z.object({
  id: tierIdSchema,
  name: z.string(),
  role: z.string(),
  level: z.number().int().min(1).max(3),
  minLimit: z.number().nonnegative(),
  /** null means no upper limit at this tier. */
  maxLimit: z.number().positive().nullable(),
  limitNote: z.string().optional(),
  groundingClause: z.string(),
  policySourceId: z.string(),
  directApprovals: z.number().int().nonnegative(),
  friendlyEscalations: z.number().int().nonnegative(),
  delegationEfficiency: z.number().min(0).max(100),
  categoriesApprovable: z.array(z.string()),
});

export const authorityKpisSchema = z.object({
  directApprovalRate: z.number(),
  directApprovalTarget: z.number(),
  frictionEscalationRate: z.number(),
  reviewLatencyHours: z.number(),
  totalDecisions: z.number(),
});

export const ruleTestInputSchema = z.object({
  amount: z.number().nonnegative(),
  category: z.string().min(1),
  department: z.string().min(1),
});

export const ruleTestResultSchema = z.object({
  tierId: tierIdSchema,
  tierName: z.string(),
  role: z.string(),
  clause: z.string(),
  policySourceId: z.string(),
  escalatedForCategory: z.boolean(),
  explanation: z.string(),
  steps: z.array(z.string()),
});

export type AuthorityTier = z.infer<typeof authorityTierSchema>;
export type AuthorityKpis = z.infer<typeof authorityKpisSchema>;
export type RuleTestInput = z.infer<typeof ruleTestInputSchema>;
export type RuleTestResult = z.infer<typeof ruleTestResultSchema>;
