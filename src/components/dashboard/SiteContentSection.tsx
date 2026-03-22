import { ReactNode } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Card } from "@/components/ui/Card";

interface SiteContentSectionProps {
  title: string;
  description: string;
  fields: Array<{
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    type?: "input" | "textarea";
  }>;
  gridCols?: 1 | 2;
  children?: ReactNode;
}

export function SiteContentSection({
  title,
  description,
  fields,
  gridCols = 2,
  children,
}: SiteContentSectionProps) {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      <div
        className={`grid grid-cols-1 ${gridCols === 2 ? "md:grid-cols-2" : ""} gap-4`}
      >
        {fields.map((field) => (
          <div
            key={field.id}
            className={field.type === "textarea" ? "col-span-full" : ""}
          >
            <Label htmlFor={field.id} className="text-gray-900">
              {field.label}
            </Label>

            {field.type === "textarea" ? (
              <Textarea
                id={field.id}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
                className="mt-1"
              />
            ) : (
              <Input
                id={field.id}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
                className="mt-1"
              />
            )}
          </div>
        ))}
      </div>

      {children ? (
        <div className="mt-6 border-t border-gray-200 pt-6">{children}</div>
      ) : null}
    </Card>
  );
}
