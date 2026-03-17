import { createClient } from "@/lib/supabase/browser-client";
import type { Database } from "@/types/supabase";

export type Tattoo = Database["public"]["Tables"]["tattoos"]["Row"];
export type TattooInsert = Database["public"]["Tables"]["tattoos"]["Insert"];
export type TattooUpdate = Database["public"]["Tables"]["tattoos"]["Update"];

/**
 * Fetches all public tattoo portfolio entries ordered by newest first.
 * For public display - only returns tattoos marked as public.
 */
export async function fetchTattoos(): Promise<Tattoo[]> {
  const supabase = createClient<Database>();
  const { data, error } = await supabase
    .from("tattoos")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Fetches all tattoo entries (public and private) for admin use.
 * Requires admin authentication.
 */
export async function fetchAllTattoos(): Promise<Tattoo[]> {
  const supabase = createClient<Database>();
  const { data, error } = await supabase
    .from("tattoos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Fetch a single tattoo by ID. Returns `null` when not found.
 */
export async function fetchTattoo(id: string): Promise<Tattoo | null> {
  const supabase = createClient<Database>();
  const { data, error } = await supabase
    .from("tattoos")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") throw error; // not-found falls through
  return data;
}

/**
 * Upload an image file to Supabase storage and return the file path.
 * Requires authentication.
 */
export async function uploadTattooImage(
  file: File,
  category: string = "tattoos",
): Promise<string> {
  const supabase = createClient<Database>();

  // Generate unique filename with timestamp
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = fileName; // Store directly in the category bucket

  // Determine the bucket based on category
  const bucketName = category === "tattoos" ? "tattoos" : category;

  // Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // Return the file path (we'll generate signed URLs when needed)
  return filePath;
}

/**
 * Generate a signed URL for a tattoo image.
 * This allows secure access to private storage bucket files.
 */
export async function getTattooImageUrl(
  imagePath: string,
  category: string = "tattoos",
): Promise<string> {
  const supabase = createClient<Database>();

  // Determine the bucket based on category
  const bucketName = category === "tattoos" ? "tattoos" : category;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(imagePath, 3600); // 1 hour expiry

  if (error) throw error;
  return data.signedUrl;
}

/**
 * Generate signed URLs for multiple tattoo images at once.
 * More efficient than calling getTattooImageUrl multiple times.
 */
export async function getTattooImageUrls(
  imagePaths: string[],
  category: string = "tattoos",
): Promise<Record<string, string>> {
  const supabase = createClient<Database>();

  const signedUrls: Record<string, string> = {};

  // Process in batches to avoid overwhelming the API
  const batchSize = 10;
  for (let i = 0; i < imagePaths.length; i += batchSize) {
    const batch = imagePaths.slice(i, i + batchSize);

    const promises = batch.map(async (path) => {
      try {
        // Determine the bucket based on category
        const bucketName = category === "tattoos" ? "tattoos" : category;

        const { data, error } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(path, 3600);

        if (error) throw error;
        return { path, url: data?.signedUrl || null };
      } catch (error) {
        console.warn(`Failed to generate signed URL for ${path}:`, error);
        return { path, url: null };
      }
    });

    const results = await Promise.all(promises);
    results.forEach(({ path, url }) => {
      if (url) signedUrls[path] = url;
    });
  }

  return signedUrls;
}

/**
 * Create a new tattoo entry.
 * Requires admin authentication.
 */
export async function createTattoo(
  tattoo: Omit<TattooInsert, "id" | "created_at">,
): Promise<Tattoo> {
  const supabase = createClient<Database>();

  const { data, error } = await supabase
    .from("tattoos")
    .insert(tattoo)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing tattoo.
 * Requires admin authentication.
 */
export async function updateTattoo(
  id: string,
  updates: TattooUpdate,
): Promise<Tattoo> {
  const supabase = createClient<Database>();

  const { data, error } = await supabase
    .from("tattoos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a tattoo and its associated image.
 * Requires admin authentication.
 */
export async function deleteTattoo(id: string): Promise<void> {
  const supabase = createClient<Database>();

  // First get the tattoo to extract image path
  const tattoo = await fetchTattoo(id);
  if (!tattoo) throw new Error("Tattoo not found");

  // Delete from database
  const { error: deleteError } = await supabase
    .from("tattoos")
    .delete()
    .eq("id", id);

  if (deleteError) throw deleteError;

  // Delete image from storage if it exists
  if (tattoo.image_url) {
    try {
      // The image_url now contains just the file path, not a full URL
      await supabase.storage.from("tattoos").remove([tattoo.image_url]);
    } catch (error) {
      // Log but don't throw - image deletion is not critical
      console.warn("Failed to delete image from storage:", error);
    }
  }
}

/**
 * Set an image as the feature image for its category.
 * This will unset any other feature image in the same category.
 */
export async function setFeatureImage(tattooId: string): Promise<Tattoo> {
  const supabase = createClient<Database>();

  // First, get the tattoo to know its category
  const { data: tattoo, error: fetchError } = await supabase
    .from("tattoos")
    .select("*")
    .eq("id", tattooId)
    .single();

  if (fetchError || !tattoo) {
    throw new Error("Tattoo not found");
  }

  // Unset any existing feature image in the same category
  if (tattoo.category) {
    await supabase
      .from("tattoos")
      .update({ is_feature_image: false })
      .eq("category", tattoo.category)
      .eq("is_feature_image", true);
  }

  // Set this tattoo as the feature image
  const { data, error } = await supabase
    .from("tattoos")
    .update({ is_feature_image: true })
    .eq("id", tattooId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Unset a feature image.
 */
export async function unsetFeatureImage(tattooId: string): Promise<Tattoo> {
  const supabase = createClient<Database>();

  const { data, error } = await supabase
    .from("tattoos")
    .update({ is_feature_image: false })
    .eq("id", tattooId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get the feature image for a specific category.
 */
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
    .single();

  if (error && error.code !== "PGRST116") throw error; // not-found falls through
  return data;
}

/**
 * Get tattoo statistics for dashboard.
 */
export async function getTattooStats() {
  const supabase = createClient<Database>();

  const { data, error } = await supabase
    .from("tattoos")
    .select("id, category, created_at");

  if (error) throw error;
  if (!data) throw new Error("No data returned");

  const total = data.length;
  const categories = new Set(data.map((t) => t.category).filter(Boolean)).size;
  const thisMonth = data.filter((t) => {
    const createdDate = new Date(t.created_at);
    const now = new Date();
    return (
      createdDate.getMonth() === now.getMonth() &&
      createdDate.getFullYear() === now.getFullYear()
    );
  }).length;

  return { total, categories, thisMonth };
}

/**
 * Get all existing categories from tattoos.
 * Returns categories that have at least one tattoo.
 */
export async function getExistingCategories(): Promise<string[]> {
  const supabase = createClient<Database>();

  const { data, error } = await supabase
    .from("tattoos")
    .select("category")
    .not("category", "is", null)
    .not("category", "eq", "");

  if (error) throw error;
  if (!data) return [];

  // Get unique categories and sort them alphabetically
  const categories = [
    ...new Set(data.map((t) => t.category).filter(Boolean)),
  ] as string[];
  return categories.sort();
}

/**
 * Get categories that have at least one tattoo (for frontend display).
 * This ensures empty categories don't appear in the public portfolio.
 */
export async function getActiveCategories(): Promise<string[]> {
  const supabase = createClient<Database>();

  const { data, error } = await supabase
    .from("tattoos")
    .select("category")
    .not("category", "is", null)
    .not("category", "eq", "");

  if (error) throw error;
  if (!data) return [];

  // Get unique categories and sort them alphabetically
  const categories = [
    ...new Set(data.map((t) => t.category).filter(Boolean)),
  ] as string[];
  return categories.sort();
}
