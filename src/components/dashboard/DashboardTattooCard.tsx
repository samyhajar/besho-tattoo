import Image from "next/image";
import { useState, useEffect } from "react";
import type { Tattoo } from "@/types/tattoo";
import StarIcon from "@/components/ui/StarIcon";
import {
  isTattooFeatured,
  setFeaturedTattoo,
  removeFeaturedTattoo,
} from "@/services/featured-tattoos";

interface DashboardTattooCardProps {
  tattoo: Tattoo;
  publicUrl: string;
  onTattooClick: (tattoo: Tattoo) => void;
  onFeaturedChange?: () => void;
  onToggleFeature?: (tattoo: Tattoo) => void;
}

export default function DashboardTattooCard({
  tattoo,
  publicUrl,
  onTattooClick,
  onFeaturedChange,
  onToggleFeature,
}: DashboardTattooCardProps) {
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if this tattoo is featured on mount
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

  const handleStarClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (isLoading) return;

    try {
      setIsLoading(true);

      // Use the new feature image system if available, otherwise fall back to old system
      if (onToggleFeature) {
        await onToggleFeature(tattoo);
      } else {
        // Fallback to old featured tattoo system
        if (isFeatured) {
          console.log("Removing featured status for tattoo:", tattoo.id);
          await removeFeaturedTattoo();
          setIsFeatured(false);
          console.log("Successfully removed featured status");
        } else {
          console.log("Setting tattoo as featured:", tattoo.id);
          await setFeaturedTattoo(tattoo.id);
          setIsFeatured(true);
          console.log("Successfully set tattoo as featured");
        }
      }

      // Notify parent component to refresh data
      onFeaturedChange?.();
    } catch (error) {
      console.error("Error updating featured status:", {
        error,
        tattooId: tattoo.id,
        action: isFeatured ? "remove" : "set",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      });

      // Provide more specific error messages
      let errorMessage = "Failed to update featured status. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes("permission")) {
          errorMessage =
            "You do not have permission to update featured status.";
        } else if (error.message.includes("network")) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else if (error.message.includes("function")) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="group cursor-pointer"
      onClick={() => onTattooClick(tattoo)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
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
          src={publicUrl || "/placeholder-image.svg"}
          alt={tattoo.title}
          width={300}
          height={300}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Featured Star */}
        <div className="absolute top-2 left-2">
          <StarIcon
            filled={isFeatured}
            className={`${
              isFeatured
                ? "text-yellow-400 drop-shadow-lg"
                : "text-white drop-shadow-lg hover:text-yellow-300"
            } ${isLoading ? "opacity-50" : ""}`}
            onClick={(e) => {
              void handleStarClick(e);
            }}
            size="md"
          />
        </div>

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

        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute bottom-2 left-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
              ⭐ Featured
            </span>
          </div>
        )}
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
