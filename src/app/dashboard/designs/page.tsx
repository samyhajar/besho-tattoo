"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import BackButton from "@/components/ui/BackButton";
import {
  fetchAllTattoos,
  getTattooStats,
  deleteTattoo,
  updateTattoo,
  setFeatureImage,
  unsetFeatureImage,
  type Tattoo,
} from "@/services/tattoos";
import DesignsStats from "@/components/dashboard/DesignsStats";
import DashboardDesignsGallery from "@/components/dashboard/DashboardDesignsGallery";
import DashboardTattooModal from "@/components/dashboard/DashboardTattooModal";
import DesignsLoadingState from "@/components/dashboard/DesignsLoadingState";
import DesignsErrorState from "@/components/dashboard/DesignsErrorState";

export default function DesignsPage() {
  const router = useRouter();
  const [designs, setDesigns] = useState<Tattoo[]>([]);
  const [stats, setStats] = useState({ total: 0, categories: 0, thisMonth: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<Tattoo | null>(null);
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

      // Filter for designs category only
      const designsOnly = allTattoosData.filter(
        (design) => design.category === "designs",
      );
      console.log("Designs only (category=designs):", designsOnly);
      setDesigns(designsOnly);

      // Calculate designs-specific stats
      const designStats = {
        total: designsOnly.length,
        categories: 1, // Only designs category
        thisMonth: designsOnly.filter((design) => {
          const createdDate = new Date(design.created_at);
          const now = new Date();
          return (
            createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear()
          );
        }).length,
      };
      setStats(designStats);
    } catch (err) {
      console.error("Error loading designs:", err);
      setError("Failed to load designs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (design: Tattoo) => {
    try {
      setIsDeleting(design.id);
      await deleteTattoo(design.id);
      await loadData(); // Refresh data
      setSelectedDesign(null);
    } catch (err) {
      console.error("Error deleting design:", err);
      alert("Failed to delete design. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = async (
    design: Tattoo,
    updates: {
      title: string;
      description: string;
      category: string;
      is_public: boolean;
      media: import("@/types/tattoo").PortfolioMediaChangeSet;
    },
  ) => {
    try {
      const updatedDesign = await updateTattoo(design.id, {
        title: updates.title,
        description: updates.description,
        category: updates.category,
        is_public: updates.is_public,
        media: updates.media,
      });

      // Update local state
      setDesigns((prev) =>
        prev.map((d) => (d.id === design.id ? updatedDesign : d)),
      );
      setSelectedDesign(updatedDesign);

      // Refresh stats
      const statsData = await getTattooStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error updating design:", err);
      alert("Failed to update design. Please try again.");
      throw err; // Re-throw to handle in the edit form
    }
  };

  const handleAddNew = () => {
    router.push("/dashboard/designs/new");
  };

  const handleFeaturedChange = () => {
    // Refresh the data to update featured status across all cards
    void loadData();
  };

  const handleToggleFeature = async (design: Tattoo) => {
    try {
      if (design.is_feature_image) {
        await unsetFeatureImage(design.id);
      } else {
        await setFeatureImage(design.id);
      }
      await loadData(); // Reload to get updated data
    } catch (error) {
      console.error("Error toggling feature image:", error);
      alert("Failed to update feature image. Please try again.");
    }
  };

  if (isLoading) {
    return <DesignsLoadingState />;
  }

  if (error) {
    return (
      <DesignsErrorState
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
            Designs Portfolio
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your design concepts and artwork
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={handleAddNew} className="w-full sm:w-auto">
            Add New Design
          </Button>
        </div>
      </div>

      {/* Stats */}
      <DesignsStats stats={stats} />

      {/* Gallery */}
      <DashboardDesignsGallery
        designs={designs}
        onDesignClick={setSelectedDesign}
        onAddNew={handleAddNew}
        onFeaturedChange={handleFeaturedChange}
        onToggleFeature={handleToggleFeature}
      />

      {/* Modal for viewing design details */}
      {selectedDesign && (
        <DashboardTattooModal
          tattoo={selectedDesign}
          isDeleting={isDeleting === selectedDesign.id}
          onClose={() => setSelectedDesign(null)}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
