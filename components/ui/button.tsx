"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-amber-500 text-slate-900 hover:bg-amber-400 shadow-lg hover:shadow-amber-500/25 active:scale-95",
        destructive:
          "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 active:scale-95",
        outline:
          "border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800 hover:border-amber-500/50 active:scale-95",
        ghost:
          "text-slate-400 hover:text-slate-200 hover:bg-slate-800 active:scale-95",
        secondary:
          "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 active:scale-95",
        success:
          "bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 active:scale-95",
        link: "text-amber-500 underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
