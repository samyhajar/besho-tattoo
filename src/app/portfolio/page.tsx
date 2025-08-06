"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

const categories = [
  {
    id: "tattoos",
    title: "Tattoos",
    href: "/portfolio/tattoos",
    description: "Explore our collection of custom tattoo work",
    categoryKey: "tattoo", // This should match the category in your database
  },
  {
    id: "designs",
    title: "Designs & Concepts",
    href: "/portfolio/designs",
    description: "Original artwork and design concepts",
    categoryKey: "design", // This should match the category in your database
  },
  {
    id: "art",
    title: "Art & Graffiti",
    href: "/portfolio/art",
    description: "Street art and creative expressions",
    categoryKey: "art", // This should match the category in your database
  },
];

export default function PortfolioLandingPage() {
  const router = useRouter();
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    // Fetch the latest image for each category
    const fetchLatestImages = async () => {
      try {
        const response = await fetch("/api/portfolio");
        if (response.ok) {
          const data = (await response.json()) as {
            tattoos: Array<{
              image_url: string;
              created_at: string;
              category: string | null;
            }>;
            signedUrls: Record<string, string>;
          };

          const latestByCategory: Record<string, string> = {};

          // Group tattoos by category and find the latest for each
          if (data.tattoos.length > 0) {
            // Since tattoos are already ordered by created_at desc, we just need the first one of each category
            const seenCategories = new Set<string>();

            data.tattoos.forEach((tattoo) => {
              const category =
                tattoo.category?.toLowerCase() || "uncategorized";
              if (!seenCategories.has(category)) {
                const signedUrl = data.signedUrls[tattoo.image_url];
                if (signedUrl) {
                  latestByCategory[category] = signedUrl;
                  seenCategories.add(category);
                }
              }
            });

            // Also try to match any general images to categories if specific ones aren't found
            if (data.tattoos.length > 0) {
              const fallbackImage = data.signedUrls[data.tattoos[0].image_url];
              if (fallbackImage) {
                // Use the latest image as fallback for any missing categories
                ["tattoo", "design", "art"].forEach((cat) => {
                  if (!latestByCategory[cat]) {
                    latestByCategory[cat] = fallbackImage;
                  }
                });
              }
            }
          }

          setCategoryImages(latestByCategory);
        }
      } catch (error) {
        console.error("Failed to fetch latest images:", error);
      }
    };

    void fetchLatestImages();
  }, []);

  const handleCategoryClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto py-16 sm:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {categories.map((category) => (
              <button
                key={category.id}
                className="group cursor-pointer w-full text-left"
                onClick={() => handleCategoryClick(category.href)}
                type="button"
              >
                <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-[4/5] transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">
                  {/* Background Image with Blur */}
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-[1px] scale-110"
                    style={{
                      backgroundImage: categoryImages[category.categoryKey]
                        ? `url('${categoryImages[category.categoryKey]}')`
                        : "url('/Liberte_black_last.svg')",
                    }}
                  />

                  {/* Overlay for better text readability */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="text-center">
                      <h2 className="text-2xl lg:text-3xl font-light text-white mb-3 tracking-wide drop-shadow-lg">
                        {category.title}
                      </h2>
                      <div className="w-16 h-px bg-white mx-auto opacity-80" />
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                    <p className="text-white text-sm font-light leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
