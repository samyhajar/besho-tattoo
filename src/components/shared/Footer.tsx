"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="px-4 sm:px-6 lg:px-8 py-12 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/lastlastlogo.png"
            alt="Besho Tattoo Logo"
            width={80}
            height={80}
            className="h-18 w-auto"
          />
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Professional tattoo studio dedicated to creating unique, high-quality
          tattoos that tell your story.
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
          <p>© Think before you ink - Irak {new Date().getFullYear()}</p>
          <Link
            href="/privacy"
            className="text-gray-600 hover:text-black transition-colors mt-2 inline-block"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
