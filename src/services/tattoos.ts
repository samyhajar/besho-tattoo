import { createClient } from "@/lib/supabase/browser-client";
import {
  buildPortfolioMediaPath,
  getPortfolioSection,
  type PortfolioSection,
} from "@/lib/portfolio-media";
import type { Database } from "@/types/supabase";
import type {
  PendingPortfolioMediaUpload,
  PortfolioMedia,
  PrimaryMediaSelection,
  Tattoo as TattooModel,
  TattooMutationInput,
} from "@/types/tattoo";

type SupabaseClient = ReturnType<typeof createClient<Database>>;
type TattooRow = Database["public"]["Tables"]["tattoos"]["Row"];
type TattooInsert = Database["public"]["Tables"]["tattoos"]["Insert"];
type TattooUpdate = Database["public"]["Tables"]["tattoos"]["Update"];
type PortfolioMediaRow = Database["public"]["Tables"]["portfolio_media"]["Row"];
type PortfolioMediaInsert =
  Database["public"]["Tables"]["portfolio_media"]["Insert"];

export type Tattoo = TattooModel;

type PreparedPendingMediaUpload = PendingPortfolioMediaUpload & {
  mediaId: string;
  storagePath: string;
};

function getBucketName(category: string | null | undefined): PortfolioSection {
  return getPortfolioSection(category);
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

function mapMediaRow(
  media: PortfolioMediaRow,
  displayUrl?: string | null,
): PortfolioMedia {
  return {
    id: media.id,
    tattoo_id: media.tattoo_id,
    storage_path: media.storage_path,
    media_type: media.media_type as PortfolioMedia["media_type"],
    sort_order: media.sort_order,
    is_primary: media.is_primary,
    created_at: media.created_at,
    display_url: displayUrl || null,
  };
}

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

function findPrimaryMedia(media: PortfolioMedia[]): PortfolioMedia | null {
  const primaryImage =
    media.find((entry) => entry.is_primary && entry.media_type === "image") ||
    media.find((entry) => entry.media_type === "image") ||
    media[0];

  return primaryImage || null;
}

function hydrateTattoo(
  tattoo: TattooRow,
  mediaRows: PortfolioMediaRow[],
  displayUrls: Record<string, string>,
): Tattoo {
  const media = sortMedia(
    mediaRows.map((entry) =>
      mapMediaRow(entry, displayUrls[entry.storage_path]),
    ),
  );
  const primaryMedia = findPrimaryMedia(media);

  return {
    ...tattoo,
    media,
    primaryMedia,
    image_url: primaryMedia?.storage_path || tattoo.image_url,
  };
}

async function fetchPortfolioMediaMap(
  supabase: SupabaseClient,
  tattooIds: string[],
) {
  const mediaMap = new Map<string, PortfolioMediaRow[]>();

  if (tattooIds.length === 0) {
    return mediaMap;
  }

  const { data, error } = await supabase
    .from("portfolio_media")
    .select("*")
    .in("tattoo_id", tattooIds)
    .order("sort_order", { ascending: true });

  if (error) {
    // Allow read paths to keep working before the migration is applied.
    if (
      error.message.includes("portfolio_media") ||
      error.message.includes("relation")
    ) {
      return mediaMap;
    }

    throw error;
  }

  (data || []).forEach((row) => {
    const currentMedia = mediaMap.get(row.tattoo_id) || [];
    currentMedia.push(row);
    mediaMap.set(row.tattoo_id, currentMedia);
  });

  return mediaMap;
}

async function createMediaDisplayUrlMap(
  supabase: SupabaseClient,
  tattoos: TattooRow[],
  mediaMap: Map<string, PortfolioMediaRow[]>,
) {
  const displayUrls: Record<string, string> = {};
  const tasks: Array<Promise<void>> = [];

  tattoos.forEach((tattoo) => {
    const bucket = getBucketName(tattoo.category);
    const mediaRows = mediaMap.get(tattoo.id) || [];

    mediaRows.forEach((media) => {
      if (!media.storage_path || displayUrls[media.storage_path]) {
        return;
      }

      tasks.push(
        supabase.storage
          .from(bucket)
          .createSignedUrl(media.storage_path, 3600)
          .then(({ data, error }) => {
            if (error) {
              console.warn(
                `Failed to generate signed URL for ${media.storage_path}:`,
                error,
              );
              return;
            }

            if (data?.signedUrl) {
              displayUrls[media.storage_path] = data.signedUrl;
            }
          }),
      );
    });
  });

  await Promise.all(tasks);
  return displayUrls;
}

async function fetchTattooRows(
  supabase: SupabaseClient,
  publicOnly: boolean,
): Promise<TattooRow[]> {
  let query = supabase.from("tattoos").select("*").order("created_at", {
    ascending: false,
  });

  if (publicOnly) {
    query = query.eq("is_public", true);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data || [];
}

async function hydrateTattooRows(
  supabase: SupabaseClient,
  rows: TattooRow[],
): Promise<Tattoo[]> {
  const mediaMap = await fetchPortfolioMediaMap(
    supabase,
    rows.map((row) => row.id),
  );

  rows.forEach((row) => {
    if (mediaMap.has(row.id)) {
      return;
    }

    const legacyMedia = createLegacyMediaRow(row);
    if (legacyMedia) {
      mediaMap.set(row.id, [legacyMedia]);
    }
  });

  const displayUrls = await createMediaDisplayUrlMap(supabase, rows, mediaMap);

  return rows.map((row) =>
    hydrateTattoo(row, mediaMap.get(row.id) || [], displayUrls),
  );
}

async function fetchTattooRowById(
  supabase: SupabaseClient,
  id: string,
): Promise<TattooRow | null> {
  const { data, error } = await supabase
    .from("tattoos")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function fetchTattooMediaRowsById(
  supabase: SupabaseClient,
  tattooId: string,
): Promise<PortfolioMediaRow[]> {
  const { data, error } = await supabase
    .from("portfolio_media")
    .select("*")
    .eq("tattoo_id", tattooId)
    .order("sort_order", { ascending: true });

  if (error) {
    if (
      error.message.includes("portfolio_media") ||
      error.message.includes("relation")
    ) {
      return [];
    }

    throw error;
  }

  return data || [];
}

function preparePendingUploads(
  tattooId: string,
  pendingMedia: PendingPortfolioMediaUpload[],
  startingSortOrder: number,
) {
  return pendingMedia.map((media, index) => {
    const mediaId = crypto.randomUUID();

    return {
      ...media,
      mediaId,
      sortOrder: startingSortOrder + index,
      storagePath: buildPortfolioMediaPath({
        tattooId,
        mediaId,
        fileName: media.file.name,
      }),
    };
  });
}

function resolvePrimarySelection(params: {
  existingMedia: PortfolioMediaRow[];
  pendingMedia: PreparedPendingMediaUpload[];
  removedMediaIds: string[];
  primarySelection: PrimaryMediaSelection | null;
}) {
  const visibleExistingImages = params.existingMedia.filter(
    (media) =>
      media.media_type === "image" &&
      !params.removedMediaIds.includes(media.id),
  );
  const visiblePendingImages = params.pendingMedia.filter(
    (media) => media.mediaType === "image",
  );

  if (params.primarySelection?.kind === "existing") {
    const primaryMediaId = params.primarySelection.mediaId;
    const existing = visibleExistingImages.find(
      (media) => media.id === primaryMediaId,
    );

    if (existing) {
      return {
        kind: "existing" as const,
        mediaId: existing.id,
        storagePath: existing.storage_path,
      };
    }
  }

  if (params.primarySelection?.kind === "pending") {
    const primaryClientId = params.primarySelection.clientId;
    const pending = visiblePendingImages.find(
      (media) => media.clientId === primaryClientId,
    );

    if (pending) {
      return {
        kind: "pending" as const,
        mediaId: pending.mediaId,
        storagePath: pending.storagePath,
      };
    }
  }

  const existingPrimary =
    visibleExistingImages.find((media) => media.is_primary) ||
    visibleExistingImages[0];
  if (existingPrimary) {
    return {
      kind: "existing" as const,
      mediaId: existingPrimary.id,
      storagePath: existingPrimary.storage_path,
    };
  }

  const pendingPrimary = visiblePendingImages[0];
  if (pendingPrimary) {
    return {
      kind: "pending" as const,
      mediaId: pendingPrimary.mediaId,
      storagePath: pendingPrimary.storagePath,
    };
  }

  throw new Error("At least one image is required for each portfolio item.");
}

async function uploadPreparedMedia(
  supabase: SupabaseClient,
  bucket: PortfolioSection,
  media: PreparedPendingMediaUpload[],
) {
  const uploadedPaths: string[] = [];

  for (const item of media) {
    const { error } = await supabase.storage
      .from(bucket)
      .upload(item.storagePath, item.file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    uploadedPaths.push(item.storagePath);
  }

  return uploadedPaths;
}

async function removeStorageObjects(
  supabase: SupabaseClient,
  bucket: PortfolioSection,
  paths: string[],
) {
  if (paths.length === 0) {
    return;
  }

  try {
    await supabase.storage.from(bucket).remove(paths);
  } catch (error) {
    console.warn("Failed to delete media from storage:", error);
  }
}

async function insertPortfolioMediaRows(
  supabase: SupabaseClient,
  tattooId: string,
  pendingMedia: PreparedPendingMediaUpload[],
  primaryMediaId: string,
) {
  if (pendingMedia.length === 0) {
    return;
  }

  const inserts: PortfolioMediaInsert[] = pendingMedia.map((media) => ({
    id: media.mediaId,
    tattoo_id: tattooId,
    storage_path: media.storagePath,
    media_type: media.mediaType,
    sort_order: media.sortOrder,
    is_primary: media.mediaId === primaryMediaId,
  }));

  const { error } = await supabase.from("portfolio_media").insert(inserts);

  if (error) {
    throw new Error(error.message);
  }
}

async function refetchTattooOrThrow(
  supabase: SupabaseClient,
  tattooId: string,
): Promise<Tattoo> {
  const tattooRow = await fetchTattooRowById(supabase, tattooId);
  if (!tattooRow) {
    throw new Error("Tattoo not found.");
  }

  const hydratedRows = await hydrateTattooRows(supabase, [tattooRow]);
  return hydratedRows[0];
}

export async function fetchTattoos(): Promise<Tattoo[]> {
  const supabase = createClient<Database>();
  const rows = await fetchTattooRows(supabase, true);
  return hydrateTattooRows(supabase, rows);
}

export async function fetchAllTattoos(): Promise<Tattoo[]> {
  const supabase = createClient<Database>();
  const rows = await fetchTattooRows(supabase, false);
  return hydrateTattooRows(supabase, rows);
}

export async function fetchTattoo(id: string): Promise<Tattoo | null> {
  const supabase = createClient<Database>();
  const row = await fetchTattooRowById(supabase, id);

  if (!row) {
    return null;
  }

  return refetchTattooOrThrow(supabase, id);
}

export async function createTattoo(
  tattoo: TattooMutationInput,
): Promise<Tattoo> {
  const supabase = createClient<Database>();
  const tattooId = tattoo.id || crypto.randomUUID();
  const bucket = getBucketName(tattoo.category);

  if (tattoo.media.pendingMedia.length === 0) {
    throw new Error("Please upload at least one image.");
  }

  const preparedPending = preparePendingUploads(
    tattooId,
    tattoo.media.pendingMedia,
    0,
  );
  const primaryMedia = resolvePrimarySelection({
    existingMedia: [],
    pendingMedia: preparedPending,
    removedMediaIds: [],
    primarySelection: tattoo.media.primarySelection,
  });

  const tattooInsert: TattooInsert = {
    id: tattooId,
    title: tattoo.title,
    description: tattoo.description,
    category: tattoo.category,
    is_public: tattoo.is_public,
    image_url: primaryMedia.storagePath,
  };

  const { error: insertTattooError } = await supabase
    .from("tattoos")
    .insert(tattooInsert);

  if (insertTattooError) {
    throw new Error(insertTattooError.message);
  }

  let uploadedPaths: string[] = [];

  try {
    uploadedPaths = await uploadPreparedMedia(
      supabase,
      bucket,
      preparedPending,
    );
    await insertPortfolioMediaRows(
      supabase,
      tattooId,
      preparedPending,
      primaryMedia.mediaId,
    );

    return await refetchTattooOrThrow(supabase, tattooId);
  } catch (error) {
    await removeStorageObjects(supabase, bucket, uploadedPaths);
    await supabase.from("tattoos").delete().eq("id", tattooId);
    throw error;
  }
}

export async function updateTattoo(
  id: string,
  tattoo: Omit<TattooMutationInput, "id">,
): Promise<Tattoo> {
  const supabase = createClient<Database>();
  const tattooRow = await fetchTattooRowById(supabase, id);

  if (!tattooRow) {
    throw new Error("Tattoo not found.");
  }

  const existingMedia = await fetchTattooMediaRowsById(supabase, id);
  const retainedExistingMedia = existingMedia.filter(
    (media) => !tattoo.media.removedMediaIds.includes(media.id),
  );
  const imageCount =
    retainedExistingMedia.filter((media) => media.media_type === "image")
      .length +
    tattoo.media.pendingMedia.filter((media) => media.mediaType === "image")
      .length;

  if (imageCount === 0) {
    throw new Error("At least one image is required for each portfolio item.");
  }

  const nextSortOrder =
    retainedExistingMedia.reduce(
      (maxOrder, media) => Math.max(maxOrder, media.sort_order),
      -1,
    ) + 1;
  const preparedPending = preparePendingUploads(
    id,
    tattoo.media.pendingMedia,
    nextSortOrder,
  );
  const primaryMedia = resolvePrimarySelection({
    existingMedia,
    pendingMedia: preparedPending,
    removedMediaIds: tattoo.media.removedMediaIds,
    primarySelection: tattoo.media.primarySelection,
  });
  const bucket = getBucketName(tattoo.category ?? tattooRow.category);

  let uploadedPaths: string[] = [];

  try {
    uploadedPaths = await uploadPreparedMedia(
      supabase,
      bucket,
      preparedPending,
    );

    if (tattoo.media.removedMediaIds.length > 0) {
      const { error: deleteMediaError } = await supabase
        .from("portfolio_media")
        .delete()
        .in("id", tattoo.media.removedMediaIds);

      if (deleteMediaError) {
        throw new Error(deleteMediaError.message);
      }
    }

    await insertPortfolioMediaRows(
      supabase,
      id,
      preparedPending,
      primaryMedia.mediaId,
    );

    const { error: unsetPrimaryError } = await supabase
      .from("portfolio_media")
      .update({ is_primary: false })
      .eq("tattoo_id", id);

    if (unsetPrimaryError) {
      throw new Error(unsetPrimaryError.message);
    }

    const { error: setPrimaryError } = await supabase
      .from("portfolio_media")
      .update({ is_primary: true })
      .eq("id", primaryMedia.mediaId);

    if (setPrimaryError) {
      throw new Error(setPrimaryError.message);
    }

    const tattooUpdate: TattooUpdate = {
      title: tattoo.title,
      description: tattoo.description,
      category: tattoo.category,
      is_public: tattoo.is_public,
      image_url: primaryMedia.storagePath,
    };

    const { error: updateTattooError } = await supabase
      .from("tattoos")
      .update(tattooUpdate)
      .eq("id", id);

    if (updateTattooError) {
      throw new Error(updateTattooError.message);
    }

    const removedStoragePaths = existingMedia
      .filter((media) => tattoo.media.removedMediaIds.includes(media.id))
      .map((media) => media.storage_path);
    await removeStorageObjects(supabase, bucket, removedStoragePaths);

    return await refetchTattooOrThrow(supabase, id);
  } catch (error) {
    await removeStorageObjects(supabase, bucket, uploadedPaths);
    throw error;
  }
}

export async function deleteTattoo(id: string): Promise<void> {
  const supabase = createClient<Database>();
  const tattoo = await fetchTattoo(id);
  if (!tattoo) {
    throw new Error("Tattoo not found");
  }

  const bucket = getBucketName(tattoo.category);
  const mediaPaths = (tattoo.media || []).map((media) => media.storage_path);

  const { error: deleteError } = await supabase
    .from("tattoos")
    .delete()
    .eq("id", id);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  await removeStorageObjects(supabase, bucket, mediaPaths);
}

export async function setFeatureImage(tattooId: string): Promise<Tattoo> {
  const supabase = createClient<Database>();

  const tattoo = await fetchTattooRowById(supabase, tattooId);
  if (!tattoo) {
    throw new Error("Tattoo not found");
  }

  if (tattoo.category) {
    await supabase
      .from("tattoos")
      .update({ is_feature_image: false })
      .eq("category", tattoo.category)
      .eq("is_feature_image", true);
  }

  const { error } = await supabase
    .from("tattoos")
    .update({ is_feature_image: true })
    .eq("id", tattooId);

  if (error) {
    throw new Error(error.message);
  }

  return refetchTattooOrThrow(supabase, tattooId);
}

export async function unsetFeatureImage(tattooId: string): Promise<Tattoo> {
  const supabase = createClient<Database>();

  const { error } = await supabase
    .from("tattoos")
    .update({ is_feature_image: false })
    .eq("id", tattooId);

  if (error) {
    throw new Error(error.message);
  }

  return refetchTattooOrThrow(supabase, tattooId);
}

export async function getFeatureImage(
  category: string,
): Promise<Tattoo | null> {
  const supabase = createClient<Database>();

  const { data, error } = await supabase
    .from("tattoos")
    .select("*")
    .eq("category", category)
    .eq("is_feature_image", true)
    .eq("is_public", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return refetchTattooOrThrow(supabase, data.id);
}

export async function getTattooStats() {
  const supabase = createClient<Database>();

  const { data, error } = await supabase
    .from("tattoos")
    .select("id, category, created_at");

  if (error) {
    throw error;
  }

  const total = data?.length || 0;
  const categories = new Set(
    data?.map((entry) => entry.category).filter(Boolean),
  ).size;
  const thisMonth =
    data?.filter((entry) => {
      const createdDate = new Date(entry.created_at);
      const now = new Date();
      return (
        createdDate.getMonth() === now.getMonth() &&
        createdDate.getFullYear() === now.getFullYear()
      );
    }).length || 0;

  return { total, categories, thisMonth };
}

export async function getExistingCategories(): Promise<string[]> {
  const supabase = createClient<Database>();

  const { data, error } = await supabase
    .from("tattoos")
    .select("category")
    .not("category", "is", null)
    .not("category", "eq", "");

  if (error) {
    throw error;
  }

  const categories = [
    ...new Set((data || []).map((entry) => entry.category).filter(Boolean)),
  ] as string[];

  return categories.sort();
}

export async function getActiveCategories(): Promise<string[]> {
  return getExistingCategories();
}
