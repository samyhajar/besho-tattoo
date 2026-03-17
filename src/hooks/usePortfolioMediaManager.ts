"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  normalizePortfolioImageFile,
  rotatePortfolioImageFile,
} from "@/lib/client-portfolio-image";
import {
  buildProcessedImageName,
  getPortfolioMediaLabel,
  type PortfolioMediaType,
  validatePortfolioImageFile,
  validatePortfolioVideoFile,
} from "@/lib/portfolio-media";
import { removeBackgroundPreview } from "@/services/admin-image-processing";
import type {
  PendingPortfolioMediaUpload,
  PortfolioMedia,
  PortfolioMediaChangeSet,
  PrimaryMediaSelection,
} from "@/types/tattoo";

export interface PortfolioMediaDraft {
  clientId: string;
  mediaType: PortfolioMediaType;
  originalFile: File;
  currentFile: File;
  originalPreviewUrl: string;
  currentPreviewUrl: string;
  processedFile: File | null;
  processedPreviewUrl: string | null;
  isUsingProcessed: boolean;
  isProcessing: boolean;
  processingError: string | null;
  rotationDegrees: number;
  sortOrder: number;
}

export type VisiblePortfolioMediaItem =
  | {
      key: string;
      kind: "existing";
      media: PortfolioMedia;
      previewUrl: string | null;
      name: string;
      mediaType: PortfolioMediaType;
      sortOrder: number;
      isPrimary: boolean;
      isSelectedPreview: boolean;
      isProcessing: false;
      processingError: null;
      isUsingProcessed: false;
      rotationDegrees: 0;
      supportsBackgroundRemoval: false;
    }
  | {
      key: string;
      kind: "pending";
      media: PortfolioMediaDraft;
      previewUrl: string;
      name: string;
      mediaType: PortfolioMediaType;
      sortOrder: number;
      isPrimary: boolean;
      isSelectedPreview: boolean;
      isProcessing: boolean;
      processingError: string | null;
      isUsingProcessed: boolean;
      rotationDegrees: number;
      supportsBackgroundRemoval: boolean;
    };

function revokeDraftUrls(draft: PortfolioMediaDraft) {
  URL.revokeObjectURL(draft.originalPreviewUrl);

  if (
    draft.processedPreviewUrl &&
    draft.processedPreviewUrl !== draft.originalPreviewUrl
  ) {
    URL.revokeObjectURL(draft.processedPreviewUrl);
  }
}

function getFallbackPrimarySelection(params: {
  existingMedia: PortfolioMedia[];
  removedMediaIds: string[];
  pendingMedia: PortfolioMediaDraft[];
}) {
  const visibleExistingImages = params.existingMedia.filter(
    (media) =>
      media.media_type === "image" &&
      !params.removedMediaIds.includes(media.id),
  );
  const visiblePendingImages = params.pendingMedia.filter(
    (media) => media.mediaType === "image",
  );

  const existingPrimary =
    visibleExistingImages.find((media) => media.is_primary) ||
    visibleExistingImages[0];

  if (existingPrimary) {
    return {
      kind: "existing" as const,
      mediaId: existingPrimary.id,
    };
  }

  if (visiblePendingImages[0]) {
    return {
      kind: "pending" as const,
      clientId: visiblePendingImages[0].clientId,
    };
  }

  return null;
}

function matchesPrimarySelection(
  selection: PrimaryMediaSelection | null,
  item: { kind: "existing"; id: string } | { kind: "pending"; id: string },
) {
  if (!selection) {
    return false;
  }

  if (selection.kind !== item.kind) {
    return false;
  }

  return selection.kind === "existing"
    ? selection.mediaId === item.id
    : selection.clientId === item.id;
}

type PreviewSelection =
  | { kind: "existing"; mediaId: string }
  | { kind: "pending"; clientId: string };

function matchesPreviewSelection(
  selection: PreviewSelection | null,
  item: { kind: "existing"; id: string } | { kind: "pending"; id: string },
) {
  if (!selection) {
    return false;
  }

  if (selection.kind !== item.kind) {
    return false;
  }

  return selection.kind === "existing"
    ? selection.mediaId === item.id
    : selection.clientId === item.id;
}

