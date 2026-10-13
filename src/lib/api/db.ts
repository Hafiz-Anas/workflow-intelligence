/**
 * DEMO: in-memory store seeded from /lib/mock. Mutations (decisions, uploads,
 * connector setup) live here for the browser session only.
 * Delete this file when /lib/api talks to a real backend.
 */
import { mockBottleneckReport, mockPatterns } from "@/lib/mock/bottlenecks";
import { mockConnectors, mockPipelineStatus } from "@/lib/mock/connectors";
import { mockContracts } from "@/lib/mock/contracts";
import { mockPolicies } from "@/lib/mock/policies";
import { mockQueueSummary, mockRequests } from "@/lib/mock/requests";
import { mockAuthorityKpis, mockTiers } from "@/lib/mock/tiers";
import type { Decision, TimelineEvent } from "@/lib/schemas";

export const db = {
  requests: structuredClone(mockRequests),
  queueSummary: structuredClone(mockQueueSummary),
  tiers: structuredClone(mockTiers),
  authorityKpis: structuredClone(mockAuthorityKpis),
  policies: structuredClone(mockPolicies),
  contracts: structuredClone(mockContracts),
  connectors: structuredClone(mockConnectors),
  pipeline: structuredClone(mockPipelineStatus),
  bottlenecks: structuredClone(mockBottleneckReport),
  patterns: structuredClone(mockPatterns),
  /** Timeline events and decisions recorded during this session, keyed by request id. */
  decisions: new Map<string, { decision: Decision; events: TimelineEvent[] }>(),
};
