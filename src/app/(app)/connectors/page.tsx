"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ConfigureConnectorDrawer } from "@/components/connectors/ConfigureConnectorDrawer";
import { ConnectorsGrid } from "@/components/connectors/ConnectorsGrid";
import { PipelineStrip } from "@/components/connectors/PipelineStrip";
import { PolicyDropzone } from "@/components/connectors/PolicyDropzone";
import { RepositoryManifest } from "@/components/connectors/RepositoryManifest";
import { PolicyDrawer } from "@/components/shared/PolicyDrawer";
import { SectionCard } from "@/components/shared/SectionCard";
import { useConnectors } from "@/lib/hooks/useConnectors";

/** One drawer at a time on this screen. */
type Drawer = { kind: "policy"; id: string } | { kind: "connector"; id: string } | null;

export default function ConnectorsPage() {
  const [drawer, setDrawer] = useState<Drawer>(null);
  const { data: connectors } = useConnectors();
  const close = (open: boolean) => !open && setDrawer(null);
  const connector = drawer?.kind === "connector" ? (connectors?.find((c) => c.id === drawer.id) ?? null) : null;

  return (
    <>
      <PageHeader
        title="Connectors and Policy Library"
        description="Connect the systems your organization already uses and upload the policies that govern authority and routing."
      />

      <div className="space-y-4">
        <PipelineStrip />

        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <SectionCard
            title="Policy Library"
            description="Authority rules and recommendations are read from these documents."
            contentClassName="space-y-5"
          >
            <PolicyDropzone />
            <RepositoryManifest
              openId={drawer?.kind === "policy" ? drawer.id : null}
              onOpen={(id) => setDrawer({ kind: "policy", id })}
            />
          </SectionCard>

          <SectionCard title="Connectors" description="Sources the platform reads from. Connection states are simulated in this demo.">
            <ConnectorsGrid onConfigure={(c) => setDrawer({ kind: "connector", id: c.id })} />
          </SectionCard>
        </div>
      </div>

      <PolicyDrawer policyId={drawer?.kind === "policy" ? drawer.id : null} onOpenChange={close} />
      <ConfigureConnectorDrawer connector={connector} onOpenChange={close} />
    </>
  );
}
