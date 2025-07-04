import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Clock, ArrowRight } from "lucide-react";
import type { Availability } from "@/services/appointments";

interface TimeSlotSelectorProps {
  selectedDate: string | null;
  availableSlots: Availability[];
  selectedSlot: Availability | null;
  onSlotSelect: (slot: Availability) => void;
  onProceedToBooking: () => void;
}

export default function TimeSlotSelector({
  selectedDate,
  availableSlots,
  selectedSlot,
  onSlotSelect,
  onProceedToBooking,
}: TimeSlotSelectorProps) {
  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {selectedDate ? "Available Times" : "Select a Date"}
        </CardTitle>
        <CardDescription>
          {selectedDate
            ? "Choose your preferred time slot"
            : "Click on a date with available slots"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedDate ? (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-medium text-blue-900">
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">
                Available Time Slots:
              </h4>
              {availableSlots
                .filter((slot) => slot.date === selectedDate)
                .map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => onSlotSelect(slot)}
                    className={`w-full p-3 text-left rounded-lg border transition-colors ${
                      selectedSlot?.id === slot.id
                        ? "border-green-500 bg-green-50 text-green-900"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium">
                      {formatTime(slot.time_start)} -{" "}
                      {formatTime(slot.time_end)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {(() => {
                        const start = new Date(`2000-01-01T${slot.time_start}`);
                        const end = new Date(`2000-01-01T${slot.time_end}`);
                        const duration =
                          (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                        return `${duration} hour${duration !== 1 ? "s" : ""}`;
                      })()}
                    </div>
                  </button>
                ))}
            </div>

            {selectedSlot && (
              <div className="space-y-3 pt-4 border-t">
                <div>
                  <h4 className="font-medium text-gray-900">Ready to book?</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Click below to provide your contact information and any
                    reference images.
                  </p>
                </div>

                <Button
                  onClick={onProceedToBooking}
                  className="w-full"
                  size="lg"
                >
                  Continue to Booking
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600">
              Select a date with available slots to see time options
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
