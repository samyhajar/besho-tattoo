import Image from "next/image";
import type { Tattoo } from "@/types/tattoo";

interface TattooModalProps {
  tattoo: Tattoo;
  publicUrl: string;
  onClose: () => void;
}

export default function TattooModal({
  tattoo,
  publicUrl,
  onClose,
}: TattooModalProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/95 p-3 backdrop-blur-md sm:p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Close image viewer"
    >
      <div className="relative flex w-full max-w-[min(92vw,1180px)] cursor-default flex-col items-center justify-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 border border-white/20 shadow-lg shadow-black/30"
          aria-label="Close image viewer"
          type="button"
        >
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image Container */}
        <div className="relative flex max-h-[78vh] w-full max-w-[min(92vw,1180px)] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/50 backdrop-blur-sm">
          <Image
            src={publicUrl || "/placeholder-image.svg"}
            alt={tattoo.title}
            width={1000}
            height={1000}
            className="h-auto max-h-[78vh] w-auto max-w-full object-contain"
          />
        </div>

        {/* Image Info */}
        <div className="mt-4 w-full text-center">
          <div className="mx-auto inline-block max-w-[min(88vw,760px)] rounded-2xl border border-white/10 bg-black/60 p-4 shadow-xl shadow-black/40 backdrop-blur-md sm:p-6">
            <h2 className="text-white font-bold text-xl sm:text-2xl mb-2">
              {tattoo.title}
            </h2>
            <div className="flex items-center justify-center gap-4 text-sm sm:text-base">
              {tattoo.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 backdrop-blur-sm">
                  {tattoo.category}
                </span>
              )}
              <span className="text-white/60">
                {new Date(tattoo.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            {tattoo.description && (
              <p className="text-white/80 text-sm sm:text-base mt-3 max-w-md mx-auto">
                {tattoo.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
