import { Button } from "@/components/ui/Button";
import { CardTitle } from "@/components/ui/Card";
import { useLocale } from "@/contexts/LocaleContext";
import { Calendar } from "lucide-react";

interface CalendarHeaderProps {
  monthName: string;
  loading: boolean;
  onNavigateMonth: (direction: "prev" | "next") => void;
}

export default function CalendarHeader({
  monthName,
  loading,
  onNavigateMonth,
}: CalendarHeaderProps) {
  const { copy } = useLocale();

  return (
    <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-black">
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="truncate">{monthName}</span>
      </CardTitle>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigateMonth("prev")}
          disabled={loading}
          className="flex-1 sm:flex-none px-3 py-2 text-sm text-black border-gray-300 hover:bg-gray-50"
        >
          {copy.booking.monthPrev}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigateMonth("next")}
          disabled={loading}
          className="flex-1 sm:flex-none px-3 py-2 text-sm text-black border-gray-300 hover:bg-gray-50"
        >
          {copy.booking.monthNext}
        </Button>
      </div>
    </div>
  );
}
