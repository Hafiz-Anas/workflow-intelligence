import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  id?: string;
}

export function SectionCard({ title, description, actions, children, className, contentClassName, id }: SectionCardProps) {
  return (
    <Card className={cn("flex flex-col", className)} id={id}>
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
        <div className="min-w-0 space-y-1">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </CardHeader>
      <CardContent className={cn("flex-1", contentClassName)}>{children}</CardContent>
    </Card>
  );
}
