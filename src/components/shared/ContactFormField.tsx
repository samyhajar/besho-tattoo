import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

interface ContactFormFieldProps {
  id: string;
  label: string;
  type: "text" | "email" | "textarea";
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  placeholder: string;
  disabled: boolean;
  required?: boolean;
  rows?: number;
  variant?: "default" | "dark";
}

export default function ContactFormField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  disabled,
  required = true,
  rows = 6,
  variant = "default",
}: ContactFormFieldProps) {
  const isDarkVariant = variant === "dark";
  const commonClassName = cn(
    "w-full px-4 py-3 transition-all duration-200",
    isDarkVariant
      ? "rounded-none border border-neutral-800 bg-neutral-950 text-white placeholder:text-neutral-600 focus:ring-0 focus:border-white/30"
      : "rounded-lg border border-gray-200 bg-white text-black focus:ring-2 focus:ring-black focus:border-transparent",
  );

  return (
    <div>
      <Label
        htmlFor={id}
        className={cn(
          "mb-2 block",
          isDarkVariant
            ? "font-home-sans text-xs uppercase tracking-[0.22em] text-neutral-400"
            : "text-black",
        )}
      >
        {label} {required && "*"}
      </Label>
      {type === "textarea" ? (
        <textarea
          id={id}
          name={id}
          rows={rows}
          required={required}
          value={value}
          onChange={onChange}
          className={`${commonClassName} resize-none`}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <Input
          id={id}
          name={id}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          className={commonClassName}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
    </div>
  );
}
