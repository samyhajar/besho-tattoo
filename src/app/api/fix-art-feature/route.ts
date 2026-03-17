import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  try {
    const supabase = createAdminClient();

    // Find the art item
    const { data: artItem, error: findError } = await supabase
      .from("tattoos")
      .select("*")
      .eq("category", "art")
      .eq("is_public", true)
      .single();

    if (findError) {
      console.error("Error finding art item:", findError);
      return NextResponse.json(
        { error: "Art item not found" },
        { status: 404 },
      );
    }

    if (!artItem) {
      return NextResponse.json({ error: "No art item found" }, { status: 404 });
    }

    // Set it as feature image
    const { error: updateError } = await supabase
      .from("tattoos")
      .update({ is_feature_image: true })
      .eq("id", artItem.id);

    if (updateError) {
      console.error("Error updating art item:", updateError);
      return NextResponse.json(
        { error: "Failed to update art item" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Art item set as feature image",
      item: artItem,
    });
  } catch (error) {
    console.error("Error in fix-art-feature:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
