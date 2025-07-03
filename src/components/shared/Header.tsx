"use client";

import Link from "next/link";
import Image from "next/image";

const navItems = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/shop", label: "Shop", pill: true },
];

/**
 * Header component with brand logo and navigation.
 */
export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 sm:px-12 py-6">
      <Link href="/" className="flex items-center">
        <Image
          src="/logo-besho.png"
          alt="Besho Tattoo logo"
          width={200}
          height={60}
          priority
          className="h-auto w-[160px] sm:w-[200px]"
        />
      </Link>

      <nav className="flex flex-wrap gap-4 sm:gap-6 text-sm sm:text-base justify-end">
        {navItems.map(({ href, label, pill }) => (
          <Link
            key={href}
            href={href}
            className={
              pill
                ? "rounded-full bg-white text-black px-3 sm:px-4 py-1 font-medium transition-colors hover:bg-gray-200"
                : "transition-colors hover:text-gray-300"
            }
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}