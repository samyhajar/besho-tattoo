import type { Tattoo } from "@/types/tattoo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import DashboardTattooCard from "./DashboardTattooCard";

interface DashboardArtGalleryProps {
  artworks: Tattoo[];
  publicUrls: Record<string, string>;
  onArtworkClick: (artwork: Tattoo) => void;
  onAddNew: () => void;
  onFeaturedChange?: () => void;
  onToggleFeature?: (artwork: Tattoo) => void;
}

export default function DashboardArtGallery({
  artworks,
  publicUrls,
  onArtworkClick,
  onAddNew,
  onFeaturedChange,
  onToggleFeature,
}: DashboardArtGalleryProps) {
  if (artworks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Gallery</CardTitle>
          <CardDescription>Your art and graffiti collection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No artworks yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by adding your first artwork to the portfolio.
            </p>
            <Button onClick={onAddNew}>Add Your First Artwork</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Gallery</CardTitle>
        <CardDescription>
          Your art and graffiti collection ({artworks.length} pieces)
          <br />
          <span className="text-sm text-gray-500">
            Click the ⭐ star to feature an artwork on the portfolio page
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {artworks.map((artwork) => (
            <DashboardTattooCard
              key={artwork.id}
              tattoo={artwork}
              publicUrl={publicUrls[artwork.image_url]}
              onTattooClick={onArtworkClick}
              onFeaturedChange={onFeaturedChange}
              onToggleFeature={onToggleFeature}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
