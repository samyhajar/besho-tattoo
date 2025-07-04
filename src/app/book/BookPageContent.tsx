"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { CheckCircle } from "lucide-react";
import BookingForm from "@/components/ui/BookingForm";
import BookingSuccess from "./BookingSuccess";
import { createClient } from "@/lib/supabase/browser-client";
import type { Availability } from "@/services/appointments";

export default function BookPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slotId = searchParams.get("slot");

  const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const loadSlot = async () => {
      if (!slotId) {
        setError("No appointment slot selected");
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
          throw new Error("This time slot is no longer available");
        }

        setSelectedSlot(data);
      } catch (err) {
        console.error("Error loading slot:", err);
        setError(
          "Failed to load appointment slot. It may no longer be available.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadSlot();
  }, [slotId]);

  const handleSuccess = () => {
    setBookingSuccess(true);
  };

  const handleCancel = () => {
    router.push("/contact");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Booking Error
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Calendar
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (bookingSuccess) {
    return <BookingSuccess />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Complete Your Booking
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            You&apos;re just one step away from booking your appointment
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-md mx-auto mb-6 sm:mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-6 h-6 rounded-full border-2 border-green-600 bg-green-600 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="font-medium">Date</span>
              </div>

              <div className="w-8 h-0.5 bg-green-600"></div>

              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-6 h-6 rounded-full border-2 border-green-600 bg-green-600 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="font-medium">Time</span>
              </div>

              <div className="w-8 h-0.5 bg-green-600"></div>

              <div className="flex items-center space-x-2 text-blue-600">
                <div className="w-6 h-6 rounded-full border-2 border-blue-600 bg-blue-600 flex items-center justify-center">
                  <span className="text-xs text-white font-medium">3</span>
                </div>
                <span className="font-medium">Book</span>
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
    </div>
  );
}
