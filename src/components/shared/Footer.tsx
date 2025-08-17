"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function Footer() {
  const { getFooterContent, loading } = useSiteContent();
  const footerContent = getFooterContent();

  return (
    <footer className="px-4 sm:px-6 lg:px-8 py-12 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/Liberte_black_last.svg"
            alt="Liberté Logo"
            width={48}
            height={48}
            className="h-10 w-auto"
          />
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {loading
            ? "Loading..."
            : footerContent.description ||
              "Professional tattoo studio dedicated to creating unique, high-quality tattoos that tell your story."}
        </p>

        {/* Social Media */}
        <div className="flex justify-center mb-8">
          <a
            href="https://www.instagram.com/besho_tattoo/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-600 hover:text-black transition-colors"
          >
            <Instagram className="w-6 h-6" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-600 text-sm">
          <p>
            {loading
              ? "Loading..."
              : footerContent.copyright ||
                "© Mhanna Letters Berlin - Germany 2025"}
          </p>
          <Link
            href="/privacy"
            className="text-gray-600 hover:text-black transition-colors mt-2 inline-block"
          >
            {loading
              ? "Loading..."
              : footerContent.privacyLink || "Privacy Policy"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
