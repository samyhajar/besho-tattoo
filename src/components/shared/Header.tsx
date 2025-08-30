"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

/**
 * Header component with brand logo and responsive navigation.
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/portfolio",
      label: "Portfolio",
    },
    {
      href: "/contact",
      label: "Contact",
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="relative z-50 bg-white">
      <div className="flex items-center justify-between px-6 sm:px-8 lg:px-16 py-4 sm:py-6">
        {/* Logo - always on the left */}
        <Link href="/" className="flex items-center z-50" onClick={closeMenu}>
          <Image
            src="/Liberte_black_last.svg"
            alt="Liberté Logo"
            width={60}
            height={60}
            className="h-12 w-auto sm:h-14"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-12 lg:gap-16">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-black text-xl lg:text-2xl font-light tracking-wide transition-all duration-500 ease-out hover:tracking-widest hover:text-gray-600 relative group"
            >
              {label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-500 ease-out group-hover:w-full"></span>
            </Link>
          ))}
          <Link
            href="/book"
            className="bg-black text-white px-10 py-4 text-xl font-medium tracking-wide transition-all duration-500 ease-out hover:bg-gray-800 hover:scale-105 hover:shadow-xl hover:tracking-widest rounded-full"
          >
            Bookings
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden z-50 p-3 text-black hover:bg-gray-100 transition-colors rounded-lg"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
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
        className={`fixed top-0 left-0 h-full w-80 max-w-[80vw] bg-white border-r border-gray-200 z-40 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col pt-24 px-8 space-y-4">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              className="text-black text-2xl font-light py-4 px-2 tracking-wide transition-all duration-300 hover:bg-gray-50 active:bg-gray-100 hover:tracking-wider"
            >
              {label}
            </Link>
          ))}
          <div className="pt-8 mt-8">
            <Link
              href="/book"
              onClick={closeMenu}
              className="block w-full text-center bg-black text-white px-8 py-5 text-xl font-medium tracking-wide transition-all duration-300 hover:bg-gray-800 active:bg-gray-900 rounded-full"
            >
              Bookings
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
