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
    <div className="space-y-4 sm:space-y-5">
      {/* Name and Email Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="full_name"
            className="text-sm sm:text-base font-medium"
          >
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="full_name"
            type="text"
            value={formData.full_name}
            onChange={(e) => onUpdate("full_name", e.target.value)}
            placeholder="Enter your full name"
            className="text-sm sm:text-base py-2 sm:py-3"
            disabled={disabled}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm sm:text-base font-medium">
            Email Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onUpdate("email", e.target.value)}
            placeholder="Enter your email address"
            className="text-sm sm:text-base py-2 sm:py-3"
            disabled={disabled}
            required
          />
        </div>
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm sm:text-base font-medium">
          Phone Number (Optional)
        </Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => onUpdate("phone", e.target.value)}
          placeholder="Enter your phone number"
          className="text-sm sm:text-base py-2 sm:py-3"
          disabled={disabled}
        />
        <p className="text-xs sm:text-sm text-gray-500">
          We may contact you to confirm appointment details
        </p>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm sm:text-base font-medium">
          Additional Notes (Optional)
        </Label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => onUpdate("notes", e.target.value)}
          placeholder="Describe your tattoo ideas, size, placement, style preferences, etc."
          rows={4}
          className="w-full px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed resize-none"
          disabled={disabled}
        />
        <p className="text-xs sm:text-sm text-gray-500">
          Help us prepare for your appointment by sharing your vision
        </p>
      </div>
    </div>
  );
}
