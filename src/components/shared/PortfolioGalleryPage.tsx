"use client";

import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import TattooModal from "@/components/ui/TattooModal";
import type { Tattoo } from "@/types/tattoo";

type PortfolioSection = "tattoos" | "designs" | "art";

const SECTION_CONTENT: Record<
  PortfolioSection,
  { title: string; helper: string }
> = {
  tattoos: {
    title: "Tattoos",
    helper: "Explore tattoo work by style and category.",
  },
  designs: {
    title: "Designs",
    helper: "Original concepts and design studies.",
  },
  art: {
    title: "Art",
    helper: "Independent art and visual work.",
  },
};

interface PortfolioGalleryPageProps {
  initialSection?: PortfolioSection;
}

interface PortfolioApiResponse {
  tattoos: Tattoo[];
}

function getPortfolioSection(category: string | null): PortfolioSection {
  const normalizedCategory = category?.trim().toLowerCase();

  if (normalizedCategory === "designs") {
    return "designs";
  }

  if (normalizedCategory === "art") {
    return "art";
  }

  return "tattoos";
}

function getCardLabel(category: string | null): string {
  const normalizedCategory = category?.trim();

  if (!normalizedCategory) {
    return "Tattoo";
  }

  if (normalizedCategory.toLowerCase() === "designs") {
    return "Designs";
  }

  if (normalizedCategory.toLowerCase() === "art") {
    return "Art";
  }

  return normalizedCategory;
}

function getTattooStyleFilter(category: string | null): string {
  const normalizedCategory = category?.trim();

  if (!normalizedCategory || normalizedCategory.toLowerCase() === "tattoos") {
    return "Tattoo";
  }

  return normalizedCategory;
}

interface PortfolioGalleryCardProps {
  tattoo: Tattoo;
  index: number;
  onSelect: Dispatch<SetStateAction<Tattoo | null>>;
}

