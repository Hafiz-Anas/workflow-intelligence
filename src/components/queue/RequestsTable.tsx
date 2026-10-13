"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { TierBadge } from "@/components/shared/TierBadge";
import { formatDate, formatMoney } from "@/lib/format";
import type { Request } from "@/lib/schemas";
import { ALL, useQueueFilters } from "@/lib/store/queueFilters";
import { DeadlineProgress, slaHours } from "./DeadlineProgress";
import { RankingReasonBadge } from "./RankingReasonBadge";
import { RequestPreviewDrawer } from "./RequestPreviewDrawer";

const columns: ColumnDef<Request, unknown>[] = [
  {
    id: "priority",
    accessorKey: "priorityScore",
    header: "Priority",
    cell: ({ row }) => <PriorityBadge score={row.original.priorityScore} label={row.original.priorityLabel} compact />,
  },
  {
    id: "title",
    accessorKey: "title",
    header: "Request",
    cell: ({ row }) => (
      <div className="min-w-[144px] max-w-[220px]">
        <p className="truncate font-medium" title={row.original.title}>
          {row.original.title}
        </p>
        <p className="font-mono text-[11px] text-muted-foreground">
          {row.original.id} · {formatMoney(row.original.amount)}
        </p>
      </div>
    ),
  },
  {
    id: "department",
    accessorKey: "originDepartment",
    header: "Department · Category",
    cell: ({ row }) => (
      <div className="min-w-[120px] max-w-[160px]">
        <p className="leading-snug">{row.original.originDepartment}</p>
        <p className="text-[11px] leading-snug text-muted-foreground">{row.original.category}</p>
      </div>
    ),
  },
  {
    id: "received",
    accessorKey: "receivedAt",
    header: "Received",
    cell: ({ row }) => (
      <div className="whitespace-nowrap font-mono text-xs tabular">
        <p>{formatDate(row.original.receivedAt, "d MMM")}</p>
        <p className="text-[11px] text-muted-foreground">{formatDate(row.original.receivedAt, "HH:mm")}</p>
      </div>
    ),
  },
  {
    id: "elapsed",
    header: "Elapsed vs deadline",
    accessorFn: (r) => r.elapsedHours / slaHours(r),
    cell: ({ row }) => <DeadlineProgress request={row.original} />,
  },
  {
    id: "stage",
    accessorKey: "currentStage",
    header: "Stage",
    cell: ({ getValue }) => <span className="block min-w-[80px] max-w-[110px] leading-snug">{String(getValue())}</span>,
  },
  {
    id: "authority",
    accessorKey: "requiredAuthorityTier",
    header: "Authority",
    cell: ({ row }) => <TierBadge tier={row.original.requiredAuthorityTier} short />,
  },
  {
    id: "attention",
    accessorKey: "recommendedAttentionMinutes",
    header: "Attention",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-mono text-xs tabular" title="Recommended attention time">
        {row.original.recommendedAttentionMinutes} min
      </span>
    ),
  },
  {
    id: "why",
    accessorKey: "rankingReason",
    header: "Why here",
    enableSorting: false,
    cell: ({ row }) => (
      <RankingReasonBadge reason={row.original.rankingReason} className="max-w-[92px] whitespace-normal leading-tight" />
    ),
  },
];

interface RequestsTableProps {
  requests: Request[] | undefined;
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
}

export function RequestsTable({ requests, isLoading, error, onRetry }: RequestsTableProps) {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const { department, category, priority, search } = useQueueFilters();

  const filtered = useMemo(() => {
    if (!requests) return undefined;
    const q = search.trim().toLowerCase();
    return requests.filter(
      (r) =>
        (department === ALL || r.originDepartment === department) &&
        (category === ALL || r.category === category) &&
        (priority === ALL || r.priorityLabel === priority) &&
        (!q || r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)),
    );
  }, [requests, department, category, priority, search]);

  const preview = requests?.find((r) => r.id === previewId) ?? null;

  return (
    <>
      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        getRowId={(r) => r.id}
        rowLabel={(r) => `Preview ${r.title}`}
        onRowClick={(r) => setPreviewId(r.id)}
        selectedId={previewId}
        initialSorting={[{ id: "priority", desc: true }]}
        emptyTitle="No requests match these filters"
        emptyDescription="Try clearing a filter or searching for a different title."
        skeletonRows={8}
        dense
      />
      <RequestPreviewDrawer request={preview} onOpenChange={(open) => !open && setPreviewId(null)} />
    </>
  );
}
