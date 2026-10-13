import { currentUser } from "@/lib/config/locale";
import { buildBrief } from "@/lib/mock/briefs";
import {
  decisionBriefSchema,
  decisionInputSchema,
  queueSummarySchema,
  requestSchema,
  timelineEventSchema,
  type DecisionBrief,
  type DecisionInput,
  type QueueSummary,
  type Request,
  type TimelineEvent,
} from "@/lib/schemas";
import { simulateLatency } from "@/lib/utils";
import { db } from "./db";
import { ApiError } from "./errors";

export async function getQueueSummary(): Promise<QueueSummary> {
  await simulateLatency();
  return queueSummarySchema.parse(db.queueSummary);
}

/** Requests ordered by priority score, highest first. */
export async function getRequests(): Promise<Request[]> {
  await simulateLatency();
  return requestSchema
    .array()
    .parse(db.requests)
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

export async function getRequest(id: string): Promise<Request> {
  await simulateLatency();
  const request = db.requests.find((r) => r.id === id);
  if (!request) throw new ApiError(404, `Request ${id} was not found.`);
  return requestSchema.parse(request);
}

/** The id of the open request with the highest priority (used by the sidebar link). */
export async function getTopRequestId(): Promise<string> {
  const requests = await getRequests();
  const open = requests.find((r) => r.status !== "approved" && r.status !== "declined") ?? requests[0];
  if (!open) throw new ApiError(404, "There are no requests in the queue.");
  return open.id;
}

export async function getDecisionBrief(id: string): Promise<DecisionBrief> {
  await simulateLatency();
  const request = db.requests.find((r) => r.id === id);
  if (!request) throw new ApiError(404, `Request ${id} was not found.`);
  const brief = buildBrief(request);
  const recorded = db.decisions.get(id);
  return decisionBriefSchema.parse({
    ...brief,
    timeline: [...brief.timeline, ...(recorded?.events ?? [])],
    decision: recorded?.decision ?? null,
  });
}

const decisionCopy = {
  approve: { action: "Approved", status: "approved" },
  decline: { action: "Declined", status: "declined" },
  escalate: { action: "Escalated for further review", status: "escalated" },
} as const;

export async function submitDecision(input: DecisionInput): Promise<TimelineEvent> {
  const parsed = decisionInputSchema.parse(input);
  await simulateLatency();
  const request = db.requests.find((r) => r.id === parsed.requestId);
  if (!request) throw new ApiError(404, `Request ${parsed.requestId} was not found.`);

  const copy = decisionCopy[parsed.decision];
  const event = timelineEventSchema.parse({
    id: `decision-${Date.now()}`,
    at: new Date().toISOString(),
    actor: `${currentUser.name} · ${currentUser.role}`,
    action: copy.action,
    note: parsed.comment.trim(),
    kind: "decision",
  });

  const existing = db.decisions.get(request.id);
  db.decisions.set(request.id, { decision: parsed.decision, events: [...(existing?.events ?? []), event] });
  request.status = copy.status;
  return event;
}
