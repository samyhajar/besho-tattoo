import { buildProcessedImageName } from "@/lib/portfolio-image";

type RemoveBackgroundErrorResponse = {
  error?: string;
};

export async function removeBackgroundPreview(file: File): Promise<File> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/admin/remove-background", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = "Failed to remove the background. Please try again.";

    try {
      const payload = (await response.json()) as RemoveBackgroundErrorResponse;
      if (payload.error) {
        errorMessage = payload.error;
      }
    } catch {
      // Ignore parse errors and fall back to the generic message.
    }

    throw new Error(errorMessage);
  }

  const blob = await response.blob();
  if (blob.size === 0) {
    throw new Error("Background removal returned an empty image.");
  }

  return new File([blob], buildProcessedImageName(file.name), {
    type: "image/png",
  });
}
