"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export default function DesignsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center py-16 sm:py-24">
          {/* Back Button */}
          <button
            onClick={() => router.push("/portfolio")}
            className="mb-8 flex items-center text-gray-600 hover:text-black transition-colors group mx-auto"
          >
            <svg
              className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Portfolio
          </button>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-light text-black mb-8 tracking-wide">
            Designs & Concepts
          </h1>

          {/* Divider */}
          <div className="w-24 h-px bg-black mx-auto mb-8 opacity-60" />

          {/* Coming Soon Message */}
          <div className="space-y-6">
            <p className="text-xl text-gray-600 font-light leading-relaxed">
              Our design collection is currently being curated
            </p>
            <p className="text-gray-500 leading-relaxed max-w-md mx-auto">
              We&apos;re preparing an exclusive showcase of our original artwork
              and concept designs. Check back soon to explore our creative
              process.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12">
            <button
              onClick={() => router.push("/book")}
              className="px-8 py-3 bg-black text-white rounded-full font-light tracking-wide hover:bg-gray-800 transition-all duration-300 hover:scale-105"
            >
              Book a Consultation
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
