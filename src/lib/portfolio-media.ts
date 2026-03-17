export const MAX_PORTFOLIO_IMAGE_SIZE_MB = 50;
export const MAX_PORTFOLIO_IMAGE_SIZE_BYTES =
  MAX_PORTFOLIO_IMAGE_SIZE_MB * 1024 * 1024;

export const MAX_PORTFOLIO_VIDEO_SIZE_MB = 100;
export const MAX_PORTFOLIO_VIDEO_SIZE_BYTES =
  MAX_PORTFOLIO_VIDEO_SIZE_MB * 1024 * 1024;

export const PORTFOLIO_VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;

export type PortfolioSection = "tattoos" | "art" | "designs";
export type PortfolioMediaType = "image" | "video";

export function getPortfolioSection(
  category: string | null | undefined,
): PortfolioSection {
  const normalizedCategory = category?.trim().toLowerCase();

  if (normalizedCategory === "art") {
    return "art";
  }

  if (normalizedCategory === "designs") {
    return "designs";
  }

  return "tattoos";
}

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
    return `Image size must be less than ${MAX_PORTFOLIO_IMAGE_SIZE_MB}MB.`;
  }

  return null;
}

export function validatePortfolioVideoFile(
  file: Pick<File, "size" | "type">,
): string | null {
  if (!PORTFOLIO_VIDEO_MIME_TYPES.includes(file.type as never)) {
    return "Please select an MP4, MOV, or WEBM video.";
  }

  if (file.size === 0) {
    return "The selected video is empty.";
  }

  if (file.size > MAX_PORTFOLIO_VIDEO_SIZE_BYTES) {
    return `Video size must be less than ${MAX_PORTFOLIO_VIDEO_SIZE_MB}MB.`;
  }

  return null;
}

export function buildProcessedImageName(originalName: string): string {
  const sanitizedName = originalName.trim() || "portfolio-image";
  const baseName = sanitizedName.replace(/\.[^/.]+$/, "");
  return `${baseName}-bg-removed.png`;
}

export function buildPortfolioMediaPath(params: {
  tattooId: string;
  mediaId: string;
  fileName: string;
}) {
  const extension = params.fileName.split(".").pop()?.toLowerCase() || "bin";
  return `${params.tattooId}/${params.mediaId}.${extension}`;
}

export function getPortfolioMediaLabel(mediaType: PortfolioMediaType): string {
  return mediaType === "image" ? "Image" : "Video";
}
