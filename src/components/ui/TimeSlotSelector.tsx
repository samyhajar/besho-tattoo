import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Clock, ArrowRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatLocalDateForLocale, formatTimeForLocale } from "@/lib/i18n";
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
  const { locale, copy } = useLocale();

  return (
    <Card className="w-full bg-white border-gray-200">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-black">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          {selectedDate ? copy.booking.availableTimes : copy.booking.selectDate}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {selectedDate
            ? copy.booking.choosePreferredTime
            : copy.booking.clickDateWithSlots}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {selectedDate ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Selected Date Display */}
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="font-medium text-black text-sm sm:text-base">
                {formatLocalDateForLocale(locale, selectedDate, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-medium text-black text-sm sm:text-base">
                {copy.booking.availableTimeSlots}
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
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white
                        ${
                          selectedSlot?.id === slot.id
                            ? "border-green-500 bg-green-50 text-black ring-2 ring-green-500 ring-offset-2 ring-offset-white"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100 focus:ring-blue-400"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div
                            className={`font-medium text-sm sm:text-base ${
                              selectedSlot?.id === slot.id
                                ? "text-black"
                                : "text-black"
                            }`}
                          >
                            {formatTimeForLocale(locale, slot.time_start)} -{" "}
                            {formatTimeForLocale(locale, slot.time_end)}
                          </div>
                          <div
                            className={`text-xs sm:text-sm mt-1 ${
                              selectedSlot?.id === slot.id
                                ? "text-gray-600"
                                : "text-gray-500"
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
                              return copy.booking.durationHours(duration);
                            })()}
                          </div>
                        </div>
                        {selectedSlot?.id === slot.id && (
                          <div className="ml-3 p-1 bg-green-500/20 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Booking Action */}
            {selectedSlot && (
              <div className="pt-4 sm:pt-6 border-t border-gray-200 space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-black text-sm sm:text-base">
                    {copy.booking.readyToBook}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {copy.booking.readyToBookDescription}
                  </p>
                </div>
                <Button
                  onClick={onBookingStart}
                  className="w-full py-3 sm:py-4 text-sm sm:text-base font-medium"
                  size="lg"
                >
                  <span>{copy.booking.continueToBooking}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* No Date Selected State */
          <div className="text-center py-8 sm:py-12">
            <Clock className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-base sm:text-lg font-medium text-black mb-2">
              {copy.booking.selectDateFirst}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-sm mx-auto">
              {copy.booking.selectDateFirstDescription}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
