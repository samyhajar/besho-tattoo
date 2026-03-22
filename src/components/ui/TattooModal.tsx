import PortfolioMediaCarousel from "@/components/shared/PortfolioMediaCarousel";
import { useLocale } from "@/contexts/LocaleContext";
import { formatDateForLocale } from "@/lib/i18n";
import type { Tattoo } from "@/types/tattoo";

interface TattooModalProps {
  tattoo: Tattoo;
  onClose: () => void;
}

export default function TattooModal({ tattoo, onClose }: TattooModalProps) {
  const { locale, copy } = useLocale();
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
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
      aria-label={copy.portfolio.closeImageViewer}
    >
      <div className="relative mx-auto flex max-h-[calc(100vh-1.5rem)] w-full max-w-[min(92vw,1180px)] cursor-default flex-col items-center justify-center overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-lg shadow-black/30 transition-all duration-300 hover:scale-110 hover:bg-white/20 sm:right-4 sm:top-4 sm:h-14 sm:w-14"
          aria-label={copy.portfolio.closeImageViewer}
          type="button"
        >
          <svg
            className="h-6 w-6 sm:h-7 sm:w-7"
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

        <div className="w-full max-w-[min(92vw,1180px)]">
          <PortfolioMediaCarousel tattoo={tattoo} theme="dark" />
        </div>

        <div className="mt-4 w-full text-center">
          <div className="mx-auto inline-block max-w-[min(88vw,760px)] rounded-2xl border border-white/10 bg-black/60 p-4 shadow-xl shadow-black/40 backdrop-blur-md sm:p-6">
            <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">
              {tattoo.title}
            </h2>
            <div className="flex items-center justify-center gap-4 text-sm sm:text-base">
              {tattoo.category ? (
                <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                  {tattoo.category}
                </span>
              ) : null}
              <span className="text-white/60">
                {formatDateForLocale(locale, new Date(tattoo.created_at), {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            {tattoo.description ? (
              <p className="mx-auto mt-3 max-w-md text-sm text-white/80 sm:text-base">
                {tattoo.description}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
