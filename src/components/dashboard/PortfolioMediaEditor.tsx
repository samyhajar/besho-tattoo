"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  RotateCcw,
  RotateCw,
  Video,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import {
  MAX_PORTFOLIO_IMAGE_SIZE_MB,
  MAX_PORTFOLIO_VIDEO_SIZE_MB,
} from "@/lib/portfolio-media";
import type {
  PortfolioMediaManagerState,
  VisiblePortfolioMediaItem,
} from "@/hooks/usePortfolioMediaManager";

interface PortfolioMediaEditorProps {
  mediaManager: PortfolioMediaManagerState;
  disabled?: boolean;
  onError?: (message: string | null) => void;
}

function MediaTile(props: {
  item: VisiblePortfolioMediaItem;
  disabled: boolean;
  onSelectPreview: () => void;
  onSetPrimary: () => void;
  onRemove: () => void;
  onProcess?: () => void;
  onUseProcessed?: () => void;
  onUseOriginal?: () => void;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
}) {
  const { item, disabled } = props;

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white shadow-sm ${
        item.isSelectedPreview
          ? "border-gray-900 ring-2 ring-gray-900/10"
          : "border-gray-200"
      }`}
    >
      <button
        type="button"
        className="block aspect-square w-full bg-gray-100 text-left"
        onClick={props.onSelectPreview}
        disabled={disabled}
      >
        {item.mediaType === "image" && item.previewUrl ? (
          <div className="relative h-full w-full">
            <Image
              src={item.previewUrl}
              alt={item.name}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        ) : item.previewUrl ? (
          <video
            src={item.previewUrl}
            className="h-full w-full object-cover"
            controls
            muted
            playsInline
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            {item.mediaType === "image" ? (
              <ImageIcon className="h-10 w-10" />
            ) : (
              <Video className="h-10 w-10" />
            )}
          </div>
        )}
      </button>

      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {item.isSelectedPreview ? (
            <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
              Previewing
            </span>
          ) : null}
          {item.isPrimary ? (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              Primary
            </span>
          ) : null}
          {item.kind === "pending" ? (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              New Upload
            </span>
          ) : null}
          {item.kind === "pending" && item.isUsingProcessed ? (
            <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
              Processed
            </span>
          ) : null}
        </div>

        <div>
          <p className="truncate text-sm font-medium text-gray-900">
            {item.name}
          </p>
          <p className="text-xs text-gray-500">
            {item.mediaType === "image" ? "Image" : "Video"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {item.mediaType === "image" && !item.isPrimary ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={props.onSetPrimary}
              disabled={disabled}
            >
              Set as Primary
            </Button>
          ) : null}

          {item.kind === "pending" && item.supportsBackgroundRemoval ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={props.onProcess}
              disabled={disabled || item.isProcessing}
            >
              {item.isProcessing ? "Processing..." : "Remove Background"}
            </Button>
          ) : null}

          {item.kind === "pending" &&
          item.mediaType === "image" &&
          item.media.processedFile ? (
            <>
              <Button
                type="button"
                size="sm"
                variant={item.isUsingProcessed ? "secondary" : "outline"}
                onClick={props.onUseProcessed}
                disabled={
                  disabled || item.isProcessing || item.isUsingProcessed
                }
              >
                Use Processed
              </Button>
              <Button
                type="button"
                size="sm"
                variant={!item.isUsingProcessed ? "secondary" : "outline"}
                onClick={props.onUseOriginal}
                disabled={
                  disabled || item.isProcessing || !item.isUsingProcessed
                }
              >
                Use Original
              </Button>
            </>
          ) : null}

          {item.kind === "pending" &&
          item.mediaType === "image" &&
          item.media.processedFile ? (
            <>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={props.onRotateLeft}
                disabled={disabled || item.isProcessing}
              >
                <RotateCcw className="mr-1 h-3.5 w-3.5" />
                Rotate Left
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={props.onRotateRight}
                disabled={disabled || item.isProcessing}
              >
                <RotateCw className="mr-1 h-3.5 w-3.5" />
                Rotate Right
              </Button>
            </>
          ) : null}

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={props.onRemove}
            disabled={disabled}
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Remove
          </Button>
        </div>

        {item.kind === "pending" && item.processingError ? (
          <p className="text-sm text-red-600">{item.processingError}</p>
        ) : null}

        {item.kind === "pending" &&
        item.mediaType === "image" &&
        item.media.processedFile ? (
          <p className="text-xs text-gray-500">
            Rotation saves into the processed upload file that will be sent when
            you keep the processed version selected.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function PortfolioMediaEditor({
  mediaManager,
  disabled = false,
  onError,
}: PortfolioMediaEditorProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const imageItems = mediaManager.visibleMedia.filter(
    (item) => item.mediaType === "image",
  );
  const videoItems = mediaManager.visibleMedia.filter(
    (item) => item.mediaType === "video",
  );

  const handleAsyncAction = async (action: () => Promise<void>) => {
    try {
      onError?.(null);
      await action();
    } catch (error) {
      onError?.(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Label>Images</Label>
            <p className="text-xs text-gray-500">
              Upload one or more images. Only images can be used as the gallery
              cover.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => imageInputRef.current?.click()}
            disabled={disabled}
          >
            Add Images
          </Button>
        </div>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            const files = event.target.files;
            if (!files?.length) {
              return;
            }

            void handleAsyncAction(async () => {
              await mediaManager.addImages(files);
            });
            event.target.value = "";
          }}
        />
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-xs text-gray-500">
          PNG, JPG, WEBP, GIF up to {MAX_PORTFOLIO_IMAGE_SIZE_MB}MB each.
          Background removal and rotation are available only for images.
        </div>
        {imageItems.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {imageItems.map((item) => (
              <MediaTile
                key={item.key}
                item={item}
                disabled={disabled}
                onSelectPreview={() => {
                  if (item.kind === "existing") {
                    mediaManager.selectExistingMediaPreview(item.media.id);
                    return;
                  }

                  mediaManager.selectPendingMediaPreview(item.media.clientId);
                }}
                onSetPrimary={() => {
                  if (item.kind === "existing") {
                    mediaManager.setPrimaryExistingMedia(item.media.id);
                    return;
                  }

                  mediaManager.setPrimaryPendingMedia(item.media.clientId);
                }}
                onRemove={() => {
                  if (item.kind === "existing") {
                    mediaManager.removeExistingMedia(item.media.id);
                    return;
                  }

                  mediaManager.removePendingMedia(item.media.clientId);
                }}
                onProcess={
                  item.kind === "pending"
                    ? () =>
                        void handleAsyncAction(async () => {
                          await mediaManager.processPendingImage(
                            item.media.clientId,
                          );
                        })
                    : undefined
                }
                onUseProcessed={
                  item.kind === "pending"
                    ? () =>
                        mediaManager.useProcessedPendingImage(
                          item.media.clientId,
                        )
                    : undefined
                }
                onUseOriginal={
                  item.kind === "pending"
                    ? () =>
                        mediaManager.useOriginalPendingImage(
                          item.media.clientId,
                        )
                    : undefined
                }
                onRotateLeft={
                  item.kind === "pending"
                    ? () =>
                        void handleAsyncAction(async () => {
                          await mediaManager.rotatePendingProcessedImage(
                            item.media.clientId,
                            "left",
                          );
                        })
                    : undefined
                }
                onRotateRight={
                  item.kind === "pending"
                    ? () =>
                        void handleAsyncAction(async () => {
                          await mediaManager.rotatePendingProcessedImage(
                            item.media.clientId,
                            "right",
                          );
                        })
                    : undefined
                }
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
            No images added yet.
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Label>Videos</Label>
            <p className="text-xs text-gray-500">
              Videos appear in the modal carousel but cannot be used as the
              primary gallery image.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => videoInputRef.current?.click()}
            disabled={disabled}
          >
            Add Videos
          </Button>
        </div>
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          multiple
          className="hidden"
          onChange={(event) => {
            const files = event.target.files;
            if (!files?.length) {
              return;
            }

            void handleAsyncAction(async () => {
              await mediaManager.addVideos(files);
            });
            event.target.value = "";
          }}
        />
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-xs text-gray-500">
          MP4, MOV, WEBM up to {MAX_PORTFOLIO_VIDEO_SIZE_MB}MB each. Background
          removal is disabled for videos.
        </div>
        {videoItems.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {videoItems.map((item) => (
              <MediaTile
                key={item.key}
                item={item}
                disabled={disabled}
                onSelectPreview={() => {
                  if (item.kind === "existing") {
                    mediaManager.selectExistingMediaPreview(item.media.id);
                    return;
                  }

                  mediaManager.selectPendingMediaPreview(item.media.clientId);
                }}
                onSetPrimary={() => undefined}
                onRemove={() => {
                  if (item.kind === "existing") {
                    mediaManager.removeExistingMedia(item.media.id);
                    return;
                  }

                  mediaManager.removePendingMedia(item.media.clientId);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
            No videos added yet.
          </div>
        )}
      </div>
    </div>
  );
}
