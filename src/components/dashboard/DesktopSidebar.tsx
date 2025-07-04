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

interface DesktopSidebarProps {
  className?: string;
  links: LinkItem[];
}

export default function DesktopSidebar({ className, links }: DesktopSidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside
      className={clsx(
        "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:border-r lg:border-gray-100 lg:bg-white lg:shadow-sm",
        className,
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Besho Studio
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Admin Panel</p>
          </div>
        </div>
        {user && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
            <p className="text-xs text-gray-500 mt-1">Administrator</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-4 text-base font-medium transition-all duration-200 group",
                  active
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <span className={clsx(
                  "transition-colors duration-200",
                  active
                    ? "text-white"
                    : "text-gray-400 group-hover:text-gray-600"
                )}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
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
    </aside>
  );
}