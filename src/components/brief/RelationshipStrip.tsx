"use client";

import { ChevronRight } from "lucide-react";
import type { Relationship } from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface RelationshipStripProps {
  relationships: Relationship[];
  activeKey: string | null;
  onSelect: (relationship: Relationship) => void;
}

/** Request → Contract → … → Decision. Each step jumps to its section and context group. */
export function RelationshipStrip({ relationships, activeKey, onSelect }: RelationshipStripProps) {
  return (
    <nav aria-label="Request relationships" className="overflow-x-auto rounded-lg border bg-card p-1.5 shadow-card">
      <ol className="flex min-w-max items-center gap-0.5">
        {relationships.map((rel, index) => {
          const active = rel.key === activeKey;
          return (
            <li key={rel.key} className="flex items-center">
              <button
                type="button"
                onClick={() => onSelect(rel)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted",
                  active ? "bg-primary text-primary-foreground hover:bg-primary dark:bg-navy-700" : "text-muted-foreground hover:text-text",
                )}
              >
                {rel.label}
              </button>
              {index < relationships.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-border" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
