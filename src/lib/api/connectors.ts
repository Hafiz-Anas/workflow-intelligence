import {
  connectorConfigSchema,
  connectorSchema,
  pipelineStatusSchema,
  type Connector,
  type ConnectorConfig,
  type PipelineStatus,
} from "@/lib/schemas";
import { simulateLatency } from "@/lib/utils";
import { db } from "./db";
import { ApiError } from "./errors";

export async function getConnectors(): Promise<Connector[]> {
  await simulateLatency();
  return connectorSchema.array().parse(db.connectors);
}

export async function configureConnector(input: { id: string; config: ConnectorConfig }): Promise<Connector> {
  connectorConfigSchema.parse(input.config);
  await simulateLatency(400, 700);
  const connector = db.connectors.find((c) => c.id === input.id);
  if (!connector) throw new ApiError(404, `Connector ${input.id} was not found.`);
  connector.status = "online";
  connector.lastSyncAt = new Date().toISOString();
  return connectorSchema.parse(connector);
}

export async function getPipelineStatus(): Promise<PipelineStatus> {
  await simulateLatency();
  return pipelineStatusSchema.parse(db.pipeline);
}

export interface ConnectionTestResult {
  ok: boolean;
  latencyMs: number;
  message: string;
}

/** Mock connectivity check: succeeds for any http(s) endpoint. */
export async function testConnection(input: { id: string; endpoint: string }): Promise<ConnectionTestResult> {
  await simulateLatency(500, 900);
  if (!db.connectors.some((c) => c.id === input.id)) throw new ApiError(404, `Connector ${input.id} was not found.`);
  const ok = /^https?:\/\/\S+$/i.test(input.endpoint.trim());
  return ok
    ? { ok, latencyMs: 40 + Math.round(Math.random() * 120), message: "Endpoint reachable and credentials accepted (simulated)." }
    : { ok, latencyMs: 0, message: "Endpoint must be a full http:// or https:// address." };
}
