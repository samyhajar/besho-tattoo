"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { CheckCircle } from "lucide-react";
import BookingForm from "@/components/ui/BookingForm";
import { createClient } from "@/lib/supabase/browser-client";
import type { Availability } from "@/services/appointments";

export default function BookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slotId = searchParams.get("slot");

  const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setShowSuccess(true);
  };

  const handleCancel = () => {
    router.push("/contact");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Booking Error
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Back to Calendar
              </button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-center text-2xl">
                Booking Confirmed!
              </CardTitle>
              <CardDescription className="text-center">
                Your appointment has been successfully booked. We&apos;ll review
                your request and send you a confirmation email shortly.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">
                    What happens next?
                  </h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• We&apos;ll review your booking within 24 hours</p>
                    <p>• You&apos;ll receive an email confirmation</p>
                    <p>• Any reference images will help us prepare</p>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/portfolio")}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  View Our Portfolio
                </button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Your Booking
          </h1>
          <p className="text-gray-600">
            You&apos;re just one step away from booking your appointment
          </p>
        </div>

        <BookingForm
          selectedSlot={selectedSlot}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
}
