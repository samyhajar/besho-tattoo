"use client";

import { Suspense } from "react";
import BookingConfirmContent from "./BookingConfirmContent";
import Header from "@/components/shared/Header";
import { useLocale } from "@/contexts/LocaleContext";

function LoadingSkeleton() {
  const { copy } = useLocale();

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

export default function BookingConfirmPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <BookingConfirmContent />
    </Suspense>
  );
}
