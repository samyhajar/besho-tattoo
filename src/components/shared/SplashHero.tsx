"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

/**
 * SplashHero – full-screen hero with brand logo and "Enter the website" CTA.
 * Keeps styling dark (black bg / white fg) and handles hover interaction.
 */
export default function SplashHero() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center gap-8 px-4">
      {/* Logo */}
      <Image
        src="/Liberte.png"
        alt="Besho Tattoo logo"
        width={600}
        height={600}
        priority
        className="w-4/5 max-w-[300px] sm:max-w-[500px] md:max-w-[600px] h-auto"
      />

      <Link
        href="/landing"
        className="group inline-flex items-center gap-2 border border-white px-6 py-3 rounded-full text-base sm:text-lg font-medium transition-colors hover:bg-white hover:text-black"
      >
        Enter the website
        <ArrowRight
          size={20}
          className="transition-transform group-hover:translate-x-1 group-hover:text-black"
        />
      </Link>
    </main>
  );
}