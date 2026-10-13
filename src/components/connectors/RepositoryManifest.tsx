"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/format";
import { usePolicies } from "@/lib/hooks/usePolicies";
import { policyTypeLabels, type PolicyDocument, type PolicyType } from "@/lib/schemas";

const ALL = "all";

const columns: ColumnDef<PolicyDocument, unknown>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Document",
    cell: ({ row }) => (
      <div className="max-w-[150px] 2xl:max-w-[220px]">
        <p className="truncate font-medium" title={row.original.name}>
          {row.original.name}
        </p>
        <p className="truncate text-[11px] text-muted-foreground" title={row.original.fileName}>
          {policyTypeLabels[row.original.type]} · <span className="font-mono">{row.original.fileName}</span>
        </p>
      </div>
    ),
  },
  {
    id: "updated",
    accessorKey: "uploadedAt",
    header: "Version",
    cell: ({ row }) => (
      <div className="whitespace-nowrap font-mono text-xs tabular">
        <p className="font-medium">v{row.original.version}</p>
        <p className="text-[11px] text-muted-foreground">{formatDate(row.original.uploadedAt, "d MMM yyyy")}</p>
      </div>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex flex-col items-start gap-1">
        <StatusBadge status={row.original.status} />
        <StatusBadge status={row.original.syncStatus} />
      </div>
    ),
  },
];

interface RepositoryManifestProps {
  openId: string | null;
  onOpen: (policyId: string) => void;
}

export function RepositoryManifest({ openId, onOpen }: RepositoryManifestProps) {
  const { data, isLoading, error, refetch } = usePolicies();
  const [type, setType] = useState<PolicyType | typeof ALL>(ALL);

  const filtered = useMemo(() => (data ? data.filter((p) => type === ALL || p.type === type) : undefined), [data, type]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">
          Repository manifest{" "}
          {data && <span className="font-mono text-xs font-normal text-muted-foreground tabular">({data.length})</span>}
        </h3>
        <Select value={type} onValueChange={(v) => setType(v as PolicyType | typeof ALL)}>
          <SelectTrigger className="h-8 w-[180px]" aria-label="Filter by document type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All types</SelectItem>
            {(Object.keys(policyTypeLabels) as PolicyType[]).map((t) => (
              <SelectItem key={t} value={t}>
                {policyTypeLabels[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <DataTable
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          error={error}
          onRetry={() => void refetch()}
          getRowId={(p) => p.id}
          onRowClick={(p) => onOpen(p.id)}
          rowLabel={(p) => `Open ${p.name}`}
          selectedId={openId}
          initialSorting={[{ id: "updated", desc: true }]}
          emptyTitle="No documents"
          emptyDescription="Upload a policy or clear the type filter."
          skeletonRows={6}
        />
      </div>
    </div>
  );
}
