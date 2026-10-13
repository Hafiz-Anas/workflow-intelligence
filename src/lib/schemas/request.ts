import { z } from "zod";

export const priorityLabelSchema = z.enum(["high", "medium", "low"]);
export const rankingReasonSchema = z.enum(["deadline", "financial_exposure", "risk_level"]);
export const requestStatusSchema = z.enum(["pending", "in_review", "escalated", "overdue", "approved", "declined"]);
export const tierIdSchema = z.enum(["tier-1", "tier-2", "tier-3"]);

export const requestSchema = z.object({
  id: z.string(),
  title: z.string(),
  originDepartment: z.string(),
  category: z.string(),
  receivedAt: z.string().datetime(),
  deadlineAt: z.string().datetime(),
  elapsedHours: z.number().nonnegative(),
  currentStage: z.string(),
  requiredAuthorityTier: tierIdSchema,
  priorityScore: z.number().min(0).max(100),
  priorityLabel: priorityLabelSchema,
  rankingReason: rankingReasonSchema,
  recommendedAttentionMinutes: z.number().int().positive(),
  amount: z.number().nonnegative(),
  status: requestStatusSchema,
});

export const queueSummarySchema = z.object({
  pending: z.number(),
  overdue: z.number(),
  highPriority: z.number(),
  medianLatencyHours: z.number(),
  targetLatencyHours: z.number(),
});

export type Request = z.infer<typeof requestSchema>;
export type PriorityLabel = z.infer<typeof priorityLabelSchema>;
export type RankingReason = z.infer<typeof rankingReasonSchema>;
export type RequestStatus = z.infer<typeof requestStatusSchema>;
export type TierId = z.infer<typeof tierIdSchema>;
export type QueueSummary = z.infer<typeof queueSummarySchema>;
