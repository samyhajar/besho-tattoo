import type { Availability } from "@/services/appointments";

interface CalendarDay {
  date: string;
  dayNumber: number;
  slots: Availability[];
  isToday: boolean;
  isCurrentMonth: boolean;
}

interface CalendarGridProps {
  calendarDays: CalendarDay[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

export default function CalendarGrid({
  calendarDays,
  selectedDate,
  onDateSelect,
}: CalendarGridProps) {
  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <>
      {/* Calendar Header - Starting with Monday */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
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
              {day.dayNumber}
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
  );
}