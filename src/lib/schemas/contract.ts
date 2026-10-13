import { z } from "zod";

export const riskLevelSchema = z.enum(["low", "medium", "medium_high", "high", "critical"]);
export const trendSchema = z.enum(["rising", "stable", "falling"]);

export const contractSignalsSchema = z.object({
  deliverablesCompletedPct: z.number().min(0).max(100),
  delayedMilestones: z.number().int().nonnegative(),
  missingApprovals: z.number().int().nonnegative(),
  resourceIssues: z.array(z.string()),
  daysRemaining: z.number().int(),
  statement: z.string(),
  recommendedAction: z.string(),
});

export const contractSchema = z.object({
  id: z.string(),
  name: z.string(),
  vendor: z.string(),
  originalExposure: z.number().nonnegative(),
  currentExposure: z.number().nonnegative(),
  mitigated: z.number().nonnegative(),
  remainingRisk: z.number().nonnegative(),
  trend: trendSchema,
  primaryCause: z.string(),
  affectedObjective: z.string(),
  riskLevel: riskLevelSchema,
  likelihood: z.number().int().min(1).max(5),
  impact: z.number().int().min(1).max(5),
  signals: contractSignalsSchema,
});

export const riskKpisSchema = z.object({
  totalExposure: z.number(),
  criticalContracts: z.number(),
  vulnerabilityIndex: z.number(),
  mitigated: z.number(),
});

export type Contract = z.infer<typeof contractSchema>;
export type RiskLevel = z.infer<typeof riskLevelSchema>;
export type Trend = z.infer<typeof trendSchema>;
export type ContractSignals = z.infer<typeof contractSignalsSchema>;
export type RiskKpis = z.infer<typeof riskKpisSchema>;

export const riskLevelLabels: Record<RiskLevel, string> = {
  low: "Low",
  medium: "Medium",
  medium_high: "Medium-High",
  high: "High",
  critical: "Critical",
};

/** Likelihood x impact score (1–25) to risk level. Shared by mock data and the heatmap legend. */
export function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 20) return "critical";
  if (score >= 15) return "high";
  if (score >= 10) return "medium_high";
  if (score >= 5) return "medium";
  return "low";
}
