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
            className="text-center text-xs sm:text-sm font-medium text-gray-400 py-2"
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
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800
              ${
                day.isCurrentMonth
                  ? "bg-gray-700 hover:bg-gray-600 active:bg-gray-500"
                  : "bg-gray-800 hover:bg-gray-700"
              }
              ${day.isToday ? "ring-2 ring-blue-400 ring-offset-1 ring-offset-gray-800" : ""}
              ${
                selectedDate === day.date
                  ? "ring-2 ring-green-400 bg-green-900/30 ring-offset-1 ring-offset-gray-800"
                  : ""
              }
              ${
                day.slots.length > 0
                  ? "border-green-600 hover:border-green-500 cursor-pointer shadow-sm hover:shadow-md"
                  : "border-gray-600 cursor-not-allowed"
              }
              ${day.slots.length === 0 ? "opacity-60" : ""}
            `}
            onClick={() => onDateSelect(day.date)}
          >
            <div
              className={`text-xs sm:text-sm font-medium mb-1 ${
                day.isCurrentMonth ? "text-white" : "text-gray-400"
              }`}
            >
              {day.dayNumber}
            </div>
            {day.slots.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-green-400">
                  {day.slots.length} slot{day.slots.length > 1 ? "s" : ""}
                </div>
                <div className="text-xs text-gray-300 leading-tight">
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
