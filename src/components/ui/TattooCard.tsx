import Image from 'next/image';
import type { Tattoo } from '@/types/tattoo';

interface TattooCardProps {
  tattoo: Tattoo;
  signedUrl: string;
  index: number;
  onImageClick: (tattoo: Tattoo) => void;
}

export default function TattooCard({ tattoo, signedUrl, index, onImageClick }: TattooCardProps) {
  return (
    <div
      className="break-inside-avoid group cursor-pointer"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden rounded-lg mb-4 group-hover:shadow-2xl transition-all duration-500 cursor-pointer"
        onClick={() => onImageClick(tattoo)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onImageClick(tattoo);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`View ${tattoo.title} in full size`}
      >
        <Image
          src={signedUrl || '/placeholder-image.svg'}
          alt={tattoo.title}
          width={400}
          height={600}
          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-white font-semibold text-lg group-hover:text-white/80 transition-colors">
          {tattoo.title}
        </h3>

        {tattoo.category && (
          <span className="inline-block text-white/60 text-sm">
            {tattoo.category}
          </span>
        )}

        {tattoo.description && (
          <p className="text-white/70 text-sm leading-relaxed">
            {tattoo.description}
          </p>
        )}

        <p className="text-white/40 text-xs">
          {new Date(tattoo.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}