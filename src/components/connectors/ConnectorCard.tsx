import { Building2, Database, FileText, Workflow, type LucideIcon } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatNumber, formatRelative } from "@/lib/format";
import type { Connector, ConnectorGroup } from "@/lib/schemas";

export const groupIcons: Record<ConnectorGroup, LucideIcon> = {
  document_systems: FileText,
  databases: Database,
  enterprise_apps: Building2,
  workflow_tools: Workflow,
};

interface ConnectorCardProps {
  connector: Connector;
  onConfigure: (connector: Connector) => void;
}

export function ConnectorCard({ connector, onConfigure }: ConnectorCardProps) {
  const Icon = groupIcons[connector.group];
  const online = connector.status === "online";

  return (
    <div className="flex flex-col gap-3 rounded-md border bg-card p-3">
      <div className="flex items-start gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{connector.name}</p>
          <p className="truncate text-xs text-muted-foreground">{connector.description}</p>
        </div>
        <StatusBadge status={connector.status} />
      </div>
      <dl className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <dt className="text-muted-foreground">Last sync</dt>
          <dd className="font-mono tabular">{connector.lastSyncAt ? formatRelative(connector.lastSyncAt) : "Never synced"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Records indexed</dt>
          <dd className="font-mono tabular">{formatNumber(connector.recordsIndexed)}</dd>
        </div>
      </dl>
      <Button
        size="sm"
        variant={online ? "outline" : "default"}
        onClick={() => onConfigure(connector)}
        aria-label={`${online ? "Configure" : "Connect"} ${connector.name}`}
      >
        {online ? "Configure" : "Connect"}
      </Button>
    </div>
  );
}
