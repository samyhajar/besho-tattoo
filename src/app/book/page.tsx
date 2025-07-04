"use client";

import { Suspense } from "react";
import BookPageContent from "@/app/book/BookPageContent";

function BookPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1424] to-[#0e1424] flex items-center justify-center">
      <div className="text-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-gray-300">Loading booking page...</p>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<BookPageSkeleton />}>
      <BookPageContent />
    </Suspense>
  );
}
