import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 whitespace-nowrap rounded-sm border px-1.5 py-0.5 text-[11px] font-medium leading-4 [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground dark:bg-navy-700",
        outline: "border-border bg-card text-text",
        muted: "border-transparent bg-muted text-muted-foreground",
        success: "border-success/30 bg-success/10 text-success-fg",
        warning: "border-warning/30 bg-warning/10 text-warning-fg",
        danger: "border-danger/30 bg-danger/10 text-danger",
        accent: "border-accent/30 bg-accent/10 text-accent",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
