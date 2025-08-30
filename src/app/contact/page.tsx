"use client";

import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import ContactInfo from "@/components/shared/ContactInfo";
import ContactForm from "@/components/shared/ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <div className="flex-1 px-6 sm:px-8 lg:px-16 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-wider text-black mb-6">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions about our work or want to discuss a potential project? We&apos;d love to hear from you.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-0">
            {/* Left Column - Contact Information */}
            <ContactInfo />

            {/* Separator Line - Only visible on lg+ screens */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 transform -translate-x-1/2"></div>

            {/* Right Column - Contact Form */}
            <ContactForm />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
