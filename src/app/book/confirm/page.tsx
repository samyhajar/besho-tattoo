"use client";

import { Suspense } from "react";
import BookingConfirmContent from "./BookingConfirmContent";
import Header from "@/components/shared/Header";

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointment details...</p>
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
