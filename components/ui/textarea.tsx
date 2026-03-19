import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border border-[#1e2d40] bg-[#0f172a] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50",
          "hover:border-slate-600",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "resize-none",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
