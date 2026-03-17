import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server-client";
import { getFeatureImage } from "@/services/tattoos";

type Tattoo = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string;
  is_public: boolean;
  created_at: string;
};

type FeatureImage = Tattoo | null;

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch only public tattoos for portfolio display
    const { data: tattoos, error: tattoosError } = await supabase
      .from("tattoos")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (tattoosError) {
      console.error("Error fetching tattoos:", tattoosError);
      return NextResponse.json(
        { error: "Failed to fetch tattoos", details: tattoosError.message },
        { status: 500 },
      );
    }

    // Fetch feature images for each portfolio category
    // Map portfolio categories to actual database categories
    const portfolioCategories = [
      {
        portfolio: "tattoos",
        dbCategories: ["Fine line", "Arabic design", "Maori", null, ""],
      },
      { portfolio: "art", dbCategories: ["art"] },
      { portfolio: "designs", dbCategories: ["designs"] },
    ];
    const featureImages: Record<string, FeatureImage> = {};

    for (const { portfolio, dbCategories } of portfolioCategories) {
      try {
        // Look for feature images in any of the mapped database categories
        for (const dbCategory of dbCategories) {
          let featureImage: FeatureImage = null;

          if (dbCategory === null) {
            // Handle null category by querying directly
            const { data, error } = await supabase
              .from("tattoos")
              .select("*")
              .is("category", null)
              .eq("is_feature_image", true)
              .eq("is_public", true)
              .single();

            if (!error || error.code === "PGRST116") {
              featureImage = data;
            }
            console.log(`Feature image for ${portfolio} (null):`, featureImage);
          } else if (dbCategory === "") {
            // Handle empty string category
            const { data, error } = await supabase
              .from("tattoos")
              .select("*")
              .eq("category", "")
              .eq("is_feature_image", true)
              .eq("is_public", true)
              .single();

            if (!error || error.code === "PGRST116") {
              featureImage = data;
            }
            console.log(
              `Feature image for ${portfolio} (empty):`,
              featureImage,
            );
          } else {
            featureImage = await getFeatureImage(dbCategory);
            console.log(
              `Feature image for ${portfolio} (${dbCategory}):`,
              featureImage,
            );
          }

          if (featureImage) {
            featureImages[portfolio] = featureImage;
            break; // Found a feature image for this portfolio category
          }
        }
      } catch (error) {
        console.warn(`Error fetching feature image for ${portfolio}:`, error);
      }
    }

    console.log("All feature images:", featureImages);

    // Generate public URLs for all images
    const publicUrls: Record<string, string> = {};

    if (tattoos && tattoos.length > 0) {
      const imagePaths = (tattoos as Tattoo[])
        .map((tattoo) => tattoo.image_url)
        .filter(Boolean);

      // Add feature images to the list
      Object.values(featureImages).forEach((featureImage) => {
        if (
          featureImage?.image_url &&
          !imagePaths.includes(featureImage.image_url)
        ) {
          imagePaths.push(featureImage.image_url);
        }
      });

      // Generate public URLs for all images
      imagePaths.forEach((path) => {
        // Find the tattoo that has this image to determine the correct bucket
        const tattoo = (tattoos as Tattoo[]).find((t) => t.image_url === path);
        const featureImage = Object.values(featureImages).find(
          (fi) => fi?.image_url === path,
        );

        let bucketName = "tattoos"; // default bucket

        if (tattoo) {
          // Determine bucket based on category
          if (tattoo.category === "art") {
            bucketName = "art";
          } else if (tattoo.category === "designs") {
            bucketName = "designs";
          } else {
            bucketName = "tattoos"; // Fine line, Arabic design, Maori, etc.
          }
        } else if (featureImage) {
          // For feature images, use the same logic
          if (featureImage.category === "art") {
            bucketName = "art";
          } else if (featureImage.category === "designs") {
            bucketName = "designs";
          } else {
            bucketName = "tattoos";
          }
        }

        const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${path}`;
        publicUrls[path] = publicUrl;
      });
    }

    const response = NextResponse.json({
      tattoos: tattoos || [],
      publicUrls,
      featureImages,
    });

    // Add minimal caching to allow quick updates when tattoos change visibility
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
