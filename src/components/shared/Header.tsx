"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";

interface HeaderProps {
  variant?: "default" | "home";
}

const portfolioItems = [
  { href: "/portfolio/tattoos", label: "Tattoos" },
  { href: "/portfolio/designs", label: "Designs" },
  { href: "/portfolio/art", label: "Art" },
];

export default function Header({ variant = "default" }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const pathname = usePathname();
  const isHomeVariant = variant === "home";

  const navItems = isHomeVariant
    ? [
        { href: "/", label: "Home" },
        { href: "/portfolio", label: "Portfolio" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/portfolio", label: "Portfolio" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
      ];

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const updateScrollState = () => {
      setHasScrolled(window.scrollY > 10);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isMenuOpen]);

  const isActiveLink = (href: string) => {
    if (href === "/portfolio") {
      return pathname === "/portfolio" || pathname.startsWith("/portfolio/");
    }

    return pathname === href;
  };

  const desktopLinkClassName = isHomeVariant
    ? "font-home-sans text-[0.82rem] uppercase tracking-[0.24em] text-white/82 hover:text-white"
    : "font-home-sans text-[0.82rem] uppercase tracking-[0.24em] text-white/82 hover:text-white";

  const desktopDropdownClassName = isHomeVariant
    ? "border border-white/10 bg-[#0d0d0d]/95 text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
    : "border border-white/10 bg-[#0d0d0d] text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)]";

  const mobileLinkClassName = isHomeVariant
    ? "font-home-sans text-sm uppercase tracking-[0.24em] text-white/85 hover:text-white sm:text-[0.98rem] md:text-[1.04rem]"
    : "font-home-sans px-2 text-sm uppercase tracking-[0.24em] text-white/85 hover:text-white sm:text-[0.98rem] md:text-[1.04rem]";

  const renderNavLink = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      className={`group relative pb-2 transition-all duration-300 ${desktopLinkClassName}`}
    >
      {label}
      <span
        className={`absolute bottom-0 left-0 h-px transition-all duration-300 ${
          isActiveLink(href)
            ? isHomeVariant
              ? "w-full bg-white"
              : "w-full bg-white"
            : isHomeVariant
              ? "w-0 bg-white group-hover:w-full"
              : "w-0 bg-white group-hover:w-full"
        }`}
      />
    </Link>
  );

  const headerClassName = `sticky top-0 z-50 text-white transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
    isMenuOpen
      ? "bg-[#0d0d0d] shadow-[0_16px_40px_rgba(0,0,0,0.22)]"
      : hasScrolled
        ? "bg-[#0d0d0d]/88 shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl"
        : isHomeVariant
          ? "bg-[#0d0d0d]"
          : "bg-[#0d0d0d]/95 backdrop-blur-md"
  }`;

  return (
    <>
      <header className={headerClassName}>
        <div
          className={`flex items-center justify-between ${
            isHomeVariant
              ? "px-5 py-5 sm:px-8 lg:px-16"
              : "px-6 py-0 sm:px-8 lg:px-16"
          }`}
        >
          <Link href="/" className="z-50 flex items-center" onClick={closeMenu}>
            <Image
              src="/lastlastlogo.png"
              alt="Besho Tattoo Logo"
              width={isHomeVariant ? 44 : 100}
              height={isHomeVariant ? 44 : 100}
              className={`w-auto ${
                isHomeVariant
                  ? "h-11 brightness-0 invert sm:h-11"
                  : "h-20 brightness-0 invert sm:h-24"
              }`}
              priority
            />
            {isHomeVariant ? (
              <div className="ml-4 flex flex-col justify-center text-white">
                <span className="font-home-serif max-w-[210px] whitespace-nowrap text-[0.82rem] uppercase leading-none tracking-[0.09em] sm:hidden">
                  THINK.BEFORE.YOU.INK
                </span>
                <span className="font-home-serif hidden text-[24px] uppercase leading-none tracking-[0.22em] sm:block">
                  THINK.BEFORE.YOU.INK
                </span>
              </div>
            ) : null}
          </Link>

          <nav
            className={`hidden items-center lg:flex ${
              isHomeVariant ? "gap-10 lg:gap-12" : "gap-12 lg:gap-16"
            }`}
          >
            {navItems.map(({ href, label }) => {
              if (href !== "/portfolio") {
                return renderNavLink(href, label);
              }

              return (
                <div key={href} className="group relative">
                  <Link
                    href={href}
                    className={`group relative flex items-center gap-2 pb-2 transition-all duration-300 ${desktopLinkClassName}`}
                  >
                    {label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180 ${
                        isHomeVariant ? "text-white/70" : "text-white/70"
                      }`}
                    />
                    <span
                      className={`absolute bottom-0 left-0 h-px transition-all duration-300 ${
                        isActiveLink(href)
                          ? isHomeVariant
                            ? "w-full bg-white"
                            : "w-full bg-white"
                          : isHomeVariant
                            ? "w-0 bg-white group-hover:w-full"
                            : "w-0 bg-white group-hover:w-full"
                      }`}
                    />
                  </Link>

                  <div className="pointer-events-none absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 translate-y-2 pt-4 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <div className={`rounded-none ${desktopDropdownClassName}`}>
                      {portfolioItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-5 py-4 text-sm uppercase tracking-[0.22em] transition-colors duration-200 ${
                              isHomeVariant
                                ? isActive
                                  ? "bg-white/[0.06] text-white"
                                  : "text-white/72 hover:bg-white/[0.04] hover:text-white"
                                : isActive
                                  ? "bg-white/[0.06] text-white"
                                  : "text-white/72 hover:bg-white/[0.04] hover:text-white"
                            }`}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          <button
            onClick={toggleMenu}
            className={`z-50 rounded-lg p-3 transition-colors sm:p-3.5 md:p-4 lg:hidden ${
              isHomeVariant
                ? "text-white hover:bg-white/8"
                : "text-white hover:bg-white/8"
            } ${isMenuOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-7 w-7 sm:h-8 sm:w-8" />
            ) : (
              <Menu
                className="h-7 w-7 sm:h-8 sm:w-8 md:h-[2.1rem] md:w-[2.1rem]"
                strokeWidth={1.5}
              />
            )}
          </button>
        </div>
      </header>

      {isMenuOpen ? (
        <div
          className={`fixed inset-0 z-[60] backdrop-blur-md lg:hidden ${
            isHomeVariant
              ? "bg-black/42 supports-[backdrop-filter]:bg-black/28"
              : "bg-black/42 supports-[backdrop-filter]:bg-black/28"
          }`}
          onClick={closeMenu}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              closeMenu();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        />
      ) : null}

      <div
        className={`fixed left-0 top-0 z-[70] h-full transform transition-all duration-300 ease-in-out lg:hidden ${
          isHomeVariant
            ? "w-[82vw] max-w-[31rem] bg-[#0d0d0d] text-white shadow-[10px_0_28px_rgba(0,0,0,0.34)] sm:w-[25.5rem] md:w-[29rem]"
            : "w-[82vw] max-w-[31rem] bg-[#0d0d0d] text-white shadow-[10px_0_28px_rgba(0,0,0,0.34)] sm:w-[25.5rem] md:w-[29rem]"
        } ${
          isMenuOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-full opacity-100"
        }`}
      >
        <div className="relative flex h-full flex-col">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -right-5 w-5 bg-gradient-to-r from-white/[0.05] via-white/[0.015] to-transparent opacity-70"
          />
          <div className="flex items-center justify-between px-5 py-5 sm:px-6 sm:py-6 md:px-8 md:py-7">
            <Link href="/" className="flex items-center" onClick={closeMenu}>
              <Image
                src="/lastlastlogo.png"
                alt="Besho Tattoo Logo"
                width={44}
                height={44}
                className="h-10 w-auto brightness-0 invert sm:h-11 md:h-[3.35rem]"
              />
              {isHomeVariant ? (
                <div className="ml-4 flex flex-col justify-center text-white sm:ml-[1.1rem] md:ml-[1.25rem]">
                  <span className="font-home-serif max-w-[170px] whitespace-nowrap text-[0.64rem] uppercase leading-none tracking-[0.08em] sm:max-w-none sm:text-[0.8rem] md:text-[1.06rem] md:tracking-[0.12em]">
                    THINK.BEFORE.YOU.INK
                  </span>
                </div>
              ) : null}
            </Link>

            <button
              type="button"
              onClick={closeMenu}
              className="rounded-full p-2 text-white/70 transition-colors duration-300 hover:bg-white/8 hover:text-white sm:p-2.5 md:p-3"
              aria-label="Close menu panel"
            >
              <X
                className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5 md:h-[1.35rem] md:w-[1.35rem]"
                strokeWidth={1.35}
              />
            </button>
          </div>

          <nav className="flex flex-col px-8 pt-8 sm:px-10 sm:pt-10 md:px-12 md:pt-12">
            {navItems.map(({ href, label }) => {
              if (href !== "/portfolio") {
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMenu}
                    className={`${mobileLinkClassName} py-4 transition-all duration-300 ${
                      isActiveLink(href)
                        ? isHomeVariant
                          ? "text-white"
                          : "text-white"
                        : ""
                    }`}
                  >
                    {label}
                  </Link>
                );
              }

              return (
                <div key={href} className="py-4 sm:py-5">
                  <Link
                    href={href}
                    onClick={closeMenu}
                    className={`flex items-center gap-2 transition-all duration-300 ${mobileLinkClassName}`}
                  >
                    {label}
                    <ChevronDown className="h-4 w-4" />
                  </Link>
                  <div
                    className={`mt-3 border-l pl-4 ${
                      isHomeVariant ? "border-white/12" : "border-white/12"
                    }`}
                  >
                    {portfolioItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenu}
                        className={`block py-3 text-sm uppercase tracking-[0.22em] transition-colors duration-300 sm:text-[0.94rem] md:text-[1rem] ${
                          isHomeVariant
                            ? pathname === item.href
                              ? "text-white"
                              : "text-white/72 hover:text-white"
                            : pathname === item.href
                              ? "text-white"
                              : "text-white/72 hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
