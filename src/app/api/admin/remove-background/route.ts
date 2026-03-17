import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  MAX_PORTFOLIO_IMAGE_SIZE_BYTES,
  validatePortfolioImageFile,
} from "@/lib/portfolio-image";
import { removeImageBackground, RembgError } from "@/lib/rembg";
import { createClient } from "@/lib/supabase/server-client";

export const runtime = "nodejs";

async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const adminClient = createAdminClient();
  const { data: profile, error: profileError } = await adminClient
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile?.is_admin) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { error: null };
}

export async function POST(request: Request) {
  try {
    const { error: authError } = await requireAdminUser();
    if (authError) {
      return authError;
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "Please upload a single image file." },
        { status: 400 },
      );
    }

    const validationError = validatePortfolioImageFile(image);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    if (image.size > MAX_PORTFOLIO_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File size exceeds the maximum allowed size of 50MB." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const processedImage = await removeImageBackground({
      buffer,
      contentType: image.type,
      filename: image.name || "portfolio-image.png",
    });

    return new NextResponse(processedImage, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof RembgError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    console.error("Background removal route error:", error);
    return NextResponse.json(
      { error: "Failed to remove the background. Please try again." },
      { status: 500 },
    );
  }
}
