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
  },
  {
    id: "designs",
    title: "Designs & Concepts",
    href: "/portfolio/designs",
    description: "Original artwork and design concepts",
  },
  {
    id: "art",
    title: "Art & Graffiti",
    href: "/portfolio/art",
    description: "Street art and creative expressions",
  },
];

export default function PortfolioLandingPage() {
  const router = useRouter();
  const [featureImages, setFeatureImages] = useState<Record<string, string>>(
    {},
  );
  const [_isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the featured tattoo image
    const fetchFeaturedImage = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/portfolio");

        if (response.ok) {
          const data = (await response.json()) as {
            tattoos: Array<{
              image_url: string;
              created_at: string;
              category: string | null;
            }>;
            publicUrls: Record<string, string>;
            featureImages: Record<
              string,
              {
                image_url: string;
                title: string;
              }
            >;
          };

          // Process feature images for each category
          const categoryFeatureImages: Record<string, string> = {};
          Object.entries(data.featureImages || {}).forEach(
            ([category, featureImage]) => {
              if (featureImage?.image_url) {
                const publicUrl = data.publicUrls[featureImage.image_url];
                if (publicUrl) {
                  categoryFeatureImages[category] = publicUrl;
                }
              }
            },
          );

          setFeatureImages(categoryFeatureImages);
        }
      } catch (error) {
        console.error("Failed to fetch featured images:", error);
        setFeatureImages({});
      } finally {
        setIsLoading(false);
      }
    };

    void fetchFeaturedImage();
  }, []);

  const handleCategoryClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <div className="relative flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/IMG_5112.JPG')",
            }}
          />
          {/* Dark overlay for better readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-6xl mx-auto py-16 sm:py-24">
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
                      backgroundImage: featureImages[category.id]
                        ? `url('${featureImages[category.id]}')`
                        : "url('/lastlastlogo.png')",
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
