import Image from 'next/image';
import type { Tattoo } from '@/types/tattoo';

interface TattooModalProps {
  tattoo: Tattoo;
  signedUrl: string;
  onClose: () => void;
}

export default function TattooModal({ tattoo, signedUrl, onClose }: TattooModalProps) {
  return (
    <button
      className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 border-none cursor-pointer"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      type="button"
      aria-label="Close tattoo image viewer"
    >
      <div className="relative max-w-7xl w-full max-h-[95vh] sm:max-h-[90vh] flex items-center justify-center">
        {/* Close button */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="bg-transparent border-none p-0 cursor-default"
          type="button"
          aria-label={`Full size view of ${tattoo.title}`}
        >
          <Image
            src={signedUrl || '/placeholder-image.svg'}
            alt={tattoo.title}
            width={1000}
            height={1000}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </button>

        {/* Image Info */}
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 text-center">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 inline-block">
            <h2 className="text-white font-bold text-lg sm:text-xl mb-1">
              {tattoo.title}
            </h2>
            {tattoo.category && (
              <p className="text-white/80 text-sm">
                {tattoo.category}
              </p>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}