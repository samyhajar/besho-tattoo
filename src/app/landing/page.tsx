"use client";

import Header from "@/components/shared/Header";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 text-center">
        <h2 className="text-4xl sm:text-6xl font-bold">
          Welcome to <span className="text-gray-400">Besho Tattoo</span>
        </h2>
      </main>
    </div>
  );
}