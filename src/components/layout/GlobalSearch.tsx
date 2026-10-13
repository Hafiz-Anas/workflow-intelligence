"use client";

import { useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useRequests } from "@/lib/hooks/useRequests";
import { cn } from "@/lib/utils";
import { PriorityBadge } from "@/components/shared/PriorityBadge";

export function GlobalSearch() {
  const router = useRouter();
  const { data: requests = [] } = useRequests();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return requests
      .filter((r) => [r.id, r.title, r.originDepartment, r.category].some((field) => field.toLowerCase().includes(q)))
      .slice(0, 6);
  }, [query, requests]);

  const go = (id: string) => {
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
    router.push(`/decision-brief/${id}`);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(results[active].id);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const showList = open && query.trim().length > 0;

  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-label="Search requests"
        placeholder="Search requests, IDs, departments…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={onKeyDown}
        className="h-9 w-full rounded-md border border-input bg-background ps-9 pe-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-50 mt-1 overflow-hidden rounded-md border bg-popover py-1 shadow-md"
        >
          {results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">No requests match “{query}”.</li>
          ) : (
            results.map((r, index) => (
              <li
                key={r.id}
                role="option"
                aria-selected={index === active}
                onMouseDown={(e) => {
                  e.preventDefault();
                  go(r.id);
                }}
                onMouseEnter={() => setActive(index)}
                className={cn("flex cursor-pointer items-center gap-3 px-3 py-2 text-sm", index === active && "bg-muted")}
              >
                <PriorityBadge score={r.priorityScore} label={r.priorityLabel} compact />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{r.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    <span className="font-mono">{r.id}</span> · {r.originDepartment}
                  </span>
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
