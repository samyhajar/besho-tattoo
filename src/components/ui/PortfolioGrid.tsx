import TattooCard from './TattooCard';
import type { Tattoo } from '@/types/tattoo';

interface PortfolioGridProps {
  tattoos: Tattoo[];
  signedUrls: Record<string, string>;
  onTattooClick: (tattoo: Tattoo) => void;
}

export default function PortfolioGrid({ tattoos, signedUrls, onTattooClick }: PortfolioGridProps) {
  if (tattoos.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No tattoos found</h3>
        <p className="text-white/60">Check back soon for new artwork!</p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 sm:gap-6 md:gap-8 space-y-4 sm:space-y-6 md:space-y-8">
      {tattoos.map((tattoo, index) => (
        <TattooCard
          key={tattoo.id}
          tattoo={tattoo}
          signedUrl={signedUrls[tattoo.image_url]}
          index={index}
          onImageClick={onTattooClick}
        />
      ))}
    </div>
  );
}