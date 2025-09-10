import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    // Unset the feature image flag for the problematic image
    const { error: updateError } = await supabase
      .from("tattoos")
      .update({ is_feature_image: false })
      .eq("image_url", "1757495705968-b3utsqna6a.webp");

    if (updateError) {
      console.error("Error updating feature image flag:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Feature image flag has been unset for the problematic image",
    });
  } catch (error) {
    console.error("Error in fix-feature-image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
