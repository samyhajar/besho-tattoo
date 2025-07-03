"use client";

import { VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900/30 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-900/30 shadow-sm",
        destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600/30 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]",
        ghost: "hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-900/30 text-gray-700",
        outline: "border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50 focus:ring-gray-900/30",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;