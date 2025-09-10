"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import BackButton from "@/components/ui/BackButton";
import {
  fetchAllTattoos,
  getTattooStats,
  deleteTattoo,
  getTattooImageUrls,
  updateTattoo,
  uploadTattooImage,
  setFeatureImage,
  unsetFeatureImage,
  type Tattoo,
} from "@/services/tattoos";
import ArtStats from "@/components/dashboard/ArtStats";
import DashboardArtGallery from "@/components/dashboard/DashboardArtGallery";
import DashboardTattooModal from "@/components/dashboard/DashboardTattooModal";
import ArtLoadingState from "@/components/dashboard/ArtLoadingState";
import ArtErrorState from "@/components/dashboard/ArtErrorState";

export default function ArtPage() {
  const router = useRouter();
  const [artworks, setArtworks] = useState<Tattoo[]>([]);
  const [stats, setStats] = useState({ total: 0, categories: 0, thisMonth: 0 });
  const [publicUrls, setPublicUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Tattoo | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const results = await Promise.all([fetchAllTattoos(), getTattooStats()]);
      const [allTattoosData, statsData] = results;

      console.log("All tattoos data:", allTattoosData);
      console.log("Stats data:", statsData);

      // Log all unique categories found
      const uniqueCategories = [
        ...new Set(allTattoosData.map((t) => t.category)),
      ];
      console.log("Unique categories found:", uniqueCategories);

      // Filter for art category only
      const artOnly = allTattoosData.filter(
        (artwork) => artwork.category === "art",
      );
      console.log("Art only (category=art):", artOnly);
      setArtworks(artOnly);

      // Calculate art-specific stats
      const artStats = {
        total: artOnly.length,
        categories: 1, // Only art category
        thisMonth: artOnly.filter((artwork) => {
          const createdDate = new Date(artwork.created_at);
          const now = new Date();
          return (
            createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear()
          );
        }).length,
      };
      setStats(artStats);

      // Generate signed URLs for all art images
      if (artOnly.length > 0) {
        const imagePaths = artOnly
          .map((artwork) => artwork.image_url)
          .filter(Boolean); // Remove any null/undefined URLs

        console.log("Image paths for art:", imagePaths);

        if (imagePaths.length > 0) {
          const urls = await getTattooImageUrls(imagePaths, "art");
          console.log("Generated signed URLs:", urls);
          setPublicUrls(urls);
        }
      }
    } catch (err) {
      console.error("Error loading artworks:", err);
      setError("Failed to load artworks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (artwork: Tattoo) => {
    try {
      setIsDeleting(artwork.id);
      await deleteTattoo(artwork.id);
      await loadData(); // Refresh data
      setSelectedArtwork(null);
    } catch (err) {
      console.error("Error deleting artwork:", err);
      alert("Failed to delete artwork. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = async (
    artwork: Tattoo,
    updates: {
      title: string;
      description: string;
      category: string;
      is_public: boolean;
      image?: File;
    },
  ) => {
    try {
      let imageUrl = artwork.image_url;

      // Upload new image if provided
      if (updates.image) {
        imageUrl = await uploadTattooImage(updates.image, "art");
      }

      // Update artwork with new data
      const updatedArtwork = await updateTattoo(artwork.id, {
        title: updates.title,
        description: updates.description,
        category: updates.category,
        is_public: updates.is_public,
        image_url: imageUrl,
      });

      // Update local state
      setArtworks((prev) =>
        prev.map((a) => (a.id === artwork.id ? updatedArtwork : a)),
      );
      setSelectedArtwork(updatedArtwork);

      // Update signed URLs if image was changed
      if (updates.image && imageUrl) {
        const newSignedUrls = await getTattooImageUrls([imageUrl], "art");
        setPublicUrls((prev) => ({ ...prev, ...newSignedUrls }));
      }

      // Refresh stats
      const statsData = await getTattooStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error updating artwork:", err);
      alert("Failed to update artwork. Please try again.");
      throw err; // Re-throw to handle in the edit form
    }
  };

  const handleAddNew = () => {
    router.push("/dashboard/art/new");
  };

  const handleFeaturedChange = () => {
    // Refresh the data to update featured status across all cards
    void loadData();
  };

  const handleToggleFeature = async (artwork: Tattoo) => {
    try {
      if (artwork.is_feature_image) {
        await unsetFeatureImage(artwork.id);
      } else {
        await setFeatureImage(artwork.id);
      }
      await loadData(); // Reload to get updated data
    } catch (error) {
      console.error("Error toggling feature image:", error);
      alert("Failed to update feature image. Please try again.");
    }
  };

  if (isLoading) {
    return <ArtLoadingState />;
  }

  if (error) {
    return (
      <ArtErrorState
        error={error}
        onRetry={() => {
          void loadData();
        }}
      />
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Back Button - Mobile Only */}
      <BackButton />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Art Portfolio
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your art and graffiti collection
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={handleAddNew} className="w-full sm:w-auto">
            Add New Artwork
          </Button>
        </div>
      </div>

      {/* Stats */}
      <ArtStats stats={stats} />

      {/* Gallery */}
      <DashboardArtGallery
        artworks={artworks}
        publicUrls={publicUrls}
        onArtworkClick={setSelectedArtwork}
        onAddNew={handleAddNew}
        onFeaturedChange={handleFeaturedChange}
        onToggleFeature={handleToggleFeature}
      />

      {/* Modal for viewing artwork details */}
      {selectedArtwork && (
        <DashboardTattooModal
          tattoo={selectedArtwork}
          publicUrl={publicUrls[selectedArtwork.image_url]}
          isDeleting={isDeleting === selectedArtwork.id}
          onClose={() => setSelectedArtwork(null)}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
