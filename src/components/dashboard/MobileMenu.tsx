import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";

interface LinkItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  links: LinkItem[];
}

export default function MobileMenu({ isMobileMenuOpen, toggleMobileMenu, links }: MobileMenuProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <div className={clsx(
      "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
      isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm cursor-pointer"
        onClick={toggleMobileMenu}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            toggleMobileMenu();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Close mobile menu"
      />
      <div className={clsx(
        "relative flex flex-col w-full max-w-xs h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <button
            onClick={toggleMobileMenu}
            className="p-2.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200"
            aria-label="Close menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Besho Studio
            </h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {user && (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.email}
              </p>
              <p className="text-xs text-gray-500 mt-1">Administrator</p>
            </div>
          )}
          <nav className="space-y-1">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={toggleMobileMenu}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-4 text-base font-medium transition-all duration-200",
                    active
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-100">
          <Button
            onClick={() => void signOut()}
            variant="secondary"
            className="w-full justify-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 border-gray-200 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}