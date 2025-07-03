"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { fetchTattoos, getTattooStats, deleteTattoo, getTattooImageUrls, type Tattoo } from "@/services/tattoos";
import TattooStats from "@/components/dashboard/TattooStats";
import DashboardTattooGallery from "@/components/dashboard/DashboardTattooGallery";
import DashboardTattooModal from "@/components/dashboard/DashboardTattooModal";

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
      const [tattoosData, statsData] = await Promise.all([
        fetchTattoos(),
        getTattooStats()
      ]);
      setTattoos(tattoosData);
      setStats(statsData);

      // Generate signed URLs for all tattoo images
      if (tattoosData.length > 0) {
        const imagePaths = tattoosData
          .map(tattoo => tattoo.image_url)
          .filter(Boolean); // Remove any null/undefined URLs

        if (imagePaths.length > 0) {
          const urls = await getTattooImageUrls(imagePaths);
          setSignedUrls(urls);
        }
      }
    } catch (err) {
      console.error('Error loading tattoos:', err);
      setError('Failed to load tattoos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (tattoo: Tattoo) => {
    if (!confirm(`Are you sure you want to delete "${tattoo.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeleting(tattoo.id);
      await deleteTattoo(tattoo.id);
      await loadData(); // Refresh data
      setSelectedTattoo(null);
    } catch (err) {
      console.error('Error deleting tattoo:', err);
      alert('Failed to delete tattoo. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAddNew = () => {
    router.push('/dashboard/tattoos/new');
  };

  if (isLoading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tattoo Portfolio</h1>
            <p className="text-gray-600 mt-2">Manage your tattoo artwork and portfolio</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            <span className="text-gray-600">Loading tattoos...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tattoo Portfolio</h1>
            <p className="text-gray-600 mt-2">Manage your tattoo artwork and portfolio</p>
          </div>
        </div>
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <Button onClick={() => { void loadData(); }} className="mt-4">Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tattoo Portfolio</h1>
          <p className="text-gray-600 mt-2">Manage your tattoo artwork and portfolio</p>
        </div>
        <Button onClick={handleAddNew} className="w-full sm:w-auto">Add New Tattoo</Button>
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
        />
      )}
    </div>
  );
}