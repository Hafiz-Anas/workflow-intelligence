"use client";

import { Info, X } from "lucide-react";
import { useUi } from "@/lib/store/ui";

export function DemoBanner() {
  const dismissed = useUi((s) => s.demoBannerDismissed);
  const dismiss = useUi((s) => s.dismissDemoBanner);

  if (dismissed) return null;

  return (
    <div role="status" className="flex items-center gap-2 border-b border-warning/30 bg-warning/10 px-6 py-1.5 text-xs text-text">
      <Info className="h-3.5 w-3.5 shrink-0 text-warning-fg" aria-hidden />
      <p>
        <span className="font-semibold">Demo mode:</span> all data is sample data. Figures, names and recommendations are
        illustrative only.
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss demo mode notice"
        className="ms-auto rounded-sm p-0.5 text-muted-foreground hover:text-text"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
