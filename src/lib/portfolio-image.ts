export const MAX_PORTFOLIO_IMAGE_SIZE_MB = 50;
export const MAX_PORTFOLIO_IMAGE_SIZE_BYTES =
  MAX_PORTFOLIO_IMAGE_SIZE_MB * 1024 * 1024;

export function validatePortfolioImageFile(
  file: Pick<File, "size" | "type">,
): string | null {
  if (!file.type.startsWith("image/")) {
    return "Please select a valid image file.";
  }

  if (file.size === 0) {
    return "The selected image is empty.";
  }

  if (file.size > MAX_PORTFOLIO_IMAGE_SIZE_BYTES) {
    return `File size must be less than ${MAX_PORTFOLIO_IMAGE_SIZE_MB}MB.`;
  }

  return null;
}

export function buildProcessedImageName(originalName: string): string {
  const sanitizedName = originalName.trim() || "portfolio-image";
  const baseName = sanitizedName.replace(/\.[^/.]+$/, "");
  return `${baseName}-bg-removed.png`;
}
