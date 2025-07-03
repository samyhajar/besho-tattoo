import { cn } from "@/lib/utils";
import { forwardRef, LabelHTMLAttributes } from "react";

const Label = forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement>
>(({ className, htmlFor, ...props }, ref) => (
  <label
    ref={ref}
    htmlFor={htmlFor}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };