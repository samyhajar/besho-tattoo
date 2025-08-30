"use client";

import Image from "next/image";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import AboutMe from "@/components/shared/AboutMe";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function HomePage() {
  const { getHeroContent, loading } = useSiteContent();
  const heroContent = getHeroContent();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      {/* Main Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/IMG_5112.JPG"
            alt="Besho Tattoo Artist at Work"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white mb-6">
            {loading
              ? "Loading..."
              : heroContent.title || "Crafting Sacred Letters"}
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-6 max-w-3xl mx-auto">
            {loading
              ? "Loading..."
              : heroContent.subtitle || "Where Ancient Traditions Meet Modern Art"}
          </p>
          {heroContent.description && (
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              {heroContent.description}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/portfolio"
              className="bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-white/90 transition-colors duration-300 w-full sm:w-auto text-center"
            >
              {loading
                ? "Loading..."
                : heroContent.portfolioButton || "View Portfolio"}
            </a>
            <a
              href="/book"
              className="border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-black transition-all duration-300 w-full sm:w-auto text-center"
            >
              {loading
                ? "Loading..."
                : heroContent.bookingButton || "Book Appointment"}
            </a>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <AboutMe />

      <Footer />
    </div>
  );
}
