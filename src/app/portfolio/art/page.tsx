"use client";

import { useState, useEffect } from "react";
import type { Tattoo } from "@/types/tattoo";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import CategoryFilter from "@/components/ui/CategoryFilter";
import PortfolioGrid from "@/components/ui/PortfolioGrid";
import TattooModal from "@/components/ui/TattooModal";
import { useRouter } from "next/navigation";

export default function ArtPage() {
  const [tattoos, setTattoos] = useState<Tattoo[]>([]);
  const [publicUrls, setPublicUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTattoo, setSelectedTattoo] = useState<Tattoo | null>(null);
  const router = useRouter();

  useEffect(() => {
    void loadTattoos();
  }, []);

  const loadTattoos = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/portfolio", {
        // Minimal caching to allow quick updates when tattoos change visibility
        headers: {
          "Cache-Control": "max-age=30", // Cache for 30 seconds only
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Portfolio API error:", {
          status: response.status,
          statusText: response.statusText,
          errorText,
        });
        throw new Error(`Failed to load portfolio (${response.status})`);
      }

      const data = (await response.json()) as {
        tattoos: Tattoo[];
        publicUrls: Record<string, string>;
      };

      // Filter for art category only
      const artTattoos = (data.tattoos || []).filter(
        (tattoo) => tattoo.category === "art",
      );
      setTattoos(artTattoos);
      setPublicUrls(data.publicUrls || {});
    } catch (err) {
      console.error("Error loading art:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load art portfolio",
      );
      // Set empty data on error to prevent crashes
      setTattoos([]);
      setPublicUrls({});
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    "all",
    ...new Set(tattoos.map((t) => t.category).filter(Boolean) as string[]),
  ];

  const filteredTattoos =
    selectedCategory === "all"
      ? tattoos
      : tattoos.filter((t) => t.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading art portfolio...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to Load Art Portfolio
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-x-4">
              <button
                onClick={() => void loadTattoos()}
                className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/portfolio")}
                className="px-6 py-3 bg-gray-100 text-gray-900 rounded-full font-medium hover:bg-gray-200 transition-colors"
              >
                Back to Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <Header />

      {/* Page Header */}
      <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push("/portfolio")}
            className="mb-6 flex items-center text-gray-600 hover:text-black transition-colors group"
          >
            <svg
              className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Portfolio
          </button>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-light text-black mb-6 sm:mb-8 tracking-wide">
              Art & Graffiti
            </h1>

            {/* Filter Section */}
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <PortfolioGrid
            tattoos={filteredTattoos}
            publicUrls={publicUrls}
            onTattooClick={setSelectedTattoo}
          />
        </div>
      </div>

      {/* Zoom Modal */}
      {selectedTattoo && (
        <TattooModal
          tattoo={selectedTattoo}
          publicUrl={publicUrls[selectedTattoo.image_url]}
          onClose={() => setSelectedTattoo(null)}
        />
      )}

      <Footer />
    </div>
  );
}
