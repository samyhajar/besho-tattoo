import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

interface ContactFormFieldProps {
  id: string;
  label: string;
  type: "text" | "email" | "textarea";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  disabled: boolean;
  required?: boolean;
  rows?: number;
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
}: ContactFormFieldProps) {
  const commonClassName = "w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black";

  return (
    <div>
      <Label htmlFor={id} className="text-black mb-2 block">
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
