import { Button } from "@/components/ui/Button";
import { useLocale } from "@/contexts/LocaleContext";

interface BookingFormActionsProps {
  submitting: boolean;
  onCancel: () => void;
}

export default function BookingFormActions({
  submitting,
  onCancel,
}: BookingFormActionsProps) {
  const { copy } = useLocale();

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-200">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={submitting}
        className="order-2 sm:order-1 w-full sm:flex-1"
      >
        {copy.booking.backToCalendar}
      </Button>
      <Button
        type="submit"
        disabled={submitting}
        className="order-1 sm:order-2 w-full sm:flex-1 py-3 sm:py-2"
      >
        {submitting ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span>{copy.booking.bookingProgress}</span>
          </div>
        ) : (
          copy.booking.bookAppointment
        )}
      </Button>
    </div>
  );
}
