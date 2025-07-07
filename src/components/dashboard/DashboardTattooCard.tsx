import Image from 'next/image';
import type { Tattoo } from '@/types/tattoo';

interface DashboardTattooCardProps {
  tattoo: Tattoo;
  signedUrl: string;
  onTattooClick: (tattoo: Tattoo) => void;
}

export default function DashboardTattooCard({ tattoo, signedUrl, onTattooClick }: DashboardTattooCardProps) {
  return (
    <div
      className="group cursor-pointer"
      onClick={() => onTattooClick(tattoo)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onTattooClick(tattoo);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${tattoo.title}`}
    >
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3 group-hover:shadow-lg transition-shadow">
        <Image
          src={signedUrl || '/placeholder-image.svg'}
          alt={tattoo.title}
          width={300}
          height={300}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Visibility Badge */}
        <div className="absolute top-2 right-2">
          {tattoo.is_public ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              ✅ Public
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
              🔒 Private
            </span>
          )}
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
          {tattoo.title}
        </h3>
        {tattoo.category && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
            {tattoo.category}
          </span>
        )}
        <p className="text-xs text-gray-500">
          {new Date(tattoo.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}