"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, type, ...props }, ref) => {
    const inputEl = (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:border-gray-900 hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900",
          className,
        )}
        {...props}
      />
    );

    if (!label) return inputEl;

          return (
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-900">
          <span>{label}</span>
          {inputEl}
        </label>
      );
  },
);
Input.displayName = "Input";

export { Input };
export default Input;