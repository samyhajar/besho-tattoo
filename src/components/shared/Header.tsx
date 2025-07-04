"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
];

/**
 * Header component with brand logo and responsive navigation.
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="relative z-50 bg-[#0e1424] border-b border-gray-800">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
        {/* Mobile Menu Button - moved to left */}
        <button
          onClick={toggleMenu}
          className="lg:hidden z-50 p-2 rounded-md text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo - centered on mobile, left on desktop */}
        <Link
          href="/"
          className="flex items-center z-50 lg:ml-0 absolute left-1/2 transform -translate-x-1/2 lg:relative lg:left-0 lg:transform-none"
          onClick={closeMenu}
        >
          <Image
            src="/logo-besho.png"
            alt="Besho Tattoo logo"
            width={200}
            height={60}
            priority
            className="h-auto w-[140px] sm:w-[160px] lg:w-[200px]"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-white text-base xl:text-lg font-medium transition-colors hover:text-gray-300"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-full bg-white text-black px-4 xl:px-6 py-2 xl:py-3 text-base xl:text-lg font-medium transition-colors hover:bg-gray-200"
          >
            Book Now
          </Link>
        </nav>

        {/* Spacer for mobile to balance the layout */}
        <div className="lg:hidden w-10"></div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMenu}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              closeMenu();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[80vw] bg-[#0e1424] border-r border-gray-800 z-40 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col pt-20 px-6 space-y-1">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              className="text-white text-lg font-medium py-3 px-4 rounded-lg transition-colors hover:bg-white/10 active:bg-white/20"
            >
              {label}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-800 mt-4">
            <Link
              href="/contact"
              onClick={closeMenu}
              className="block w-full text-center rounded-full bg-white text-black px-6 py-3 text-lg font-medium transition-colors hover:bg-gray-200 active:bg-gray-300"
            >
              Book Now
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
