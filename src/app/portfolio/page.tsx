"use client";

import { useState, useEffect } from "react";
import type { Tattoo } from "@/types/tattoo";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import CategoryFilter from "@/components/ui/CategoryFilter";
import PortfolioGrid from "@/components/ui/PortfolioGrid";
import TattooModal from "@/components/ui/TattooModal";

export default function PortfolioPage() {
  const [tattoos, setTattoos] = useState<Tattoo[]>([]);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTattoo, setSelectedTattoo] = useState<Tattoo | null>(null);

  useEffect(() => {
    void loadTattoos();
  }, []);

  const loadTattoos = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/portfolio", {
        // Remove no-store to allow caching for better performance
        headers: {
          'Cache-Control': 'max-age=300', // Cache for 5 minutes
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
        signedUrls: Record<string, string>;
      };

      setTattoos(data.tattoos || []);
      setSignedUrls(data.signedUrls || {});
    } catch (err) {
      console.error("Error loading tattoos:", err);
      setError(err instanceof Error ? err.message : 'Failed to load portfolio');
      // Set empty data on error to prevent crashes
      setTattoos([]);
      setSignedUrls({});
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
      <div className="min-h-screen bg-[#0e1424]">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/80">Loading portfolio...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0e1424]">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Unable to Load Portfolio</h2>
            <p className="text-white/60 mb-6">{error}</p>
            <button
              onClick={() => void loadTattoos()}
              className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e1424]">
      {/* Navigation Header */}
      <Header />

      {/* Page Header */}
      <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 sm:mb-8">
            Portfolio
          </h1>

          {/* Filter Section */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <PortfolioGrid
            tattoos={filteredTattoos}
            signedUrls={signedUrls}
            onTattooClick={setSelectedTattoo}
          />
        </div>
      </div>

      {/* Zoom Modal */}
      {selectedTattoo && (
        <TattooModal
          tattoo={selectedTattoo}
          signedUrl={signedUrls[selectedTattoo.image_url]}
          onClose={() => setSelectedTattoo(null)}
        />
      )}

      <Footer />
    </div>
  );
}
