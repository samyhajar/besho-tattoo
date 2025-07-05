import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import BookingFormContent from "./BookingFormContent";
import type { Availability, Appointment } from "@/services/appointments";

// No Slot Selected Component
function NoSlotSelected({ onCancel }: { onCancel: () => void }) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="text-center py-8 sm:py-12">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
          No Time Slot Selected
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          Please select an appointment slot first
        </p>
        <Button onClick={onCancel} className="w-full sm:w-auto">
          Back to Calendar
        </Button>
      </CardContent>
    </Card>
  );
}

interface BookingFormProps {
  selectedSlot: Availability | null;
  onSuccess: (appointment: Appointment) => void;
  onCancel: () => void;
}

export default function BookingForm({
  selectedSlot,
  onSuccess,
  onCancel,
}: BookingFormProps) {
  if (!selectedSlot) {
    return <NoSlotSelected onCancel={onCancel} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
      <BookingFormContent
        selectedSlot={selectedSlot}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </div>
  );
}
