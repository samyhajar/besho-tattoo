"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import CalendarView from "@/components/ui/CalendarView";
import TimeSlotSelector from "@/components/ui/TimeSlotSelector";
import { fetchAvailableSlots } from "@/services/appointments";
import type { Availability } from "@/services/appointments";

export default function ContactPage() {
  const router = useRouter();
  const [availableSlots, setAvailableSlots] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate] = useState(new Date());

  const loadAvailableSlots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get slots for the current month
      const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      );

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
  }, [currentDate]);

  useEffect(() => {
    void loadAvailableSlots();
  }, [currentDate, loadAvailableSlots]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: Availability) => {
    setSelectedSlot(slot);
  };

  const handleProceedToBooking = () => {
    if (selectedSlot) {
      router.push(`/book?slot=${selectedSlot.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Book Your Appointment
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select an available date and time for your tattoo consultation or
            session.
          </p>
        </div>

        {/* Calendar and Time Selection */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Calendar */}
          <CalendarView
            availableSlots={availableSlots}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            loading={loading}
            error={error}
          />

          {/* Time Slot Selection */}
          <TimeSlotSelector
            selectedDate={selectedDate}
            availableSlots={availableSlots}
            selectedSlot={selectedSlot}
            onSlotSelect={handleSlotSelect}
            onProceedToBooking={handleProceedToBooking}
          />
        </div>
      </main>
    </div>
  );
}
