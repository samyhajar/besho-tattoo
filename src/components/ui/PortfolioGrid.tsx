import TattooCard from "./TattooCard";
import type { Tattoo } from "@/types/tattoo";

interface PortfolioGridProps {
  tattoos: Tattoo[];
  publicUrls: Record<string, string>;
  onTattooClick: (tattoo: Tattoo) => void;
}

export default function PortfolioGrid({
  tattoos,
  publicUrls,
  onTattooClick,
}: PortfolioGridProps) {
  if (tattoos.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-200">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-light text-black mb-2 tracking-wide">
          No tattoos found
        </h3>
        <p className="text-gray-600">Check back soon for new artwork!</p>
      </div>
    );
  }

  // Distribute tattoos across columns for masonry effect
  const distributeIntoColumns = (items: Tattoo[], numColumns: number) => {
    const columns: Tattoo[][] = Array.from({ length: numColumns }, () => []);

    items.forEach((item, index) => {
      const columnIndex = index % numColumns;
      columns[columnIndex].push(item);
    });

    return columns;
  };

  // Different column counts for different screen sizes
  const mobileColumns = distributeIntoColumns(tattoos, 2);
  const tabletColumns = distributeIntoColumns(tattoos, 3);
  const desktopColumns = distributeIntoColumns(tattoos, 4);

  return (
    <>
      {/* Mobile: 2 columns */}
      <div className="grid grid-cols-2 gap-4 md:hidden">
        {mobileColumns.map((column, columnIndex) => (
          <div
            key={`mobile-col-${columnIndex}`}
            className="flex flex-col gap-4"
          >
            {column.map((tattoo, index) => (
              <TattooCard
                key={tattoo.id}
                tattoo={tattoo}
                publicUrl={publicUrls[tattoo.image_url]}
                index={index}
                onImageClick={onTattooClick}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Tablet: 3 columns */}
      <div className="hidden md:grid md:grid-cols-3 lg:hidden gap-6">
        {tabletColumns.map((column, columnIndex) => (
          <div
            key={`tablet-col-${columnIndex}`}
            className="flex flex-col gap-6"
          >
            {column.map((tattoo, index) => (
              <TattooCard
                key={tattoo.id}
                tattoo={tattoo}
                publicUrl={publicUrls[tattoo.image_url]}
                index={index}
                onImageClick={onTattooClick}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Desktop: 4 columns */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-8">
        {desktopColumns.map((column, columnIndex) => (
          <div
            key={`desktop-col-${columnIndex}`}
            className="flex flex-col gap-8"
          >
            {column.map((tattoo, index) => (
              <TattooCard
                key={tattoo.id}
                tattoo={tattoo}
                publicUrl={publicUrls[tattoo.image_url]}
                index={index}
                onImageClick={onTattooClick}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
