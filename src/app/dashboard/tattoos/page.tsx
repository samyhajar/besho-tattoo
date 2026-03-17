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
import { createClient } from "@/lib/supabase/browser-client";
import { testFeaturedTattooFunctions } from "@/services/featured-tattoos";
import TattooStats from "@/components/dashboard/TattooStats";
import DashboardTattooGallery from "@/components/dashboard/DashboardTattooGallery";
import DashboardTattooModal from "@/components/dashboard/DashboardTattooModal";
import TattooLoadingState from "@/components/dashboard/TattooLoadingState";
import TattooErrorState from "@/components/dashboard/TattooErrorState";

export default function TattoosPage() {
  const router = useRouter();
  const supabase = createClient();
  const [tattoos, setTattoos] = useState<Tattoo[]>([]);
  const [stats, setStats] = useState({ total: 0, categories: 0, thisMonth: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTattoo, setSelectedTattoo] = useState<Tattoo | null>(null);
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

      // Filter for tattoos category and legacy tattoos (null category)
      // For now, show all tattoos that are not specifically categorized as 'art' or 'designs'
      const tattoosOnly = allTattoosData.filter(
        (tattoo) =>
          tattoo.category === "tattoos" ||
          tattoo.category === null ||
          (tattoo.category !== "art" && tattoo.category !== "designs"),
      );
      console.log("Tattoos only (including legacy):", tattoosOnly);
      setTattoos(tattoosOnly);

      // Calculate tattoos-specific stats
      const tattoosStats = {
        total: tattoosOnly.length,
        categories: 1, // Only tattoos category
        thisMonth: tattoosOnly.filter((tattoo) => {
          const createdDate = new Date(tattoo.created_at);
          const now = new Date();
          return (
            createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear()
          );
        }).length,
      };
      setStats(tattoosStats);
    } catch (err) {
      console.error("Error loading tattoos:", err);
      setError("Failed to load tattoos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (tattoo: Tattoo) => {
    try {
      setIsDeleting(tattoo.id);
      await deleteTattoo(tattoo.id);
      await loadData(); // Refresh data
      setSelectedTattoo(null);
    } catch (err) {
      console.error("Error deleting tattoo:", err);
      alert("Failed to delete tattoo. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = async (
    tattoo: Tattoo,
    updates: {
      title: string;
      description: string;
      category: string;
      is_public: boolean;
      media: import("@/types/tattoo").PortfolioMediaChangeSet;
    },
  ) => {
    try {
      const updatedTattoo = await updateTattoo(tattoo.id, {
        title: updates.title,
        description: updates.description,
        category: updates.category,
        is_public: updates.is_public,
        media: updates.media,
      });

      // Update local state
      setTattoos((prev) =>
        prev.map((t) => (t.id === tattoo.id ? updatedTattoo : t)),
      );
      setSelectedTattoo(updatedTattoo);

      // Refresh stats
      const statsData = await getTattooStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error updating tattoo:", err);
      alert("Failed to update tattoo. Please try again.");
      throw err; // Re-throw to handle in the edit form
    }
  };

  const handleAddNew = () => {
    router.push("/dashboard/tattoos/new");
  };

  const handleFeaturedChange = () => {
    // Refresh the data to update featured status across all cards
    void loadData();
  };

  const handleToggleFeature = async (tattoo: Tattoo) => {
    try {
      if (tattoo.is_feature_image) {
        await unsetFeatureImage(tattoo.id);
      } else {
        await setFeatureImage(tattoo.id);
      }
      await loadData(); // Reload to get updated data
    } catch (error) {
      console.error("Error toggling feature image:", error);
      alert("Failed to update feature image. Please try again.");
    }
  };

  const handleCategorizeLegacyTattoos = async () => {
    try {
      // Update all tattoos with null category to 'tattoos' category
      const { error } = await supabase
        .from("tattoos")
        .update({ category: "tattoos" })
        .is("category", null);

      if (error) throw error;

      console.log("Updated legacy tattoos to tattoos category");
      await loadData(); // Reload to get updated data
      alert("Legacy tattoos have been categorized as tattoos!");
    } catch (error) {
      console.error("Error categorizing legacy tattoos:", error);
      alert("Failed to categorize legacy tattoos. Please try again.");
    }
  };

  const handleTestFeaturedFunctions = async () => {
    try {
      console.log("Testing featured tattoo functions...");
      const result = await testFeaturedTattooFunctions();
      console.log("Test result:", result);
      alert(
        `Test result: ${result.success ? "SUCCESS" : "FAILED"}\n${result.message}`,
      );
    } catch (error) {
      console.error("Test failed:", error);
      alert(
        `Test failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  if (isLoading) {
    return <TattooLoadingState />;
  }

  if (error) {
    return (
      <TattooErrorState
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
            Tattoo Portfolio
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your tattoo artwork and portfolio
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            onClick={handleCategorizeLegacyTattoos}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Categorize Legacy Tattoos
          </Button>
          <Button
            onClick={handleTestFeaturedFunctions}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Test Featured Functions
          </Button>
          <Button onClick={handleAddNew} className="w-full sm:w-auto">
            Add New Tattoo
          </Button>
        </div>
      </div>

      {/* Stats */}
      <TattooStats stats={stats} />

      {/* Gallery */}
      <DashboardTattooGallery
        tattoos={tattoos}
        onTattooClick={setSelectedTattoo}
        onAddNew={handleAddNew}
        onFeaturedChange={handleFeaturedChange}
        onToggleFeature={handleToggleFeature}
      />

      {/* Modal for viewing tattoo details */}
      {selectedTattoo && (
        <DashboardTattooModal
          tattoo={selectedTattoo}
          isDeleting={isDeleting === selectedTattoo.id}
          onClose={() => setSelectedTattoo(null)}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
