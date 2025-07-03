"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/tattoos", label: "Tattoos" },
  { href: "/dashboard/availabilities", label: "Availabilities" },
  { href: "/dashboard/appointments", label: "Appointments" },
  { href: "/dashboard/products", label: "Products" },
  { href: "/dashboard/orders", label: "Orders" },
];

export default function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
            aria-expanded="false"
            aria-label="Toggle navigation menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 cursor-pointer"
            onClick={toggleMobileMenu}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                toggleMobileMenu();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Close mobile menu"
          />
          <div className="relative flex flex-col w-full max-w-xs h-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {user && (
                <p className="mb-6 text-sm text-gray-500 truncate">{user.email}</p>
              )}
              <nav className="space-y-2">
                {links.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={toggleMobileMenu}
                      className={clsx(
                        "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-gray-900 text-white shadow-sm"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="p-4 border-t border-gray-200">
              <Button
                onClick={() => void signOut()}
                variant="secondary"
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={clsx(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:border-r lg:border-gray-200 lg:bg-white lg:p-6 lg:shadow-sm",
          className,
        )}
      >
        <div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Admin Panel</h2>
          {user && (
            <p className="mb-8 text-sm text-gray-500 truncate">{user.email}</p>
          )}
        </div>
        <nav className="space-y-1 flex-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-200">
          <Button
            onClick={() => void signOut()}
            variant="secondary"
            className="w-full"
          >
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
}