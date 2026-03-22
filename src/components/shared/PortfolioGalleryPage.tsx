"use client";

import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { useLocale } from "@/contexts/LocaleContext";
import TattooModal from "@/components/ui/TattooModal";
import type { Tattoo } from "@/types/tattoo";

type PortfolioSection = "tattoos" | "designs" | "art";
const ALL_FILTER = "__all__";

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

function getCardLabel(
  category: string | null,
  labels: {
    tattoo: string;
    designs: string;
    art: string;
  },
): string {
  const normalizedCategory = category?.trim();

  if (!normalizedCategory) {
    return labels.tattoo;
  }

  if (normalizedCategory.toLowerCase() === "designs") {
    return labels.designs;
  }

  if (normalizedCategory.toLowerCase() === "art") {
    return labels.art;
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
  const { copy } = useLocale();
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
      aria-label={copy.portfolio.viewInFullSize(
        tattoo.title || copy.portfolio.labels.untitled,
      )}
      disabled={!canOpen}
    >
      <Image
        src={imageSrc}
        alt={tattoo.title || copy.portfolio.imageAlt}
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
          {getCardLabel(tattoo.category, copy.portfolio.labels)}
        </p>
        <h3 className="font-home-serif text-xl italic text-white">
          {tattoo.title || copy.portfolio.labels.untitled}
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
  const { copy } = useLocale();
  const [activeTattooFilter, setActiveTattooFilter] = useState(ALL_FILTER);
  const [tattoos, setTattoos] = useState<Tattoo[]>([]);
  const [selectedTattoo, setSelectedTattoo] = useState<Tattoo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setActiveTattooFilter(ALL_FILTER);
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
          throw new Error(copy.portfolio.errorMessage);
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
            : copy.portfolio.errorMessage,
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
  }, [copy.portfolio.errorMessage]);

  const sectionItems = tattoos.filter(
    (tattoo) => getPortfolioSection(tattoo.category) === initialSection,
  );

  const tattooStyleFilters = [
    ALL_FILTER,
    ...Array.from(
      new Set(
        sectionItems.map((tattoo) => getTattooStyleFilter(tattoo.category)),
      ),
    ).sort((left, right) => left.localeCompare(right)),
  ];

  const visibleItems =
    initialSection === "tattoos" && activeTattooFilter !== ALL_FILTER
      ? sectionItems.filter(
          (tattoo) =>
            getTattooStyleFilter(tattoo.category) === activeTattooFilter,
        )
      : sectionItems;

  const sectionTitle = copy.portfolio.sections[initialSection].title;
  const sectionHelper = copy.portfolio.sections[initialSection].helper;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-home-sans">
      <Header variant="home" />

      <main className="px-6 py-20">
        <div className="container mx-auto max-w-6xl space-y-16">
          <div className="space-y-8 text-center">
            <p className="font-home-sans text-[0.7rem] uppercase tracking-[0.34em] text-neutral-500">
              {copy.portfolio.heading}
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
                    {filter === ALL_FILTER ? copy.portfolio.labels.all : filter}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {isLoading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-neutral-800 border-t-white" />
                <p className="text-neutral-400">{copy.portfolio.loading}</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="max-w-lg text-center">
                <h2 className="font-home-serif text-3xl text-white">
                  {copy.portfolio.errorTitle}
                </h2>
                <p className="mt-4 text-neutral-400">{error}</p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => router.refresh()}
                    className="border border-white bg-white px-8 py-3 text-sm uppercase tracking-[0.2em] text-black transition-colors duration-300 hover:bg-neutral-200"
                  >
                    {copy.portfolio.retry}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/portfolio/tattoos")}
                    className="border border-neutral-700 px-8 py-3 text-sm uppercase tracking-[0.2em] text-neutral-300 transition-colors duration-300 hover:border-neutral-500 hover:text-white"
                  >
                    {copy.portfolio.openTattoos}
                  </button>
                </div>
              </div>
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="max-w-md text-center">
                <h2 className="font-home-serif text-3xl text-white">
                  {copy.portfolio.noWorksYet}
                </h2>
                <p className="mt-4 text-neutral-400">
                  {initialSection === "tattoos" &&
                  activeTattooFilter !== ALL_FILTER
                    ? copy.portfolio.noCategoryItems(activeTattooFilter)
                    : copy.portfolio.noCollectionItems(
                        sectionTitle.toLowerCase(),
                      )}
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
