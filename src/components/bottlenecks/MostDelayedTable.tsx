"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { formatDuration } from "@/lib/format";
import type { BottleneckReport } from "@/lib/schemas";

type Delayed = BottleneckReport["mostDelayed"][number] & { rank: number };

const columns: ColumnDef<Delayed, unknown>[] = [
  {
    id: "rank",
    accessorKey: "rank",
    header: "#",
    cell: ({ row }) => <span className="font-mono text-xs font-semibold tabular">{row.original.rank}</span>,
  },
  {
    id: "title",
    accessorKey: "title",
    header: "Request",
    cell: ({ row }) => (
      <div className="min-w-[220px]">
        <p className="font-medium">{row.original.title}</p>
        <p className="font-mono text-[11px] text-muted-foreground">{row.original.requestId}</p>
      </div>
    ),
  },
  {
    id: "department",
    accessorKey: "department",
    header: "Department",
    cell: ({ getValue }) => <span className="whitespace-nowrap">{String(getValue())}</span>,
  },
  {
    id: "delay",
    accessorKey: "delayHours",
    header: "Delay",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-mono text-xs font-semibold text-danger tabular">
        +{formatDuration(row.original.delayHours)}
      </span>
    ),
  },
  {
    id: "reason",
    accessorKey: "reason",
    header: "Reason for delay",
    enableSorting: false,
    cell: ({ getValue }) => <span className="text-muted-foreground">{String(getValue())}</span>,
  },
];

interface MostDelayedTableProps {
  rows: BottleneckReport["mostDelayed"];
  selectedId: string | null;
  onSelect: (requestId: string) => void;
}

export function MostDelayedTable({ rows, selectedId, onSelect }: MostDelayedTableProps) {
  const data = useMemo(
    () => [...rows].sort((a, b) => b.delayHours - a.delayHours).map((r, i) => ({ ...r, rank: i + 1 })),
    [rows],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={(r) => r.requestId}
      rowLabel={(r) => `Show delay details for ${r.title}`}
      onRowClick={(r) => onSelect(r.requestId)}
      selectedId={selectedId}
      emptyTitle="No delayed requests"
    />
  );
}
