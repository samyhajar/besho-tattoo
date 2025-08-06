"use client";

import Image from "next/image";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      {/* Main Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/IMG_5004.JPG"
            alt="Besho Tattoo Artist at Work"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white mb-6">
            Crafting Sacred Letters
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-8 max-w-3xl mx-auto">
            For Your Journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/portfolio"
              className="bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-white/90 transition-colors duration-300 w-full sm:w-auto text-center"
            >
              View Portfolio
            </a>
            <a
              href="/book"
              className="border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-black transition-all duration-300 w-full sm:w-auto text-center"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
