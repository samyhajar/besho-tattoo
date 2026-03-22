import { CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { useLocale } from "@/contexts/LocaleContext";
import { formatLocalDateForLocale, formatTimeForLocale } from "@/lib/i18n";
import type { Availability } from "@/services/appointments";

interface BookingFormHeaderProps {
  selectedSlot: Availability;
}

export default function BookingFormHeader({
  selectedSlot,
}: BookingFormHeaderProps) {
  const { locale, copy } = useLocale();

  return (
    <CardHeader className="pb-4 sm:pb-6">
      <CardTitle className="text-lg sm:text-xl lg:text-2xl">
        {copy.booking.completeBooking}
      </CardTitle>
      <CardDescription className="text-sm sm:text-base">
        {copy.booking.fillDetails}{" "}
        <span className="font-medium text-gray-900">
          {formatLocalDateForLocale(locale, selectedSlot.date, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          {formatTimeForLocale(locale, selectedSlot.time_start)} -{" "}
          {formatTimeForLocale(locale, selectedSlot.time_end)}
        </span>
      </CardDescription>
    </CardHeader>
  );
}