function PortfolioGalleryCard({
  tattoo,
  index,
  onSelect,
}: PortfolioGalleryCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageSrc =
    !imageError && tattoo.primaryMedia?.display_url
      ? tattoo.primaryMedia.display_url
      : "/placeholder-image.svg";
  const canOpen = Boolean(tattoo.media?.length);

  const handleClick = () => {
    if (canOpen) {
      onSelect(tattoo);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="group relative aspect-[3/4] cursor-pointer overflow-hidden border border-neutral-800 bg-neutral-900 text-left animate-fade-in"
      style={{
        animationDelay: `${index * 80}ms`,
        animationFillMode: "both",
      }}
      aria-label={`View ${tattoo.title || "Untitled"} in full size`}
      disabled={!canOpen}
    >
      <Image
        src={imageSrc}
        alt={tattoo.title || "Portfolio artwork"}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
        onError={() => setImageError(true)}
      />

      <div className="pointer-events-none absolute bottom-4 right-4 h-12 w-12 opacity-40 transition-opacity duration-500 group-hover:opacity-60 md:h-16 md:w-16">
        <Image
          src="/logo-besho.png"
          alt=""
          width={64}
          height={64}
          className="h-full w-full object-contain brightness-0 invert"
          aria-hidden="true"
        />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 p-6">
        <p className="mb-1 font-home-sans text-[0.68rem] uppercase tracking-[0.24em] text-neutral-400">
          {getCardLabel(tattoo.category)}
        </p>
        <h3 className="font-home-serif text-xl italic text-white">
          {tattoo.title || "Untitled"}
        </h3>
        {tattoo.description ? (
          <p className="mt-2 line-clamp-2 text-xs text-neutral-300">
            {tattoo.description}
          </p>
        ) : null}
      </div>
    </button>
  );
}

export default function PortfolioGalleryPage({
  initialSection = "tattoos",
}: PortfolioGalleryPageProps) {
  const router = useRouter();
  const [activeTattooFilter, setActiveTattooFilter] = useState("All");
  const [tattoos, setTattoos] = useState<Tattoo[]>([]);
  const [selectedTattoo, setSelectedTattoo] = useState<Tattoo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setActiveTattooFilter("All");
  }, [initialSection]);

  useEffect(() => {
    let isMounted = true;

    const loadPortfolio = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/portfolio", {
          headers: {
            "Cache-Control": "max-age=30",
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

        const data = (await response.json()) as PortfolioApiResponse;

        if (!isMounted) {
          return;
        }

        setTattoos(data.tattoos || []);
      } catch (portfolioError) {
        console.error("Error loading portfolio:", portfolioError);

        if (!isMounted) {
          return;
        }

        setError(
          portfolioError instanceof Error
            ? portfolioError.message
            : "Failed to load portfolio",
        );
        setTattoos([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadPortfolio();

    return () => {
      isMounted = false;
    };
  }, []);

  const sectionItems = tattoos.filter(
    (tattoo) => getPortfolioSection(tattoo.category) === initialSection,
  );

  const tattooStyleFilters = [
    "All",
    ...Array.from(
      new Set(
        sectionItems.map((tattoo) => getTattooStyleFilter(tattoo.category)),
      ),
    ).sort((left, right) => left.localeCompare(right)),
  ];

  const visibleItems =
    initialSection === "tattoos" && activeTattooFilter !== "All"
      ? sectionItems.filter(
          (tattoo) =>
            getTattooStyleFilter(tattoo.category) === activeTattooFilter,
        )
      : sectionItems;

  const sectionTitle = SECTION_CONTENT[initialSection].title;
  const sectionHelper = SECTION_CONTENT[initialSection].helper;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-home-sans">
      <Header variant="home" />

      <main className="px-6 py-20">
        <div className="container mx-auto max-w-6xl space-y-16">
          <div className="space-y-8 text-center">
            <p className="font-home-sans text-[0.7rem] uppercase tracking-[0.34em] text-neutral-500">
              Portfolio
            </p>
            <h1 className="font-home-serif text-4xl text-white md:text-6xl">
              {sectionTitle}
            </h1>
            <p className="mx-auto max-w-2xl text-sm tracking-[0.08em] text-neutral-500">
              {sectionHelper}
            </p>

            {initialSection === "tattoos" ? (
              <div className="flex flex-wrap justify-center gap-4">
                {tattooStyleFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveTattooFilter(filter)}
                    className={`border px-6 py-2 text-xs uppercase tracking-widest transition-all duration-300 ${
                      activeTattooFilter === filter
                        ? "border-white bg-white text-black"
                        : "border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {isLoading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-neutral-800 border-t-white" />
                <p className="text-neutral-400">Loading portfolio...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="max-w-lg text-center">
                <h2 className="font-home-serif text-3xl text-white">
                  Unable to Load Portfolio
                </h2>
                <p className="mt-4 text-neutral-400">{error}</p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => router.refresh()}
                    className="border border-white bg-white px-8 py-3 text-sm uppercase tracking-[0.2em] text-black transition-colors duration-300 hover:bg-neutral-200"
                  >
                    Try Again
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/portfolio/tattoos")}
                    className="border border-neutral-700 px-8 py-3 text-sm uppercase tracking-[0.2em] text-neutral-300 transition-colors duration-300 hover:border-neutral-500 hover:text-white"
                  >
                    Open Tattoos
                  </button>
                </div>
              </div>
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="max-w-md text-center">
                <h2 className="font-home-serif text-3xl text-white">
                  No Works Yet
                </h2>
                <p className="mt-4 text-neutral-400">
                  {initialSection === "tattoos" && activeTattooFilter !== "All"
                    ? `There are no public items available in the ${activeTattooFilter} tattoo category right now.`
                    : `There are no public items available in the ${sectionTitle.toLowerCase()} collection right now.`}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {visibleItems.map((tattoo, index) => (
                <PortfolioGalleryCard
                  key={tattoo.id}
                  tattoo={tattoo}
                  index={index}
                  onSelect={setSelectedTattoo}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedTattoo ? (
        <TattooModal
          tattoo={selectedTattoo}
          onClose={() => setSelectedTattoo(null)}
        />
      ) : null}

      <Footer variant="home" />
    </div>
  );
}
