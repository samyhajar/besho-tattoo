import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPortfolioSection } from "@/lib/portfolio-media";
import type { Database } from "@/types/supabase";
import type { PortfolioMedia, Tattoo } from "@/types/tattoo";

type TattooRow = Database["public"]["Tables"]["tattoos"]["Row"];
type PortfolioMediaRow = Database["public"]["Tables"]["portfolio_media"]["Row"];

function createLegacyMediaRow(tattoo: TattooRow): PortfolioMediaRow | null {
  if (!tattoo.image_url) {
    return null;
  }

  return {
    id: `legacy-${tattoo.id}`,
    tattoo_id: tattoo.id,
    storage_path: tattoo.image_url,
    media_type: "image",
    sort_order: 0,
    is_primary: true,
    created_at: tattoo.created_at,
  };
}

function sortMedia(media: PortfolioMedia[]) {
  return [...media].sort((left, right) => {
    if (left.is_primary && !right.is_primary) {
      return -1;
    }

    if (!left.is_primary && right.is_primary) {
      return 1;
    }

    if (left.sort_order !== right.sort_order) {
      return left.sort_order - right.sort_order;
    }

    return left.created_at.localeCompare(right.created_at);
  });
}

function hydrateTattoo(
  tattoo: TattooRow,
  mediaRows: PortfolioMediaRow[],
  displayUrls: Record<string, string>,
): Tattoo {
  const media = sortMedia(
    mediaRows.map((mediaRow) => ({
      id: mediaRow.id,
      tattoo_id: mediaRow.tattoo_id,
      storage_path: mediaRow.storage_path,
      media_type: mediaRow.media_type as PortfolioMedia["media_type"],
      sort_order: mediaRow.sort_order,
      is_primary: mediaRow.is_primary,
      created_at: mediaRow.created_at,
      display_url: displayUrls[mediaRow.storage_path] || null,
    })),
  );
  const primaryMedia =
    media.find((entry) => entry.is_primary && entry.media_type === "image") ||
    media.find((entry) => entry.media_type === "image") ||
    media[0] ||
    null;

  return {
    ...tattoo,
    media,
    primaryMedia,
    image_url: primaryMedia?.storage_path || tattoo.image_url,
  };
}

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data: tattoos, error: tattoosError } = await supabase
      .from("tattoos")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (tattoosError) {
      return NextResponse.json(
        { error: "Failed to fetch tattoos", details: tattoosError.message },
        { status: 500 },
      );
    }

    const tattooRows = tattoos || [];
    const tattooIds = tattooRows.map((tattoo) => tattoo.id);
    const mediaMap = new Map<string, PortfolioMediaRow[]>();

    if (tattooIds.length > 0) {
      const { data: mediaRows, error: mediaError } = await supabase
        .from("portfolio_media")
        .select("*")
        .in("tattoo_id", tattooIds)
        .order("sort_order", { ascending: true });

      if (
        mediaError &&
        !mediaError.message.includes("portfolio_media") &&
        !mediaError.message.includes("relation")
      ) {
        return NextResponse.json(
          {
            error: "Failed to fetch portfolio media",
            details: mediaError.message,
          },
          { status: 500 },
        );
      }

      (mediaRows || []).forEach((media) => {
        const currentRows = mediaMap.get(media.tattoo_id) || [];
        currentRows.push(media);
        mediaMap.set(media.tattoo_id, currentRows);
      });
    }

    tattooRows.forEach((tattoo) => {
      if (mediaMap.has(tattoo.id)) {
        return;
      }

      const legacyMedia = createLegacyMediaRow(tattoo);
      if (legacyMedia) {
        mediaMap.set(tattoo.id, [legacyMedia]);
      }
    });

    const displayUrls: Record<string, string> = {};
    await Promise.all(
      tattooRows.flatMap((tattoo) => {
        const bucket = getPortfolioSection(tattoo.category);
        const mediaRows = mediaMap.get(tattoo.id) || [];

        return mediaRows.map(async (media) => {
          if (!media.storage_path || displayUrls[media.storage_path]) {
            return;
          }

          const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(media.storage_path, 3600);

          if (!error && data?.signedUrl) {
            displayUrls[media.storage_path] = data.signedUrl;
          }
        });
      }),
    );

    const response = NextResponse.json({
      tattoos: tattooRows.map((tattoo) =>
        hydrateTattoo(tattoo, mediaMap.get(tattoo.id) || [], displayUrls),
      ),
    });

    response.headers.set(
      "Cache-Control",
      "public, s-maxage=30, stale-while-revalidate=10",
    );

    return response;
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
