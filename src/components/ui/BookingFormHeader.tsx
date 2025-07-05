import { CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Availability } from "@/services/appointments";

interface BookingFormHeaderProps {
  selectedSlot: Availability;
}

export default function BookingFormHeader({
  selectedSlot,
}: BookingFormHeaderProps) {
  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <CardHeader className="pb-4 sm:pb-6">
      <CardTitle className="text-lg sm:text-xl lg:text-2xl">
        Complete Your Booking
      </CardTitle>
      <CardDescription className="text-sm sm:text-base">
        Fill in your details to confirm your appointment for{" "}
        <span className="font-medium text-gray-900">
          {new Date(selectedSlot.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          at {formatTime(selectedSlot.time_start)} -{" "}
          {formatTime(selectedSlot.time_end)}
        </span>
      </CardDescription>
    </CardHeader>
  );
}
