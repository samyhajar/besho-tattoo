import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/Card";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import type { Availability } from "@/services/appointments";

interface CalendarDay {
  date: string;
  dayNumber: number;
  slots: Availability[];
  isToday: boolean;
  isCurrentMonth: boolean;
}

interface CalendarViewProps {
  availableSlots: Availability[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  onMonthChange?: (newDate: Date) => void;
  loading: boolean;
  error: string | null;
}

export default function CalendarView({
  availableSlots,
  selectedDate,
  onDateSelect,
  onMonthChange,
  loading,
  error,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Find the first Monday of the calendar view
    const startDate = new Date(firstDay);
    const firstDayOfWeek = firstDay.getDay();
    const daysToSubtract = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Monday = 0, Sunday = 6
    startDate.setDate(startDate.getDate() - daysToSubtract);

    // Find the last Sunday of the calendar view
    const endDate = new Date(lastDay);
    const lastDayOfWeek = lastDay.getDay();
    const daysToAdd = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek; // Complete the week
    endDate.setDate(endDate.getDate() + daysToAdd);

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dateStr = date.toISOString().split("T")[0];
      const slots = availableSlots.filter((slot) => slot.date === dateStr);

      const dayDate = new Date(date);
      dayDate.setHours(0, 0, 0, 0);

      days.push({
        date: dateStr,
        dayNumber: date.getDate(),
        slots,
        isToday: dayDate.getTime() === today.getTime(),
        isCurrentMonth: date.getMonth() === month,
      });
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
    onMonthChange?.(newDate);
  };

  const calendarDays = generateCalendarDays();
  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <Card className="w-full h-fit bg-gray-800 border-gray-700">
      <CardHeader className="pb-3 sm:pb-4">
        <CalendarHeader
          monthName={monthName}
          loading={loading}
          onNavigateMonth={navigateMonth}
        />
        <CardDescription className="text-sm text-gray-300">
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
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-white mx-auto"></div>
            <p className="mt-2 text-sm sm:text-base text-gray-300">
              Loading available slots...
            </p>
          </div>
        ) : (
          <CalendarGrid
            calendarDays={calendarDays}
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
          />
        )}
      </CardContent>
    </Card>
  );
}
