"use client";

import Link from "next/link";
import Header from "@/components/shared/Header";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold">
            Welcome to <span className="text-gray-400">Besho Tattoo</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover unique tattoo artistry and explore our collection of custom designs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/portfolio"
              className="bg-black text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200 min-w-[200px]"
            >
              View Portfolio
            </Link>
            <Link
              href="/contact"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200 min-w-[200px]"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}