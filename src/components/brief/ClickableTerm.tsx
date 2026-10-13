"use client";

import { formatMoney } from "@/lib/format";
import type { RichText } from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface ClickableTermProps {
  children: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}

/** A key phrase inside brief text that links to an item in the Connected Context panel. */
export function ClickableTerm({ children, selected, onSelect }: ClickableTermProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "inline rounded-sm px-0.5 text-start font-medium text-accent underline decoration-accent/60 decoration-dotted underline-offset-4 transition-colors hover:bg-accent/10 hover:decoration-solid",
        selected && "bg-accent/15 decoration-solid",
      )}
    >
      {children}
    </button>
  );
}

interface RichTextViewProps {
  value: RichText;
  selectedRef: string | null;
  onSelectRef: (ref: string) => void;
}

export function RichTextView({ value, selectedRef, onSelectRef }: RichTextViewProps) {
  return (
    <p className="text-sm leading-7">
      {value.map((segment, index) => {
        if (typeof segment === "string") return <span key={index}>{segment}</span>;
        if ("money" in segment) {
          return (
            <span key={index} className="font-mono font-medium tabular">
              {formatMoney(segment.money)}
            </span>
          );
        }
        return (
          <ClickableTerm key={index} selected={selectedRef === segment.ref} onSelect={() => onSelectRef(segment.ref)}>
            {segment.text}
          </ClickableTerm>
        );
      })}
    </p>
  );
}
