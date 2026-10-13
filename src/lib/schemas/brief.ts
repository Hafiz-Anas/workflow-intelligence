import { z } from "zod";
import { requestSchema } from "./request";
import { timelineEventSchema } from "./timeline";

/**
 * Rich text used in brief sections. Plain strings render as text, `ref`
 * segments render as clickable phrases linked to a Connected Context item,
 * and `money` segments are formatted with the configured currency.
 */
export const richSegmentSchema = z.union([
  z.string(),
  z.object({ text: z.string(), ref: z.string() }),
  z.object({ money: z.number() }),
]);
export const richTextSchema = z.array(richSegmentSchema);

export const contextGroupKeySchema = z.enum([
  "policy",
  "contract",
  "department",
  "project_manager",
  "stakeholders",
  "previous_decisions",
  "deadlines",
  "financial_exposure",
  "risks",
]);

export const contextItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  facts: z.array(z.object({ label: z.string(), value: z.string() })),
  policyId: z.string().optional(),
});

export const contextGroupSchema = z.object({
  key: contextGroupKeySchema,
  label: z.string(),
  items: z.array(contextItemSchema),
});

export const briefSectionKeySchema = z.enum(["statement", "justification", "impact", "authority", "recommendation", "timeline", "signoff"]);

export const relationshipSchema = z.object({
  key: z.string(),
  label: z.string(),
  section: briefSectionKeySchema,
  group: contextGroupKeySchema,
});

export const decisionBriefSchema = z.object({
  request: requestSchema,
  contractId: z.string().nullable(),
  recommendation: z.object({
    action: z.string(),
    confidence: z.number().min(0).max(100),
    rationale: z.string(),
    policySource: z.object({ policyId: z.string(), label: z.string(), clause: z.string() }),
  }),
  sections: z.object({
    statement: richTextSchema,
    justification: richTextSchema,
    impact: richTextSchema,
    authority: richTextSchema,
    recommendation: richTextSchema,
  }),
  context: z.array(contextGroupSchema),
  relationships: z.array(relationshipSchema),
  timeline: z.array(timelineEventSchema),
  decision: z.enum(["approve", "decline", "escalate"]).nullable(),
});

export const decisionInputSchema = z.object({
  requestId: z.string(),
  decision: z.enum(["approve", "decline", "escalate"]),
  comment: z.string().trim().min(15, "Please write at least 15 characters."),
});

export type RichSegment = z.infer<typeof richSegmentSchema>;
export type RichText = z.infer<typeof richTextSchema>;
export type ContextGroupKey = z.infer<typeof contextGroupKeySchema>;
export type ContextItem = z.infer<typeof contextItemSchema>;
export type ContextGroup = z.infer<typeof contextGroupSchema>;
export type BriefSectionKey = z.infer<typeof briefSectionKeySchema>;
export type Relationship = z.infer<typeof relationshipSchema>;
export type DecisionBrief = z.infer<typeof decisionBriefSchema>;
export type DecisionInput = z.infer<typeof decisionInputSchema>;
export type Decision = DecisionInput["decision"];
