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
  type Tattoo,
} from "@/services/tattoos";
import TattooStats from "@/components/dashboard/TattooStats";
import DashboardTattooGallery from "@/components/dashboard/DashboardTattooGallery";
import DashboardTattooModal from "@/components/dashboard/DashboardTattooModal";
import TattooLoadingState from "@/components/dashboard/TattooLoadingState";
import TattooErrorState from "@/components/dashboard/TattooErrorState";

export default function TattoosPage() {
  const router = useRouter();
  const [tattoos, setTattoos] = useState<Tattoo[]>([]);
  const [stats, setStats] = useState({ total: 0, categories: 0, thisMonth: 0 });
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
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
      const [tattoosData, statsData] = results;
      setTattoos(tattoosData);
      setStats(statsData);

      // Generate signed URLs for all tattoo images
      if (tattoosData.length > 0) {
        const imagePaths = tattoosData
          .map((tattoo) => tattoo.image_url)
          .filter(Boolean); // Remove any null/undefined URLs

        if (imagePaths.length > 0) {
          const urls = await getTattooImageUrls(imagePaths);
          setSignedUrls(urls);
        }
      }
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
      image?: File;
    },
  ) => {
    try {
      let imageUrl = tattoo.image_url;

      // Upload new image if provided
      if (updates.image) {
        imageUrl = await uploadTattooImage(updates.image);
      }

      // Update tattoo with new data
      const updatedTattoo = await updateTattoo(tattoo.id, {
        title: updates.title,
        description: updates.description,
        category: updates.category,
        is_public: updates.is_public,
        image_url: imageUrl,
      });

      // Update local state
      setTattoos((prev) =>
        prev.map((t) => (t.id === tattoo.id ? updatedTattoo : t)),
      );
      setSelectedTattoo(updatedTattoo);

      // Update signed URLs if image was changed
      if (updates.image && imageUrl) {
        const newSignedUrls = await getTattooImageUrls([imageUrl]);
        setSignedUrls((prev) => ({ ...prev, ...newSignedUrls }));
      }

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
        <Button onClick={handleAddNew} className="w-full sm:w-auto">
          Add New Tattoo
        </Button>
      </div>

      {/* Stats */}
      <TattooStats stats={stats} />

      {/* Gallery */}
      <DashboardTattooGallery
        tattoos={tattoos}
        signedUrls={signedUrls}
        onTattooClick={setSelectedTattoo}
        onAddNew={handleAddNew}
      />

      {/* Modal for viewing tattoo details */}
      {selectedTattoo && (
        <DashboardTattooModal
          tattoo={selectedTattoo}
          signedUrl={signedUrls[selectedTattoo.image_url]}
          isDeleting={isDeleting === selectedTattoo.id}
          onClose={() => setSelectedTattoo(null)}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
