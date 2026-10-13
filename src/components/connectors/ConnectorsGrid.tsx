"use client";

import { PlugZap } from "lucide-react";
import { EmptyState, ErrorState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useConnectors } from "@/lib/hooks/useConnectors";
import { connectorGroupLabels, type Connector, type ConnectorGroup } from "@/lib/schemas";
import { ConnectorCard, groupIcons } from "./ConnectorCard";

const groups = Object.keys(connectorGroupLabels) as ConnectorGroup[];

export function ConnectorsGrid({ onConfigure }: { onConfigure: (connector: Connector) => void }) {
  const { data, isLoading, error, refetch } = useConnectors();

  if (error) return <ErrorState error={error} onRetry={() => void refetch()} />;

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        {groups.map((g) => (
          <div key={g} className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <div className="grid gap-3 lg:grid-cols-2">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) return <EmptyState icon={PlugZap} title="No connectors configured" />;

  return (
    <div className="space-y-5">
      {groups.map((group) => {
        const items = data.filter((c) => c.group === group);
        if (items.length === 0) return null;
        const Icon = groupIcons[group];
        const online = items.filter((c) => c.status === "online").length;
        return (
          <section key={group} aria-labelledby={`group-${group}`} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 id={`group-${group}`} className="flex items-center gap-2 text-sm font-semibold">
                <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
                {connectorGroupLabels[group]}
              </h3>
              <span className="font-mono text-xs text-muted-foreground tabular">
                {online}/{items.length} online
              </span>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {items.map((c) => (
                <ConnectorCard key={c.id} connector={c} onConfigure={onConfigure} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
