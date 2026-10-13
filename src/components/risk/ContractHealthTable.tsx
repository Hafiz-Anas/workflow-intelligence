"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { RiskLevelBadge } from "@/components/shared/RiskLevelBadge";
import { TrendIndicator } from "@/components/shared/TrendIndicator";
import { formatMoney } from "@/lib/format";
import type { Contract } from "@/lib/schemas";

const riskOrder = { low: 1, medium: 2, medium_high: 3, high: 4, critical: 5 } as const;
const trendOrder = { falling: 1, stable: 2, rising: 3 } as const;

function moneyColumn(id: keyof Contract & string, header: string, className = ""): ColumnDef<Contract, unknown> {
  return {
    id,
    accessorKey: id,
    header,
    cell: ({ getValue }) => (
      <span
        className={`block whitespace-nowrap text-end font-mono text-xs tabular ${className}`}
        title={formatMoney(Number(getValue()), { compact: false })}
      >
        {formatMoney(Number(getValue()), { compact: true })}
      </span>
    ),
  };
}

function buildColumns(markerIndex: Map<string, number>): ColumnDef<Contract, unknown>[] {
  return [
    {
      id: "contract",
      accessorKey: "name",
      header: "Contract",
      cell: ({ row }) => (
        <div className="flex min-w-[150px] max-w-[230px] items-start gap-2">
          <span
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-900 font-mono text-[10px] font-semibold text-primary-foreground dark:bg-navy-700 dark:text-primary-foreground"
            aria-hidden
          >
            {markerIndex.get(row.original.id)}
          </span>
          <div className="min-w-0">
            <p className="font-medium leading-snug">{row.original.name}</p>
            <p className="truncate text-[11px] text-muted-foreground">
              <span className="font-mono">{row.original.id}</span> · {row.original.vendor}
            </p>
          </div>
        </div>
      ),
    },
    moneyColumn("originalExposure", "Original"),
    moneyColumn("currentExposure", "Current"),
    moneyColumn("mitigated", "Mitigated", "text-success-fg"),
    moneyColumn("remainingRisk", "Remaining risk", "font-semibold"),
    {
      id: "trend",
      accessorFn: (c) => trendOrder[c.trend],
      header: "Trend",
      cell: ({ row }) => <TrendIndicator trend={row.original.trend} />,
    },
    {
      id: "cause",
      accessorKey: "primaryCause",
      header: "Primary cause",
      cell: ({ getValue }) => <span className="block min-w-[100px] max-w-[170px] leading-snug text-muted-foreground">{String(getValue())}</span>,
    },
    {
      id: "objective",
      accessorKey: "affectedObjective",
      header: "Objective",
      cell: ({ getValue }) => <span className="block min-w-[80px] max-w-[130px] leading-snug">{String(getValue())}</span>,
    },
    {
      id: "risk",
      accessorFn: (c) => riskOrder[c.riskLevel],
      header: "Risk level",
      cell: ({ row }) => <RiskLevelBadge level={row.original.riskLevel} />,
    },
  ];
}

interface ContractHealthTableProps {
  contracts: Contract[] | undefined;
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ContractHealthTable({ contracts, isLoading, error, onRetry, selectedId, onSelect }: ContractHealthTableProps) {
  const markerIndex = new Map((contracts ?? []).map((c, i) => [c.id, i + 1]));
  return (
    <DataTable
      columns={buildColumns(markerIndex)}
      data={contracts}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      getRowId={(c) => c.id}
      onRowClick={(c) => onSelect(c.id)}
      rowLabel={(c) => `Select ${c.name}`}
      selectedId={selectedId}
      emptyTitle="No contracts in the register"
      skeletonRows={8}
      dense
    />
  );
}
