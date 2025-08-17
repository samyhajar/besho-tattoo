import { Input } from "@/components/ui/Input";
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
  }>;
  gridCols?: 1 | 2;
}

export function SiteContentSection({
  title,
  description,
  fields,
  gridCols = 2,
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
          <div key={field.id}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder={field.placeholder}
              className="mt-1"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
