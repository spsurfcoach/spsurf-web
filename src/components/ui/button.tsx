"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "ds-btn inline-flex items-center justify-center whitespace-nowrap transition disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "ds-btn-primary",
        secondary: "ds-btn-secondary",
        outline: "border border-black/15 bg-transparent text-[var(--color-text-default)] hover:bg-black/5",
        ghost: "bg-transparent text-[var(--color-text-default)] hover:bg-black/5",
      },
      size: {
        default: "h-10 px-4",
        icon: "h-10 w-10 p-0",
        lg: "ds-btn-lg px-6",
        sm: "h-8 px-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
