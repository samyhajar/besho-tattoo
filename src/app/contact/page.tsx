"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import CalendarView from "@/components/ui/CalendarView";
import TimeSlotSelector from "@/components/ui/TimeSlotSelector";
import { fetchAvailableSlots } from "@/services/appointments";
import type { Availability } from "@/services/appointments";

export default function ContactPage() {
  const router = useRouter();
  const [currentDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAvailableSlots = useCallback(async (date: Date) => {
    try {
      setLoading(true);
      setError(null);

      // Get slots for the current month
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const slots = await fetchAvailableSlots(
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0],
      );

      setAvailableSlots(slots);
    } catch (err) {
      console.error("Error loading available slots:", err);
      setError("Failed to load available appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

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
      router.push(`/book?slot=${selectedSlot.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Book Your Appointment
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
            Select an available date and time for your tattoo consultation or
            session.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            {/* Calendar Section */}
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 lg:hidden">
                Choose a Date
              </h2>
              <CalendarView
                availableSlots={availableSlots}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                loading={loading}
                error={error}
              />
            </div>

            {/* Time Slots Section */}
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 lg:hidden">
                Choose a Time
              </h2>
              <TimeSlotSelector
                availableSlots={availableSlots}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onSlotSelect={handleSlotSelect}
                onBookingStart={handleBookingStart}
              />
            </div>
          </div>

          {/* Mobile Progress Indicator */}
          <div className="mt-6 sm:mt-8 lg:hidden">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div
                  className={`flex items-center space-x-2 ${selectedDate ? "text-green-600" : "text-gray-400"}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedDate
                        ? "border-green-600 bg-green-600"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedDate && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium">Date</span>
                </div>

                <div
                  className={`w-8 h-0.5 ${selectedDate ? "bg-green-600" : "bg-gray-300"}`}
                ></div>

                <div
                  className={`flex items-center space-x-2 ${selectedSlot ? "text-green-600" : "text-gray-400"}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedSlot
                        ? "border-green-600 bg-green-600"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedSlot && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium">Time</span>
                </div>

                <div
                  className={`w-8 h-0.5 ${selectedSlot ? "bg-green-600" : "bg-gray-300"}`}
                ></div>

                <div className="flex items-center space-x-2 text-gray-400">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <span className="text-xs">3</span>
                  </div>
                  <span className="font-medium">Book</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
