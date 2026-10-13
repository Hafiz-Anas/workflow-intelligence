import { z } from "zod";

export const timelineKindSchema = z.enum(["received", "review", "routing", "escalation", "analysis", "waiting", "decision"]);

export const timelineEventSchema = z.object({
  id: z.string(),
  at: z.string().datetime(),
  actor: z.string(),
  action: z.string(),
  note: z.string(),
  kind: timelineKindSchema.default("review"),
});

export type TimelineEvent = z.infer<typeof timelineEventSchema>;
export type TimelineKind = z.infer<typeof timelineKindSchema>;
