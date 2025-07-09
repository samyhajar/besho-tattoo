"use client";

import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <Header />

      {/* Main Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-32 lg:py-40 min-h-[calc(100vh-80px)] flex items-center justify-center bg-white">
        {/* Content */}
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-black">
            Crafting sacred letters for your journey
          </h1>
        </div>
      </section>

      <Footer />
    </div>
  );
}
