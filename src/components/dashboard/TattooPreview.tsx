import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type {
  PortfolioMediaManagerState,
  VisiblePortfolioMediaItem,
} from "@/hooks/usePortfolioMediaManager";
import type { TattooFormData } from "@/types/tattoo";

interface TattooPreviewProps {
  formData: TattooFormData;
  mediaManager: PortfolioMediaManagerState;
}

function renderPreview(item: VisiblePortfolioMediaItem) {
  if (item.mediaType === "image" && item.previewUrl) {
    return (
      <div className="relative h-full w-full">
        <Image
          src={item.previewUrl}
          alt={item.name}
          fill
          unoptimized
          className="object-cover"
        />
      </div>
    );
  }

  if (item.previewUrl) {
    return (
      <video
        src={item.previewUrl}
        className="h-full w-full object-cover"
        controls
        muted
        playsInline
      />
    );
  }

  return (
    <div className="flex h-full items-center justify-center text-sm text-gray-500">
      Preview unavailable
    </div>
  );
}

export default function TattooPreview({
  formData,
  mediaManager,
}: TattooPreviewProps) {
  const previewItem = mediaManager.selectedPreviewItem;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>
          Click any image or video on the left to preview it here. The primary
          image still controls the gallery cover and first carousel slide.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {previewItem ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
                  Selected Preview
                </span>
                {previewItem.isPrimary ? (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    Primary Gallery Image
                  </span>
                ) : null}
              </div>
              <span className="text-xs text-gray-500">
                {mediaManager.visibleMedia.length} media item
                {mediaManager.visibleMedia.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
              {renderPreview(previewItem)}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {mediaManager.visibleMedia.slice(0, 8).map((item) => (
                <div
                  key={item.key}
                  className={`overflow-hidden rounded-lg border ${
                    item.isSelectedPreview
                      ? "border-gray-900 ring-2 ring-gray-900/10"
                      : item.isPrimary
                        ? "border-gray-900 ring-2 ring-gray-900/10"
                        : "border-gray-200"
                  }`}
                >
                  <div className="aspect-square bg-gray-100">
                    {renderPreview(item)}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Upload at least one image to see the gallery preview
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">
            {formData.title || "Untitled Tattoo"}
          </h3>
          {formData.category ? (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">
              {formData.category}
            </span>
          ) : null}
          {formData.description ? (
            <p className="text-sm text-gray-600 line-clamp-4">
              {formData.description}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
