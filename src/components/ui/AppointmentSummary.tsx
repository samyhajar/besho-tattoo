import { useLocale } from "@/contexts/LocaleContext";
import { formatLocalDateForLocale, formatTimeForLocale } from "@/lib/i18n";
import type { Availability } from "@/services/appointments";

interface AppointmentSummaryProps {
  selectedSlot: Availability;
}

export default function AppointmentSummary({
  selectedSlot,
}: AppointmentSummaryProps) {
  const { locale, copy } = useLocale();

  return (
    <div className="space-y-4">
      <h3 className="text-base sm:text-lg font-medium text-gray-900 pb-2 border-b border-gray-200">
        {copy.booking.appointmentSummary}
      </h3>
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{copy.booking.date}:</span>
            <span className="font-medium text-blue-900">
              {formatLocalDateForLocale(locale, selectedSlot.date, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{copy.booking.time}:</span>
            <span className="font-medium text-blue-900">
              {formatTimeForLocale(locale, selectedSlot.time_start)} -{" "}
              {formatTimeForLocale(locale, selectedSlot.time_end)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{copy.booking.duration}:</span>
            <span className="font-medium text-blue-900">
              {(() => {
                const start = new Date(`2000-01-01T${selectedSlot.time_start}`);
                const end = new Date(`2000-01-01T${selectedSlot.time_end}`);
                const duration =
                  (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                return copy.booking.durationHours(duration);
              })()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
