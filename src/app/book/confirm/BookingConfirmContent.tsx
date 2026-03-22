"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { CheckCircle } from "lucide-react";
import BookingForm from "@/components/ui/BookingForm";
import BookingSuccess from "../BookingSuccess";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import { useLocale } from "@/contexts/LocaleContext";
import { createClient } from "@/lib/supabase/browser-client";
import type { Availability, Appointment } from "@/services/appointments";

export default function BookingConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { copy } = useLocale();
  const slotId = searchParams.get("slot");

  const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookedAppointment, setBookedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    const loadSlot = async () => {
      if (!slotId) {
        setError(copy.booking.noAppointmentSlotSelected);
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("availabilities")
          .select("*")
          .eq("id", slotId)
          .eq("is_booked", false)
          .single();

        if (error) throw error;
        if (!data) {
          throw new Error(copy.booking.timeSlotUnavailable);
        }

        setSelectedSlot(data);
      } catch (err) {
        console.error("Error loading slot:", err);
        setError(copy.booking.failedToLoadSlot);
      } finally {
        setLoading(false);
      }
    };

    void loadSlot();
  }, [
    copy.booking.failedToLoadSlot,
    copy.booking.noAppointmentSlotSelected,
    copy.booking.timeSlotUnavailable,
    slotId,
  ]);

  const handleSuccess = (appointment: Appointment) => {
    setBookedAppointment(appointment);
    setBookingSuccess(true);
  };

  const handleCancel = () => {
    router.push("/book");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d]">
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d]">
          <div className="text-center p-6">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
            <p className="text-neutral-400">
              {copy.booking.loadingAppointmentDetails}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0d0d]">
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d] p-4">
          <Card className="w-full max-w-md bg-white border-gray-200">
            <CardContent className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-2">
                {copy.booking.bookingError}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">{error}</p>
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                {copy.booking.backToCalendar}
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return <BookingSuccess appointment={bookedAppointment} />;
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Header />

      <div className="min-h-screen bg-[#0d0d0d]">
        <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="mb-3 text-2xl font-bold text-white sm:text-3xl lg:mb-4 lg:text-4xl">
              {copy.booking.completeBooking}
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-neutral-400 sm:text-base lg:text-lg">
              {copy.booking.oneStepAway}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="max-w-md mx-auto mb-6 sm:mb-8">
            <div className="rounded-lg border border-white/10 bg-[#141414] p-4">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-2 text-white">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-white">
                    <div className="h-2 w-2 rounded-full bg-black"></div>
                  </div>
                  <span className="font-medium">{copy.booking.stepDate}</span>
                </div>

                <div className="h-0.5 w-8 bg-white"></div>

                <div className="flex items-center space-x-2 text-white">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-white">
                    <div className="h-2 w-2 rounded-full bg-black"></div>
                  </div>
                  <span className="font-medium">{copy.booking.stepTime}</span>
                </div>

                <div className="h-0.5 w-8 bg-white"></div>

                <div className="flex items-center space-x-2 text-white">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-white">
                    <span className="text-xs font-medium text-black">3</span>
                  </div>
                  <span className="font-medium">{copy.booking.stepBook}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <BookingForm
            selectedSlot={selectedSlot}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>

        <Footer />
      </div>
    </div>
  );
}
