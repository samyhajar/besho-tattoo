"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Video } from "lucide-react";
import type { PortfolioMedia, Tattoo } from "@/types/tattoo";

interface PortfolioMediaCarouselProps {
  tattoo: Tattoo;
  theme?: "dark" | "light";
}

function orderMedia(media: PortfolioMedia[]) {
  const images = media
    .filter((item) => item.media_type === "image")
    .sort((left, right) => left.sort_order - right.sort_order);
  const videos = media
    .filter((item) => item.media_type === "video")
    .sort((left, right) => left.sort_order - right.sort_order);
  const primaryImage = images.find((item) => item.is_primary) || images[0];
  const remainingImages = images.filter((item) => item.id !== primaryImage?.id);

  return [
    ...(primaryImage ? [primaryImage] : []),
    ...remainingImages,
    ...videos,
  ];
}

function VideoThumbnail({ src, title }: { src: string; title: string }) {
  return (
    <div className="relative h-full w-full">
      <video
        src={src}
        className="h-full w-full object-cover"
        muted
        playsInline
        preload="metadata"
        tabIndex={-1}
        onLoadedMetadata={(event) => {
          const video = event.currentTarget;

          try {
            if (Number.isFinite(video.duration) && video.duration > 0.05) {
              video.currentTime = 0.05;
            }
          } catch {
            // Keep the default first frame if seeking is not allowed.
          }
        }}
        aria-label={`${title} video preview`}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
        <div className="rounded-full bg-black/60 p-2 text-white shadow-lg">
          <Video className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function PortfolioMediaCarousel({
  tattoo,
  theme = "dark",
}: PortfolioMediaCarouselProps) {
  const orderedMedia = useMemo(
    () => orderMedia(tattoo.media || []),
    [tattoo.media],
  );
  const [activeMediaId, setActiveMediaId] = useState<string | null>(null);
  const activeIndex = Math.max(
    0,
    orderedMedia.findIndex((media) => media.id === activeMediaId),
  );
  const activeMedia = orderedMedia[activeIndex] || null;
  const isDark = theme === "dark";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (orderedMedia.length <= 1) {
        return;
      }

      if (event.key === "ArrowLeft") {
        const nextIndex =
          activeIndex === 0 ? orderedMedia.length - 1 : activeIndex - 1;
        setActiveMediaId(orderedMedia[nextIndex].id);
      }

      if (event.key === "ArrowRight") {
        const nextIndex =
          activeIndex === orderedMedia.length - 1 ? 0 : activeIndex + 1;
        setActiveMediaId(orderedMedia[nextIndex].id);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, orderedMedia]);

  const goPrevious = () => {
    const nextIndex =
      activeIndex === 0 ? orderedMedia.length - 1 : activeIndex - 1;
    setActiveMediaId(orderedMedia[nextIndex].id);
  };

  const goNext = () => {
    const nextIndex =
      activeIndex === orderedMedia.length - 1 ? 0 : activeIndex + 1;
    setActiveMediaId(orderedMedia[nextIndex].id);
  };

  if (!activeMedia) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-gray-100 text-sm text-gray-500">
        No media available
      </div>
    );
  }

  return (
    <div className="mx-auto w-full space-y-4">
      <div
        className={`relative overflow-hidden rounded-2xl border ${
          isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-100"
        }`}
      >
        <div className="flex min-h-[22rem] items-center justify-center bg-black/5">
          {activeMedia.media_type === "image" && activeMedia.display_url ? (
            <Image
              src={activeMedia.display_url}
              alt={tattoo.title}
              width={1200}
              height={1200}
              unoptimized
              className="max-h-[70vh] w-full object-contain"
            />
          ) : activeMedia.display_url ? (
            <video
              src={activeMedia.display_url}
              className="max-h-[70vh] w-full object-contain"
              controls
              autoPlay
              playsInline
            />
          ) : (
            <div className="py-24 text-sm text-gray-500">Media unavailable</div>
          )}
        </div>

        {orderedMedia.length > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrevious}
              className={`absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-3 ${
                isDark
                  ? "bg-black/60 text-white hover:bg-black/80"
                  : "bg-white/90 text-gray-900 hover:bg-white"
              }`}
              aria-label="Show previous media"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-3 ${
                isDark
                  ? "bg-black/60 text-white hover:bg-black/80"
                  : "bg-white/90 text-gray-900 hover:bg-white"
              }`}
              aria-label="Show next media"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      {orderedMedia.length > 1 ? (
        <div className="flex flex-wrap justify-center gap-3">
          {orderedMedia.map((media, index) => (
            <button
              key={media.id}
              type="button"
              onClick={() => setActiveMediaId(media.id)}
              className={`w-24 overflow-hidden rounded-xl border sm:w-28 md:w-32 ${
                index === activeIndex
                  ? isDark
                    ? "border-white bg-white/10"
                    : "border-gray-900 bg-gray-100"
                  : isDark
                    ? "border-white/10 bg-white/5"
                    : "border-gray-200 bg-white"
              }`}
              aria-label={`Show media ${index + 1}`}
            >
              <div className="aspect-square bg-black/5">
                {media.media_type === "image" && media.display_url ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={media.display_url}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ) : media.display_url ? (
                  <VideoThumbnail
                    src={media.display_url}
                    title={tattoo.title}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-gray-400">
                    Missing
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
