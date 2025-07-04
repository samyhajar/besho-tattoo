import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Availability } from "@/services/appointments";

interface AvailabilityStatsProps {
  availabilities: Availability[];
}

export default function AvailabilityStats({
  availabilities,
}: AvailabilityStatsProps) {
  const totalSlots = availabilities.length;
  const availableSlots = availabilities.filter(
    (slot) => !slot.is_booked,
  ).length;
  const bookedSlots = availabilities.filter((slot) => slot.is_booked).length;

  const upcomingSlots = availabilities.filter((slot) => {
    const slotDate = new Date(slot.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return slotDate >= today && !slot.is_booked;
  }).length;

  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{totalSlots}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {availableSlots}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Booked
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{bookedSlots}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Upcoming
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {upcomingSlots}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
