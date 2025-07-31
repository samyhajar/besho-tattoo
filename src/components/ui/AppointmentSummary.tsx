import { parseLocalDate } from "@/lib/utils";
import type { Availability } from "@/services/appointments";

interface AppointmentSummaryProps {
  selectedSlot: Availability;
}

export default function AppointmentSummary({
  selectedSlot,
}: AppointmentSummaryProps) {
  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base sm:text-lg font-medium text-gray-900 pb-2 border-b border-gray-200">
        Appointment Summary
      </h3>
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium text-blue-900">
              {parseLocalDate(selectedSlot.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium text-blue-900">
              {formatTime(selectedSlot.time_start)} -{" "}
              {formatTime(selectedSlot.time_end)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium text-blue-900">
              {(() => {
                const start = new Date(`2000-01-01T${selectedSlot.time_start}`);
                const end = new Date(`2000-01-01T${selectedSlot.time_end}`);
                const duration =
                  (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                return `${duration} hour${duration !== 1 ? "s" : ""}`;
              })()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
