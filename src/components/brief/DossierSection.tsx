import { cn } from "@/lib/utils";

interface DossierSectionProps {
  id: string;
  number: number;
  title: string;
  highlighted?: boolean;
  children: React.ReactNode;
  className?: string;
}

/** A numbered section of the document-style Decision Brief. */
export function DossierSection({ id, number, title, highlighted = false, children, className }: DossierSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        "scroll-mt-24 rounded-md border border-transparent px-4 py-4 transition-colors duration-500",
        highlighted && "border-accent/40 bg-accent/5",
        className,
      )}
    >
      <h2 id={`${id}-title`} className="mb-2 flex items-baseline gap-2 text-sm font-semibold uppercase tracking-wide">
        <span className="font-mono text-xs text-muted-foreground">{String(number).padStart(2, "0")}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
