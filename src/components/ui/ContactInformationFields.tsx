import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

interface ContactData {
  full_name: string;
  email: string;
  phone: string;
  notes: string;
}

interface ContactInformationFieldsProps {
  formData: ContactData;
  onUpdate: (field: keyof ContactData, value: string) => void;
  disabled?: boolean;
}

export default function ContactInformationFields({
  formData,
  onUpdate,
  disabled = false,
}: ContactInformationFieldsProps) {
  return (
    <>
      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>

        <div>
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            type="text"
            value={formData.full_name}
            onChange={(e) => onUpdate("full_name", e.target.value)}
            placeholder="Enter your full name"
            className="mt-1"
            required
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onUpdate("email", e.target.value)}
            placeholder="Enter your email address"
            className="mt-1"
            required
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => onUpdate("phone", e.target.value)}
            placeholder="Enter your phone number"
            className="mt-1"
            disabled={disabled}
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Tattoo Ideas & Notes (Optional)</Label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => onUpdate("notes", e.target.value)}
          placeholder="Describe your tattoo ideas, size, placement, style preferences, etc."
          rows={4}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        />
      </div>
    </>
  );
}
