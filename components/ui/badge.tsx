import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
        low: "bg-green-500/10 text-green-400 border border-green-500/30",
        medium: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
        high: "bg-red-500/10 text-red-400 border border-red-500/30",
        secondary: "bg-slate-700 text-slate-300 border border-slate-600",
        outline: "border border-slate-600 text-slate-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
