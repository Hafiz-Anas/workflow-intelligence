import { z } from "zod";

export const connectorGroupSchema = z.enum(["document_systems", "databases", "enterprise_apps", "workflow_tools"]);
export const connectorStatusSchema = z.enum(["online", "offline", "needs_setup"]);

export const connectorSchema = z.object({
  id: z.string(),
  name: z.string(),
  group: connectorGroupSchema,
  status: connectorStatusSchema,
  lastSyncAt: z.string().datetime().nullable(),
  description: z.string(),
  recordsIndexed: z.number().int().nonnegative(),
});

export const connectorConfigSchema = z.object({
  endpoint: z.string().min(1),
  authMethod: z.enum(["oauth", "service_account", "api_key"]),
  syncFrequency: z.enum(["15m", "1h", "6h", "24h"]),
});

export const pipelineStages = ["Connect", "Understand", "Monitor", "Analyze", "Recommend", "Execute", "Learn", "Improve"] as const;

export const pipelineStatusSchema = z.object({
  currentStage: z.enum(pipelineStages),
  description: z.string(),
});

export type Connector = z.infer<typeof connectorSchema>;
export type ConnectorGroup = z.infer<typeof connectorGroupSchema>;
export type ConnectorStatus = z.infer<typeof connectorStatusSchema>;
export type ConnectorConfig = z.infer<typeof connectorConfigSchema>;
export type PipelineStatus = z.infer<typeof pipelineStatusSchema>;

export const connectorGroupLabels: Record<ConnectorGroup, string> = {
  document_systems: "Document Systems",
  databases: "Databases",
  enterprise_apps: "Enterprise Applications",
  workflow_tools: "Existing Workflow Tools",
};
