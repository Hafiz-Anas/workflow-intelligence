import { z } from "zod";

export const workflowStepSchema = z.object({
  key: z.string(),
  label: z.string(),
  avgHours: z.number(),
  flagged: z.boolean().default(false),
  note: z.string().optional(),
});

export const bottleneckReportSchema = z.object({
  alert: z.object({ stage: z.string(), title: z.string(), idleHours: z.number(), detail: z.string() }),
  avoidableEscalations: z.object({ count: z.number(), total: z.number(), percent: z.number() }),
  approvalTimeByDepartment: z.array(z.object({ department: z.string(), hours: z.number() })),
  escalationTrend: z.array(z.object({ month: z.string(), total: z.number(), avoidable: z.number() })),
  mostDelayed: z.array(
    z.object({ requestId: z.string(), title: z.string(), department: z.string(), delayHours: z.number(), reason: z.string() }),
  ),
  currentWorkflow: z.array(workflowStepSchema),
  proposedWorkflow: z.array(workflowStepSchema),
  cycleTimeReductionPct: z.number(),
  improvement: z.object({
    baselineLabel: z.string(),
    currentLabel: z.string(),
    metrics: z.array(
      z.object({
        key: z.string(),
        label: z.string(),
        before: z.number(),
        after: z.number(),
        unit: z.enum(["hours", "percent", "count"]),
        lowerIsBetter: z.boolean(),
      }),
    ),
  }),
});

export type WorkflowStep = z.infer<typeof workflowStepSchema>;
export type BottleneckReport = z.infer<typeof bottleneckReportSchema>;
