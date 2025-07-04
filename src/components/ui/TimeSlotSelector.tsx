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
  availableSlots: Availability[];
  selectedDate: string | null;
  selectedSlot: Availability | null;
  onSlotSelect: (slot: Availability) => void;
  onBookingStart: () => void;
}

export default function TimeSlotSelector({
  availableSlots,
  selectedDate,
  selectedSlot,
  onSlotSelect,
  onBookingStart,
}: TimeSlotSelectorProps) {
  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <Card className="w-full bg-gray-800 border-gray-700">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-white">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          {selectedDate ? "Available Times" : "Select a Date"}
        </CardTitle>
        <CardDescription className="text-sm text-gray-300">
          {selectedDate
            ? "Choose your preferred time slot"
            : "Click on a date with available slots"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {selectedDate ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Selected Date Display */}
            <div className="p-3 sm:p-4 bg-gray-700 rounded-lg border border-gray-600">
              <div className="font-medium text-white text-sm sm:text-base">
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-medium text-white text-sm sm:text-base">
                Available Time Slots:
              </h4>
              <div className="grid gap-2 sm:gap-3">
                {availableSlots
                  .filter((slot) => slot.date === selectedDate)
                  .map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => onSlotSelect(slot)}
                      className={`
                        w-full p-3 sm:p-4 text-left rounded-lg border transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
                        ${
                          selectedSlot?.id === slot.id
                            ? "border-green-400 bg-green-900/30 text-white ring-2 ring-green-400 ring-offset-2 ring-offset-gray-800"
                            : "border-gray-600 hover:border-gray-500 hover:bg-gray-700 active:bg-gray-600 focus:ring-blue-400"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div
                            className={`font-medium text-sm sm:text-base ${
                              selectedSlot?.id === slot.id
                                ? "text-white"
                                : "text-white"
                            }`}
                          >
                            {formatTime(slot.time_start)} -{" "}
                            {formatTime(slot.time_end)}
                          </div>
                          <div
                            className={`text-xs sm:text-sm mt-1 ${
                              selectedSlot?.id === slot.id
                                ? "text-gray-300"
                                : "text-gray-400"
                            }`}
                          >
                            {(() => {
                              const start = new Date(
                                `2000-01-01T${slot.time_start}`,
                              );
                              const end = new Date(
                                `2000-01-01T${slot.time_end}`,
                              );
                              const duration =
                                (end.getTime() - start.getTime()) /
                                (1000 * 60 * 60);
                              return `${duration} hour${duration !== 1 ? "s" : ""}`;
                            })()}
                          </div>
                        </div>
                        {selectedSlot?.id === slot.id && (
                          <div className="ml-3 p-1 bg-green-400/20 rounded-full">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Booking Action */}
            {selectedSlot && (
              <div className="pt-4 sm:pt-6 border-t border-gray-600 space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-white text-sm sm:text-base">
                    Ready to book?
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1">
                    Click below to provide your contact information and any
                    reference images.
                  </p>
                </div>
                <Button
                  onClick={onBookingStart}
                  className="w-full py-3 sm:py-4 text-sm sm:text-base font-medium"
                  size="lg"
                >
                  <span>Continue to Booking</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* No Date Selected State */
          <div className="text-center py-8 sm:py-12">
            <Clock className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-500" />
            <h3 className="text-base sm:text-lg font-medium text-white mb-2">
              Select a Date First
            </h3>
            <p className="text-sm sm:text-base text-gray-300 max-w-sm mx-auto">
              Choose an available date from the calendar above to see available
              time slots.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
