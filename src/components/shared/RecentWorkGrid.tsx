"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Palette } from "lucide-react";

type Tattoo = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string;
  created_at: string;
};

type PortfolioResponse = {
  tattoos: Tattoo[];
  signedUrls: Record<string, string>;
};

export default function RecentWorkGrid() {
  const [portfolioData, setPortfolioData] = useState<PortfolioResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecentWork() {
      try {
        const response = await fetch("/api/portfolio");
        if (!response.ok) {
          throw new Error("Failed to fetch portfolio");
        }
        const data = (await response.json()) as PortfolioResponse;
        setPortfolioData(data);
      } catch (err: unknown) {
        console.error("Error fetching recent work:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load recent work",
        );
      } finally {
        setLoading(false);
      }
    }

    void fetchRecentWork();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-800 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-800 rounded-xl flex items-center justify-center"
          >
            <div className="text-center">
              <Palette className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Loading...</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Get the latest 8 tattoos
  const recentTattoos = portfolioData?.tattoos.slice(0, 8) || [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {recentTattoos.map((tattoo) => {
        const imageUrl = portfolioData?.signedUrls[tattoo.image_url];

        return (
          <Link
            key={tattoo.id}
            href="/portfolio"
            className="aspect-square bg-gray-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-white/20 transition-all duration-200 group"
          >
            {imageUrl ? (
              <div className="relative w-full h-full">
                <Image
                  src={imageUrl}
                  alt={tattoo.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <div className="text-center">
                  <Palette className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Image</p>
                </div>
              </div>
            )}
          </Link>
        );
      })}

      {/* Fill remaining slots with placeholders if we have fewer than 8 tattoos */}
      {Array.from({ length: Math.max(0, 8 - recentTattoos.length) }, (_, i) => (
        <div
          key={`placeholder-${i}`}
          className="aspect-square bg-gray-800 rounded-xl flex items-center justify-center"
        >
          <div className="text-center">
            <Palette className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Coming Soon</p>
          </div>
        </div>
      ))}
    </div>
  );
}
