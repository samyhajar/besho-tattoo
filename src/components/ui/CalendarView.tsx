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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {monthName}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("prev")}
              disabled={loading}
            >
              ←
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("next")}
              disabled={loading}
            >
              →
            </Button>
          </div>
        </div>
        <CardDescription>
          Click on any available date to see time slots
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading available slots...</p>
          </div>
        ) : (
          <>
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day) => (
                <button
                  key={day.date}
                  type="button"
                  disabled={day.slots.length === 0}
                  className={`
                    min-h-[80px] p-2 border rounded-lg transition-colors text-left w-full
                    ${day.isCurrentMonth ? "bg-white hover:bg-gray-50" : "bg-gray-100"}
                    ${day.isToday ? "ring-2 ring-blue-500" : ""}
                    ${selectedDate === day.date ? "ring-2 ring-green-500 bg-green-50" : ""}
                    ${day.slots.length > 0 ? "border-green-200 hover:border-green-300 cursor-pointer" : "border-gray-200 cursor-not-allowed"}
                    ${day.slots.length === 0 ? "opacity-50" : ""}
                  `}
                  onClick={() => onDateSelect(day.date)}
                >
                  <div
                    className={`text-sm font-medium ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}`}
                  >
                    {new Date(day.date).getDate()}
                  </div>
                  {day.slots.length > 0 && (
                    <div className="mt-1">
                      <div className="text-xs text-green-600 font-medium">
                        {day.slots.length} slot{day.slots.length > 1 ? "s" : ""}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatTime(day.slots[0].time_start)}
                        {day.slots.length > 1 &&
                          ` +${day.slots.length - 1} more`}
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
