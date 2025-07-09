"use client";

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
                  {/* Background Image Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="text-center">
                      <h2 className="text-2xl lg:text-3xl font-light text-black mb-3 tracking-wide">
                        {category.title}
                      </h2>
                      <div className="w-16 h-px bg-black mx-auto opacity-60" />
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
