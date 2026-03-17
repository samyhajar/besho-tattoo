import Image from "next/image";
import { useEffect, useState } from "react";
import type { Tattoo } from "@/types/tattoo";
import StarIcon from "@/components/ui/StarIcon";
import {
  isTattooFeatured,
  removeFeaturedTattoo,
  setFeaturedTattoo,
} from "@/services/featured-tattoos";

interface DashboardTattooCardProps {
  tattoo: Tattoo;
  onTattooClick: (tattoo: Tattoo) => void;
  onFeaturedChange?: () => void;
  onToggleFeature?: (tattoo: Tattoo) => void;
}

export default function DashboardTattooCard({
  tattoo,
  onTattooClick,
  onFeaturedChange,
  onToggleFeature,
}: DashboardTattooCardProps) {
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const primaryUrl = tattoo.primaryMedia?.display_url || null;
  const mediaCount = tattoo.media?.length || 0;

  useEffect(() => {
    const checkFeatured = async () => {
      try {
        const featured = await isTattooFeatured(tattoo.id);
        setIsFeatured(featured);
      } catch (error) {
        console.error("Error checking featured status:", error);
      }
    };

    void checkFeatured();
  }, [tattoo.id]);

  const handleStarClick = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);

      if (onToggleFeature) {
        await onToggleFeature(tattoo);
      } else if (isFeatured) {
        await removeFeaturedTattoo();
        setIsFeatured(false);
      } else {
        await setFeaturedTattoo(tattoo.id);
        setIsFeatured(true);
      }

      onFeaturedChange?.();
    } catch (error) {
      console.error("Error updating featured status:", error);
      alert("Failed to update featured status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="group cursor-pointer"
      onClick={() => onTattooClick(tattoo)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onTattooClick(tattoo);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${tattoo.title}`}
    >
      <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-gray-100 transition-shadow group-hover:shadow-lg">
        {primaryUrl ? (
          <Image
            src={primaryUrl}
            alt={tattoo.title}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No primary image
          </div>
        )}

        <div className="absolute left-2 top-2">
          <StarIcon
            filled={isFeatured}
            className={`${
              isFeatured
                ? "text-yellow-400 drop-shadow-lg"
                : "text-white drop-shadow-lg hover:text-yellow-300"
            } ${isLoading ? "opacity-50" : ""}`}
            onClick={(event) => {
              void handleStarClick(event);
            }}
            size="md"
          />
        </div>

        <div className="absolute right-2 top-2">
          {tattoo.is_public ? (
            <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
              ✅ Public
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
              🔒 Private
            </span>
          )}
        </div>

        <div className="absolute bottom-2 left-2 flex flex-wrap gap-2">
          {isFeatured ? (
            <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
              ⭐ Featured
            </span>
          ) : null}
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-white/90 px-2 py-1 text-xs font-medium text-gray-800">
            {mediaCount} media
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-medium text-gray-900 transition-colors group-hover:text-gray-700">
          {tattoo.title}
        </h3>
        {tattoo.category ? (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">
            {tattoo.category}
          </span>
        ) : null}
        <p className="text-xs text-gray-500">
          {new Date(tattoo.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
