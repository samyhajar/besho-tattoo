"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  label?: string;
  className?: string;
}

export default function BackButton({ label = "Back", className = "" }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className={`lg:hidden flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 mb-4 ${className}`}
      aria-label="Go back"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <span className="text-base font-medium">{label}</span>
    </button>
  );
}