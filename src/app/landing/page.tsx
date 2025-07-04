"use client";

import Link from "next/link";
import { Calendar, Palette, Award, ArrowRight } from "lucide-react";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import RecentWorkGrid from "@/components/shared/RecentWorkGrid";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0e1424] text-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Besho Tattoo
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Where artistry meets skin. Discover unique tattoo designs and
              experience world-class craftsmanship in our premium studio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/portfolio"
                className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 min-w-[200px] flex items-center justify-center gap-2"
              >
                View Portfolio
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="border border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-all duration-200 min-w-[200px]"
              >
                Book Consultation
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  500+
                </div>
                <div className="text-sm text-gray-400">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  5+
                </div>
                <div className="text-sm text-gray-400">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  50+
                </div>
                <div className="text-sm text-gray-400">Unique Designs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  4.9
                </div>
                <div className="text-sm text-gray-400">Star Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-[#0e1424]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Services
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Professional tattoo services with attention to detail and artistic
              excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-[#0e1424] border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Custom Designs</h3>
              <p className="text-gray-400 leading-relaxed">
                Unique, personalized tattoo designs created specifically for
                you. From concept to completion, every piece is one-of-a-kind.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-[#0e1424] border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Premium Quality</h3>
              <p className="text-gray-400 leading-relaxed">
                Using only the finest equipment and highest-grade inks to ensure
                your tattoo looks vibrant and lasts a lifetime.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-[#0e1424] border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Easy Booking</h3>
              <p className="text-gray-400 leading-relaxed">
                Simple online booking system. Schedule your consultation and get
                started on your tattoo journey today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-[#0e1424]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Recent Work</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore our latest tattoo creations and get inspired for your next
              piece
            </p>
          </div>

          <RecentWorkGrid />

          <div className="text-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              View Full Portfolio
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Start Your Tattoo Journey?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Book your consultation today and let&apos;s create something
            extraordinary together. Your story, our artistry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 min-w-[200px] flex items-center justify-center gap-2"
            >
              Book Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/portfolio"
              className="border border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-all duration-200 min-w-[200px]"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
