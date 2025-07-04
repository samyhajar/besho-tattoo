import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Calendar } from "lucide-react";
import type { Availability } from "@/services/appointments";

interface CalendarDay {
  date: string;
  slots: Availability[];
  isToday: boolean;
  isCurrentMonth: boolean;
}

interface CalendarViewProps {
  availableSlots: Availability[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  loading: boolean;
  error: string | null;
}

export default function CalendarView({
  availableSlots,
  selectedDate,
  onDateSelect,
  loading,
  error,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);

    // Start from the first day of the week
    startDate.setDate(startDate.getDate() - startDate.getDay());
    // End at the last day of the week
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const days: CalendarDay[] = [];
    const today = new Date();

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dateStr = date.toISOString().split("T")[0];
      const slots = availableSlots.filter((slot) => slot.date === dateStr);

      days.push({
        date: dateStr,
        slots,
        isToday: date.toDateString() === today.toDateString(),
        isCurrentMonth: date.getMonth() === month,
      });
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  const calendarDays = generateCalendarDays();
  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="truncate">{monthName}</span>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("prev")}
              disabled={loading}
              className="flex-1 sm:flex-none px-3 py-2 text-sm"
            >
              ← Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("next")}
              disabled={loading}
              className="flex-1 sm:flex-none px-3 py-2 text-sm"
            >
              Next →
            </Button>
          </div>
        </div>
        <CardDescription className="text-sm">
          Click on any available date to see time slots
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Loading available slots...
            </p>
          </div>
        ) : (
          <>
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs sm:text-sm font-medium text-gray-500 py-2"
                >
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.substring(0, 1)}</span>
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {calendarDays.map((day) => (
                <button
                  key={day.date}
                  type="button"
                  disabled={day.slots.length === 0}
                  className={`
                    min-h-[60px] sm:min-h-[80px] lg:min-h-[90px]
                    p-1 sm:p-2 border rounded-lg transition-all duration-200
                    text-left w-full relative overflow-hidden
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${
                      day.isCurrentMonth
                        ? "bg-white hover:bg-gray-50 active:bg-gray-100"
                        : "bg-gray-50 hover:bg-gray-100"
                    }
                    ${day.isToday ? "ring-2 ring-blue-500 ring-offset-1" : ""}
                    ${
                      selectedDate === day.date
                        ? "ring-2 ring-green-500 bg-green-50 ring-offset-1"
                        : ""
                    }
                    ${
                      day.slots.length > 0
                        ? "border-green-200 hover:border-green-300 cursor-pointer shadow-sm hover:shadow-md"
                        : "border-gray-200 cursor-not-allowed"
                    }
                    ${day.slots.length === 0 ? "opacity-60" : ""}
                  `}
                  onClick={() => onDateSelect(day.date)}
                >
                  <div
                    className={`text-xs sm:text-sm font-medium mb-1 ${
                      day.isCurrentMonth ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {new Date(day.date).getDate()}
                  </div>
                  {day.slots.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-green-600">
                        {day.slots.length} slot{day.slots.length > 1 ? "s" : ""}
                      </div>
                      <div className="text-xs text-gray-500 leading-tight">
                        {formatTime(day.slots[0].time_start)}
                        {day.slots.length > 1 && (
                          <div className="text-xs opacity-75">
                            +{day.slots.length - 1} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