export interface PortfolioMediaManagerState {
  existingMedia: PortfolioMedia[];
  pendingMedia: PortfolioMediaDraft[];
  visibleMedia: VisiblePortfolioMediaItem[];
  primaryItem: VisiblePortfolioMediaItem | null;
  selectedPreviewItem: VisiblePortfolioMediaItem | null;
  removedMediaIds: string[];
  hasImages: boolean;
  imageCount: number;
  addImages: (files: FileList | File[]) => Promise<void>;
  addVideos: (files: FileList | File[]) => Promise<void>;
  removeExistingMedia: (mediaId: string) => void;
  removePendingMedia: (clientId: string) => void;
  setPrimaryExistingMedia: (mediaId: string) => void;
  setPrimaryPendingMedia: (clientId: string) => void;
  selectExistingMediaPreview: (mediaId: string) => void;
  selectPendingMediaPreview: (clientId: string) => void;
  processPendingImage: (clientId: string) => Promise<void>;
  useOriginalPendingImage: (clientId: string) => void;
  useProcessedPendingImage: (clientId: string) => void;
  rotatePendingProcessedImage: (
    clientId: string,
    direction: "left" | "right",
  ) => Promise<void>;
  buildChangeSet: () => PortfolioMediaChangeSet;
}

export function usePortfolioMediaManager(
  initialExistingMedia: PortfolioMedia[] = [],
): PortfolioMediaManagerState {
  const existingMedia = initialExistingMedia;
  const [pendingMedia, setPendingMedia] = useState<PortfolioMediaDraft[]>([]);
  const [removedMediaIds, setRemovedMediaIds] = useState<string[]>([]);
  const [primarySelection, setPrimarySelection] =
    useState<PrimaryMediaSelection | null>(() =>
      getFallbackPrimarySelection({
        existingMedia: initialExistingMedia,
        removedMediaIds: [],
        pendingMedia: [],
      }),
    );
  const [previewSelection, setPreviewSelection] =
    useState<PreviewSelection | null>(() =>
      getFallbackPrimarySelection({
        existingMedia: initialExistingMedia,
        removedMediaIds: [],
        pendingMedia: [],
      }),
    );
  const pendingMediaRef = useRef<PortfolioMediaDraft[]>([]);

  useEffect(() => {
    pendingMediaRef.current = pendingMedia;
  }, [pendingMedia]);

  useEffect(() => {
    return () => {
      pendingMediaRef.current.forEach((draft) => {
        revokeDraftUrls(draft);
      });
    };
  }, []);

  const visibleMedia = useMemo(() => {
    const fallbackPrimary = getFallbackPrimarySelection({
      existingMedia,
      removedMediaIds,
      pendingMedia,
    });
    const effectivePrimary = primarySelection || fallbackPrimary;

    const existingItems: VisiblePortfolioMediaItem[] = existingMedia
      .filter((media) => !removedMediaIds.includes(media.id))
      .map((media) => ({
        key: `existing-${media.id}`,
        kind: "existing",
        media,
        previewUrl: media.display_url || null,
        name:
          media.storage_path.split("/").pop() ||
          `${getPortfolioMediaLabel(media.media_type)} ${media.id}`,
        mediaType: media.media_type,
        sortOrder: media.sort_order,
        isPrimary: matchesPrimarySelection(effectivePrimary, {
          kind: "existing",
          id: media.id,
        }),
        isSelectedPreview: false,
        isProcessing: false,
        processingError: null,
        isUsingProcessed: false,
        rotationDegrees: 0,
        supportsBackgroundRemoval: false,
      }));

    const pendingItems: VisiblePortfolioMediaItem[] = pendingMedia.map(
      (media) => ({
        key: `pending-${media.clientId}`,
        kind: "pending",
        media,
        previewUrl: media.currentPreviewUrl,
        name: media.currentFile.name,
        mediaType: media.mediaType,
        sortOrder: media.sortOrder,
        isPrimary: matchesPrimarySelection(effectivePrimary, {
          kind: "pending",
          id: media.clientId,
        }),
        isSelectedPreview: false,
        isProcessing: media.isProcessing,
        processingError: media.processingError,
        isUsingProcessed: media.isUsingProcessed,
        rotationDegrees: media.rotationDegrees,
        supportsBackgroundRemoval: media.mediaType === "image",
      }),
    );

    const sortedItems = [...existingItems, ...pendingItems].sort(
      (left, right) => {
        if (left.isPrimary && !right.isPrimary) {
          return -1;
        }

        if (!left.isPrimary && right.isPrimary) {
          return 1;
        }

        return left.sortOrder - right.sortOrder;
      },
    );

    const hasExplicitPreview = sortedItems.some((item) =>
      matchesPreviewSelection(previewSelection, {
        kind: item.kind,
        id: item.kind === "existing" ? item.media.id : item.media.clientId,
      }),
    );

    const fallbackPreview =
      effectivePrimary &&
      sortedItems.some((item) =>
        matchesPrimarySelection(effectivePrimary, {
          kind: item.kind,
          id: item.kind === "existing" ? item.media.id : item.media.clientId,
        }),
      )
        ? effectivePrimary.kind === "existing"
          ? ({
              kind: "existing",
              mediaId: effectivePrimary.mediaId,
            } satisfies PreviewSelection)
          : ({
              kind: "pending",
              clientId: effectivePrimary.clientId,
            } satisfies PreviewSelection)
        : sortedItems[0]
          ? sortedItems[0].kind === "existing"
            ? ({
                kind: "existing",
                mediaId: sortedItems[0].media.id,
              } satisfies PreviewSelection)
            : ({
                kind: "pending",
                clientId: sortedItems[0].media.clientId,
              } satisfies PreviewSelection)
          : null;

    const effectivePreview = hasExplicitPreview
      ? previewSelection
      : fallbackPreview;

    return sortedItems.map((item) => ({
      ...item,
      isSelectedPreview: matchesPreviewSelection(effectivePreview, {
        kind: item.kind,
        id: item.kind === "existing" ? item.media.id : item.media.clientId,
      }),
    }));
  }, [
    existingMedia,
    pendingMedia,
    previewSelection,
    primarySelection,
    removedMediaIds,
  ]);

  const primaryItem = useMemo(
    () =>
      visibleMedia.find((item) => item.isPrimary) ||
      visibleMedia.find((item) => item.mediaType === "image") ||
      visibleMedia[0] ||
      null,
    [visibleMedia],
  );

  const selectedPreviewItem = useMemo(
    () =>
      visibleMedia.find((item) => item.isSelectedPreview) ||
      primaryItem ||
      visibleMedia[0] ||
      null,
    [primaryItem, visibleMedia],
  );

  const imageCount = useMemo(
    () => visibleMedia.filter((item) => item.mediaType === "image").length,
    [visibleMedia],
  );

  const updateDraft = (
    clientId: string,
    updater: (draft: PortfolioMediaDraft) => PortfolioMediaDraft,
  ) => {
    setPendingMedia((currentDrafts) =>
      currentDrafts.map((draft) =>
        draft.clientId === clientId ? updater(draft) : draft,
      ),
    );
  };

  const addImages = async (files: FileList | File[]) => {
    const normalizedFiles = Array.from(files);
    if (normalizedFiles.length === 0) {
      return;
    }

    const preparedDrafts = await Promise.all(
      normalizedFiles.map(async (file, index) => {
        const validationError = validatePortfolioImageFile(file);
        if (validationError) {
          throw new Error(validationError);
        }

        const normalizedFile = await normalizePortfolioImageFile(file);
        const previewUrl = URL.createObjectURL(normalizedFile);

        return {
          clientId: crypto.randomUUID(),
          mediaType: "image" as const,
          originalFile: normalizedFile,
          currentFile: normalizedFile,
          originalPreviewUrl: previewUrl,
          currentPreviewUrl: previewUrl,
          processedFile: null,
          processedPreviewUrl: null,
          isUsingProcessed: false,
          isProcessing: false,
          processingError: null,
          rotationDegrees: 0,
          sortOrder: existingMedia.length + pendingMedia.length + index,
        };
      }),
    );

    setPendingMedia((currentDrafts) => [...currentDrafts, ...preparedDrafts]);
    setPrimarySelection((currentSelection) => {
      if (currentSelection) {
        return currentSelection;
      }

      return {
        kind: "pending",
        clientId: preparedDrafts[0].clientId,
      };
    });
    setPreviewSelection((currentSelection) => {
      if (currentSelection) {
        return currentSelection;
      }

      return {
        kind: "pending",
        clientId: preparedDrafts[0].clientId,
      };
    });
  };

  const addVideos = async (files: FileList | File[]) => {
    const incomingFiles = Array.from(files);
    if (incomingFiles.length === 0) {
      return;
    }

    const preparedDrafts = incomingFiles.map((file, index) => {
      const validationError = validatePortfolioVideoFile(file);
      if (validationError) {
        throw new Error(validationError);
      }

      const previewUrl = URL.createObjectURL(file);

      return {
        clientId: crypto.randomUUID(),
        mediaType: "video" as const,
        originalFile: file,
        currentFile: file,
        originalPreviewUrl: previewUrl,
        currentPreviewUrl: previewUrl,
        processedFile: null,
        processedPreviewUrl: null,
        isUsingProcessed: false,
        isProcessing: false,
        processingError: null,
        rotationDegrees: 0,
        sortOrder: existingMedia.length + pendingMedia.length + index,
      };
    });

    setPendingMedia((currentDrafts) => [...currentDrafts, ...preparedDrafts]);
    setPreviewSelection((currentSelection) => {
      if (currentSelection) {
        return currentSelection;
      }

      return {
        kind: "pending",
        clientId: preparedDrafts[0].clientId,
      };
    });
  };

  const removeExistingMedia = (mediaId: string) => {
    setRemovedMediaIds((currentIds) =>
      currentIds.includes(mediaId) ? currentIds : [...currentIds, mediaId],
    );
    setPrimarySelection((currentSelection) => {
      if (
        currentSelection?.kind === "existing" &&
        currentSelection.mediaId === mediaId
      ) {
        return null;
      }

      return currentSelection;
    });
    setPreviewSelection((currentSelection) => {
      if (
        currentSelection?.kind === "existing" &&
        currentSelection.mediaId === mediaId
      ) {
        return null;
      }

      return currentSelection;
    });
  };

  const removePendingMedia = (clientId: string) => {
    setPendingMedia((currentDrafts) => {
      const draftToRemove = currentDrafts.find(
        (draft) => draft.clientId === clientId,
      );
      if (draftToRemove) {
        revokeDraftUrls(draftToRemove);
      }

      return currentDrafts.filter((draft) => draft.clientId !== clientId);
    });
    setPrimarySelection((currentSelection) => {
      if (
        currentSelection?.kind === "pending" &&
        currentSelection.clientId === clientId
      ) {
        return null;
      }

      return currentSelection;
    });
    setPreviewSelection((currentSelection) => {
      if (
        currentSelection?.kind === "pending" &&
        currentSelection.clientId === clientId
      ) {
        return null;
      }

      return currentSelection;
    });
  };

  const setPrimaryExistingMedia = (mediaId: string) => {
    const existing = existingMedia.find((media) => media.id === mediaId);
    if (!existing || existing.media_type !== "image") {
      return;
    }

    setPrimarySelection({
      kind: "existing",
      mediaId,
    });
  };

  const setPrimaryPendingMedia = (clientId: string) => {
    const draft = pendingMedia.find((media) => media.clientId === clientId);
    if (!draft || draft.mediaType !== "image") {
      return;
    }

    setPrimarySelection({
      kind: "pending",
      clientId,
    });
  };

  const selectExistingMediaPreview = (mediaId: string) => {
    const existing = existingMedia.find((media) => media.id === mediaId);
    if (!existing || removedMediaIds.includes(mediaId)) {
      return;
    }

    setPreviewSelection({
      kind: "existing",
      mediaId,
    });
  };

  const selectPendingMediaPreview = (clientId: string) => {
    const draft = pendingMedia.find((media) => media.clientId === clientId);
    if (!draft) {
      return;
    }

    setPreviewSelection({
      kind: "pending",
      clientId,
    });
  };

  const processPendingImage = async (clientId: string) => {
    const targetDraft = pendingMedia.find(
      (draft) => draft.clientId === clientId,
    );
    if (!targetDraft || targetDraft.mediaType !== "image") {
      throw new Error("Please select an image first.");
    }

    updateDraft(clientId, (draft) => ({
      ...draft,
      isProcessing: true,
      processingError: null,
    }));

    try {
      const processedFile = await removeBackgroundPreview(
        targetDraft.originalFile,
      );
      const processedPreviewUrl = URL.createObjectURL(processedFile);

      updateDraft(clientId, (draft) => {
        if (
          draft.processedPreviewUrl &&
          draft.processedPreviewUrl !== draft.originalPreviewUrl
        ) {
          URL.revokeObjectURL(draft.processedPreviewUrl);
        }

        return {
          ...draft,
          processedFile,
          processedPreviewUrl,
          currentFile: processedFile,
          currentPreviewUrl: processedPreviewUrl,
          isUsingProcessed: true,
          isProcessing: false,
          processingError: null,
          rotationDegrees: 0,
        };
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to remove the background. Please try again.";

      updateDraft(clientId, (draft) => ({
        ...draft,
        isProcessing: false,
        processingError: message,
      }));

      throw new Error(message);
    }
  };

  const useOriginalPendingImage = (clientId: string) => {
    updateDraft(clientId, (draft) => ({
      ...draft,
      currentFile: draft.originalFile,
      currentPreviewUrl: draft.originalPreviewUrl,
      isUsingProcessed: false,
    }));
  };

  const useProcessedPendingImage = (clientId: string) => {
    updateDraft(clientId, (draft) => {
      if (!draft.processedFile || !draft.processedPreviewUrl) {
        return draft;
      }

      return {
        ...draft,
        currentFile: draft.processedFile,
        currentPreviewUrl: draft.processedPreviewUrl,
        isUsingProcessed: true,
      };
    });
  };

  const rotatePendingProcessedImage = async (
    clientId: string,
    direction: "left" | "right",
  ) => {
    const targetDraft = pendingMedia.find(
      (draft) => draft.clientId === clientId,
    );
    if (!targetDraft?.processedFile) {
      throw new Error("Remove the background before rotating the image.");
    }

    updateDraft(clientId, (draft) => ({
      ...draft,
      isProcessing: true,
      processingError: null,
    }));

    try {
      const rotationDelta = direction === "left" ? -90 : 90;
      const rotatedFile = await rotatePortfolioImageFile({
        file: targetDraft.processedFile,
        degrees: rotationDelta,
        outputName: buildProcessedImageName(targetDraft.originalFile.name),
      });
      const rotatedPreviewUrl = URL.createObjectURL(rotatedFile);

      updateDraft(clientId, (draft) => {
        if (
          draft.processedPreviewUrl &&
          draft.processedPreviewUrl !== draft.originalPreviewUrl
        ) {
          URL.revokeObjectURL(draft.processedPreviewUrl);
        }

        return {
          ...draft,
          processedFile: rotatedFile,
          processedPreviewUrl: rotatedPreviewUrl,
          currentFile: rotatedFile,
          currentPreviewUrl: rotatedPreviewUrl,
          isUsingProcessed: true,
          isProcessing: false,
          processingError: null,
          rotationDegrees: (draft.rotationDegrees + rotationDelta + 360) % 360,
        };
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to rotate the processed image.";
      updateDraft(clientId, (draft) => ({
        ...draft,
        isProcessing: false,
        processingError: message,
      }));
      throw new Error(message);
    }
  };

  const buildChangeSet = (): PortfolioMediaChangeSet => {
    const fallbackPrimary = getFallbackPrimarySelection({
      existingMedia,
      removedMediaIds,
      pendingMedia,
    });

    const effectivePrimary = primarySelection || fallbackPrimary;

    const pendingUploads: PendingPortfolioMediaUpload[] = pendingMedia.map(
      (media, index) => ({
        clientId: media.clientId,
        file: media.currentFile,
        mediaType: media.mediaType,
        sortOrder: index,
      }),
    );

    return {
      pendingMedia: pendingUploads,
      removedMediaIds,
      primarySelection: effectivePrimary,
    };
  };

  return {
    existingMedia,
    pendingMedia,
    visibleMedia,
    primaryItem,
    selectedPreviewItem,
    removedMediaIds,
    hasImages: imageCount > 0,
    imageCount,
    addImages,
    addVideos,
    removeExistingMedia,
    removePendingMedia,
    setPrimaryExistingMedia,
    setPrimaryPendingMedia,
    selectExistingMediaPreview,
    selectPendingMediaPreview,
    processPendingImage,
    useOriginalPendingImage,
    useProcessedPendingImage,
    rotatePendingProcessedImage,
    buildChangeSet,
  };
}
