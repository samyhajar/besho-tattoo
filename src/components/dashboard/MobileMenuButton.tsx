interface MobileMenuButtonProps {
  toggleMobileMenu: () => void;
}

export default function MobileMenuButton({ toggleMobileMenu }: MobileMenuButtonProps) {
  return (
    <div className="lg:hidden bg-white border-b border-gray-100 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileMenu}
          className="p-2.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
          aria-expanded="false"
          aria-label="Toggle navigation menu"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Besho Studio</h2>
        </div>
      </div>
    </div>
  );
}