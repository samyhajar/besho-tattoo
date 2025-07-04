import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Clock, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/browser-client";
import type { Availability } from "@/services/appointments";

interface AvailabilityListProps {
  availabilities: Availability[];
  onUpdate: () => void;
}

export default function AvailabilityList({
  availabilities,
  onUpdate,
}: AvailabilityListProps) {
  const deleteAvailability = async (id: string) => {
    if (!confirm("Are you sure you want to delete this availability slot?")) {
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("availabilities")
        .delete()
        .eq("id", id);

      if (error) throw error;
      onUpdate();
    } catch (err) {
      console.error("Error deleting availability:", err);
      alert("Failed to delete availability slot");
    }
  };

  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const upcomingAvailabilities = availabilities.filter(
    (slot) => new Date(slot.date) >= new Date(),
  );

  if (availabilities.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600">No availability slots created yet</p>
          <p className="text-sm text-gray-500">
            Add your first time slot to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Availability Slots ({availabilities.length})</CardTitle>
        <CardDescription>
          Manage your appointment time slots - {upcomingAvailabilities.length}{" "}
          upcoming
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {availabilities
            .sort((a, b) => {
              const dateCompare =
                new Date(a.date).getTime() - new Date(b.date).getTime();
              if (dateCompare !== 0) return dateCompare;
              return a.time_start.localeCompare(b.time_start);
            })
            .map((slot) => (
              <div
                key={slot.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  slot.is_booked
                    ? "bg-red-50 border-red-200"
                    : new Date(slot.date) < new Date()
                      ? "bg-gray-50 border-gray-200"
                      : "bg-green-50 border-green-200"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-sm">
                      {formatDate(slot.date)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatTime(slot.time_start)} - {formatTime(slot.time_end)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      slot.is_booked
                        ? "bg-red-100 text-red-800"
                        : new Date(slot.date) < new Date()
                          ? "bg-gray-100 text-gray-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {slot.is_booked
                      ? "Booked"
                      : new Date(slot.date) < new Date()
                        ? "Past"
                        : "Available"}
                  </span>

                  {!slot.is_booked && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void deleteAvailability(slot.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
