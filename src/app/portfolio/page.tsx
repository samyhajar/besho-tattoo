"use client";

import { useState, useEffect } from "react";
import type { Tattoo } from '@/types/tattoo';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import CategoryFilter from '@/components/ui/CategoryFilter';
import PortfolioGrid from '@/components/ui/PortfolioGrid';
import TattooModal from '@/components/ui/TattooModal';


export default function PortfolioPage() {
  const [tattoos, setTattoos] = useState<Tattoo[]>([]);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTattoo, setSelectedTattoo] = useState<Tattoo | null>(null);

  useEffect(() => {
    void loadTattoos();
  }, []);

    const loadTattoos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/portfolio', {
        cache: 'no-store' // Ensure fresh data
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Portfolio API error:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as { tattoos: Tattoo[]; signedUrls: Record<string, string> };
      setTattoos(data.tattoos || []);
      setSignedUrls(data.signedUrls || {});
    } catch (err) {
      console.error('Error loading tattoos:', err);
      // Set empty data on error to prevent crashes
      setTattoos([]);
      setSignedUrls({});
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['all', ...new Set(tattoos.map(t => t.category).filter(Boolean) as string[])];

  const filteredTattoos = selectedCategory === 'all'
    ? tattoos
    : tattoos.filter(t => t.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
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

  return (
    <div className="min-h-screen bg-black">
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