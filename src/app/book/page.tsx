"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import CalendarView from "@/components/ui/CalendarView";
import TimeSlotSelector from "@/components/ui/TimeSlotSelector";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import { useLocale } from "@/contexts/LocaleContext";
import { formatLocalDateString } from "@/lib/utils";
import { fetchAvailableSlots } from "@/services/appointments";
import type { Availability } from "@/services/appointments";

export default function BookPage() {
  const router = useRouter();
  const { copy } = useLocale();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAvailableSlots = useCallback(
    async (date: Date) => {
      try {
        setLoading(true);
        setError(null);

        // Get slots for the current month
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const slots = await fetchAvailableSlots(
          formatLocalDateString(startDate),
          formatLocalDateString(endDate),
        );

        setAvailableSlots(slots);
      } catch (err) {
        console.error("Error loading available slots:", err);
        setError(copy.booking.failedToLoadAppointments);
      } finally {
        setLoading(false);
      }
    },
    [copy.booking.failedToLoadAppointments],
  );

  useEffect(() => {
    void loadAvailableSlots(currentDate);
  }, [currentDate, loadAvailableSlots]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: Availability) => {
    setSelectedSlot(slot);
  };

  const handleBookingStart = () => {
    if (selectedSlot) {
      router.push(`/book/confirm?slot=${selectedSlot.id}`);
    }
  };

  const handleMonthChange = (newDate: Date) => {
    setCurrentDate(newDate);
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Header />

      <div className="min-h-screen bg-[#0d0d0d]">
        <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h1 className="mb-3 text-2xl font-bold text-white sm:text-3xl lg:mb-4 lg:text-4xl">
              {copy.booking.pageTitle}
            </h1>
            <p className="mx-auto max-w-2xl leading-relaxed text-neutral-400 sm:text-lg">
              {copy.booking.pageDescription}
            </p>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            {/* Mobile Progress Indicator */}
            <div className="mb-6 sm:mb-8 lg:hidden">
              <div className="rounded-lg border border-white/10 bg-[#141414] p-4 shadow-sm">
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div
                    className={`flex items-center space-x-2 ${selectedDate ? "text-white" : "text-neutral-500"}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedDate
                          ? "border-white bg-white"
                          : "border-neutral-600"
                      }`}
                    >
                      {selectedDate ? (
                        <div className="h-2 w-2 rounded-full bg-black"></div>
                      ) : (
                        <span className="text-xs font-medium text-neutral-500">
                          1
                        </span>
                      )}
                    </div>
                    <span className="font-medium">{copy.booking.stepDate}</span>
                  </div>

                  <div
                    className={`h-0.5 w-8 ${selectedDate ? "bg-white" : "bg-neutral-700"}`}
                  ></div>

                  <div
                    className={`flex items-center space-x-2 ${selectedSlot ? "text-white" : "text-neutral-500"}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedSlot
                          ? "border-white bg-white"
                          : "border-neutral-600"
                      }`}
                    >
                      {selectedSlot ? (
                        <div className="h-2 w-2 rounded-full bg-black"></div>
                      ) : (
                        <span className="text-xs font-medium text-neutral-500">
                          2
                        </span>
                      )}
                    </div>
                    <span className="font-medium">{copy.booking.stepTime}</span>
                  </div>

                  <div
                    className={`h-0.5 w-8 ${selectedSlot ? "bg-white" : "bg-neutral-700"}`}
                  ></div>

                  <div className="flex items-center space-x-2 text-neutral-500">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-neutral-600">
                      <span className="text-xs font-medium text-neutral-500">
                        3
                      </span>
                    </div>
                    <span className="font-medium">{copy.booking.stepBook}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 items-start">
              {/* Calendar Section */}
              <div className="space-y-4">
                <div className="hidden lg:block">
                  <h2 className="mb-4 text-xl font-semibold text-white">
                    {copy.booking.chooseDate}
                  </h2>
                </div>
                <CalendarView
                  availableSlots={availableSlots}
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  onMonthChange={handleMonthChange}
                  loading={loading}
                  error={error}
                />
              </div>

              {/* Time Slots Section */}
              <div className="space-y-4">
                <div className="hidden lg:block">
                  <h2 className="mb-4 text-xl font-semibold text-white">
                    {copy.booking.chooseTime}
                  </h2>
                </div>
                <TimeSlotSelector
                  availableSlots={availableSlots}
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  onSlotSelect={handleSlotSelect}
                  onBookingStart={handleBookingStart}
                />
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
