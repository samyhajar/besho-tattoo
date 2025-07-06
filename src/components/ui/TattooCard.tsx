import Image from 'next/image';
import { useState } from 'react';
import type { Tattoo } from '@/types/tattoo';

interface TattooCardProps {
  tattoo: Tattoo;
  signedUrl: string;
  index: number;
  onImageClick: (tattoo: Tattoo) => void;
}

export default function TattooCard({ tattoo, signedUrl, index, onImageClick }: TattooCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleClick = () => {
    if (!imageError && signedUrl) {
      onImageClick(tattoo);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className="group cursor-pointer animate-fade-in"
      style={{
        animationDelay: `${index * 150}ms`,
        animationFillMode: 'both'
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View ${tattoo.title || 'Untitled'} tattoo in full size`}
    >
      {/* Main Card Container */}
      <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-500 ease-out hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-2 hover:scale-[1.02]">

        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {/* Loading State */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          )}

          {/* Error State */}
          {imageError && (
            <div className="absolute inset-0 bg-red-500/10 flex flex-col items-center justify-center text-white/60">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm">Image unavailable</p>
            </div>
          )}

          {/* Actual Image */}
          {signedUrl && !imageError && (
            <Image
              src={signedUrl}
              alt={tattoo.title || 'Tattoo artwork'}
              fill
              className={`object-cover transition-all duration-700 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}

          {/* No URL fallback */}
          {!signedUrl && (
            <div className="absolute inset-0 bg-gray-500/10 flex flex-col items-center justify-center text-white/40">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">No image</p>
            </div>
          )}

          {/* Hover Overlay */}
          {signedUrl && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  <span className="text-white font-medium text-sm">View Full Size</span>
                </div>
              </div>
            </div>
          )}

          {/* Shine Effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-white mb-1 line-clamp-1">
            {tattoo.title || 'Untitled'}
          </h3>
          {tattoo.description && (
            <p className="text-white/70 text-sm line-clamp-2 leading-relaxed">
              {tattoo.description}
            </p>
          )}
          {tattoo.category && (
            <div className="mt-2">
              <span className="inline-block px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full font-medium">
                {tattoo.category}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}