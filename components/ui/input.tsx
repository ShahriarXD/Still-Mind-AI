import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-[#1e2d40] bg-[#0f172a] px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50",
          "hover:border-slate-600",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
