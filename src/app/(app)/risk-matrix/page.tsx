"use client";

import { useEffect, useState } from "react";
import { AlertOctagon, CircleDollarSign, Gauge, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContractHealthTable } from "@/components/risk/ContractHealthTable";
import { RiskHeatmap, RiskHeatmapSkeleton } from "@/components/risk/RiskHeatmap";
import { SignalDiagnosticsDrawer } from "@/components/risk/SignalDiagnosticsDrawer";
import { EmptyState, ErrorState } from "@/components/shared/EmptyState";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatCard, StatCardSkeleton } from "@/components/shared/StatCard";
import { formatMoney, formatNumber } from "@/lib/format";
import { useContracts, useRiskKpis } from "@/lib/hooks/useContracts";
import { useUi } from "@/lib/store/ui";

export default function RiskMatrixPage() {
  const contracts = useContracts();
  const kpis = useRiskKpis();
  const selectedId = useUi((s) => s.selectedContractId);
  const select = useUi((s) => s.selectContract);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openContract = (id: string) => {
    select(id);
    setDrawerOpen(true);
  };

  // Default to the highest-risk contract once the register loads.
  useEffect(() => {
    const first = contracts.data?.[0];
    if (!selectedId && first) select(first.id);
  }, [contracts.data, selectedId, select]);

  const k = kpis.data;

  return (
    <>
      <PageHeader
        title="Risk Matrix"
        description="Contract risk by likelihood and impact. Select a contract on the heatmap or in the table to open its signal diagnostics."
      />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.error ? (
          <div className="col-span-full">
            <ErrorState error={kpis.error} onRetry={() => void kpis.refetch()} />
          </div>
        ) : !k ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Total portfolio exposure"
              value={formatMoney(k.totalExposure)}
              icon={CircleDollarSign}
              hint="Current exposure across all contracts"
            />
            <StatCard
              label="Critical risk contracts"
              value={formatNumber(k.criticalContracts)}
              icon={AlertOctagon}
              tone="danger"
              hint="Score 20 or above"
            />
            <StatCard
              label="Vulnerability index"
              value={
                <>
                  {formatNumber(k.vulnerabilityIndex, 1)}
                  <span className="text-sm font-normal text-muted-foreground"> / 100</span>
                </>
              }
              icon={Gauge}
              tone="warning"
              hint="Average likelihood × impact, scaled to 100"
            />
            <StatCard
              label="Mitigated"
              value={formatMoney(k.mitigated)}
              icon={ShieldCheck}
              tone="success"
              hint="Exposure reduced since contract award"
            />
          </>
        )}
      </div>

      <SectionCard
        className="mb-4"
        title="Risk heatmap"
        description="Likelihood (vertical) against impact (horizontal). Numbers match the table rows. Select a marker to open its signals."
      >
        <div className="mx-auto max-w-4xl">
          {contracts.error ? (
            <ErrorState error={contracts.error} onRetry={() => void contracts.refetch()} />
          ) : contracts.isLoading || !contracts.data ? (
            <RiskHeatmapSkeleton />
          ) : contracts.data.length === 0 ? (
            <EmptyState title="No contracts to plot" />
          ) : (
            <RiskHeatmap contracts={contracts.data} selectedId={selectedId} onSelect={openContract} />
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Contract health and exposure"
        description="Sorted by risk score. Select a row to open its signal diagnostics."
        contentClassName="px-0 pb-0"
      >
        <div className="border-t">
          <ContractHealthTable
            contracts={contracts.data}
            isLoading={contracts.isLoading}
            error={contracts.error}
            onRetry={() => void contracts.refetch()}
            selectedId={selectedId}
            onSelect={openContract}
          />
        </div>
      </SectionCard>

      {/* Selection stays highlighted in the heatmap and table while the drawer is open and after it closes. */}
      <SignalDiagnosticsDrawer contractId={selectedId} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  );
}
