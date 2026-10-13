"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { EmptyState, ErrorState } from "./EmptyState";

interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[];
  data: T[] | undefined;
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  rowLabel?: (row: T) => string;
  selectedId?: string | null;
  initialSorting?: SortingState;
  emptyTitle?: string;
  emptyDescription?: string;
  skeletonRows?: number;
  /** Tighter horizontal cell padding for wide tables. */
  dense?: boolean;
  className?: string;
}

/**
 * Sortable table on TanStack Table. Rows with `onRowClick` are focusable and
 * open with Enter or Space, so the table is fully keyboard navigable.
 */
export function DataTable<T>({
  columns,
  data,
  isLoading,
  error,
  onRetry,
  getRowId,
  onRowClick,
  rowLabel,
  selectedId,
  initialSorting = [],
  emptyTitle = "Nothing to show",
  emptyDescription,
  skeletonRows = 6,
  dense = false,
  className,
}: DataTableProps<T>) {
  const pad = dense ? "px-2 first:ps-3 last:pe-3" : undefined;
  const headPad = dense ? cn(pad, "tracking-normal") : undefined;
  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  const table = useReactTable({
    data: data ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (error) return <ErrorState error={error} onRetry={onRetry} />;

  return (
    <Table className={className}>
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id} className="hover:bg-transparent">
            {group.headers.map((header) => {
              const canSort = header.column.getCanSort();
              const sorted = header.column.getIsSorted();
              const label = flexRender(header.column.columnDef.header, header.getContext());
              return (
                <TableHead
                  key={header.id}
                  className={headPad}
                  style={{ width: header.column.columnDef.size ? header.getSize() : undefined }}
                  aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined}
                >
                  {header.isPlaceholder ? null : canSort ? (
                    <button
                      type="button"
                      onClick={header.column.getToggleSortingHandler()}
                      className="-ms-1 inline-flex items-center gap-0.5 rounded-sm px-1 py-0.5 text-start uppercase hover:text-text"
                    >
                      {label}
                      {sorted === "asc" ? (
                        <ArrowUp className="h-3 w-3" aria-hidden />
                      ) : sorted === "desc" ? (
                        <ArrowDown className="h-3 w-3" aria-hidden />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-40" aria-hidden />
                      )}
                    </button>
                  ) : (
                    label
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: skeletonRows }).map((_, i) => (
            <TableRow key={i} className="hover:bg-transparent">
              {columns.map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-4 w-full max-w-[160px]" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : table.getRowModel().rows.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={columns.length}>
              <EmptyState title={emptyTitle} description={emptyDescription} />
            </TableCell>
          </TableRow>
        ) : (
          table.getRowModel().rows.map((row) => {
            const interactive = Boolean(onRowClick);
            return (
              <TableRow
                key={row.id}
                data-state={selectedId === row.id ? "selected" : undefined}
                tabIndex={interactive ? 0 : undefined}
                aria-label={interactive && rowLabel ? rowLabel(row.original) : undefined}
                aria-selected={selectedId !== undefined ? selectedId === row.id : undefined}
                onClick={interactive ? () => onRowClick?.(row.original) : undefined}
                onKeyDown={
                  interactive
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onRowClick?.(row.original);
                        }
                      }
                    : undefined
                }
                className={cn(interactive && "cursor-pointer focus-visible:bg-muted focus-visible:outline-none")}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={pad}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
