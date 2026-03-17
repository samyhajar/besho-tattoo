"use client";

import { useEffect, useMemo, useState } from "react";
import { validatePortfolioImageFile } from "@/lib/portfolio-image";
import { removeBackgroundPreview } from "@/services/admin-image-processing";

function toFileError(message: string): Error {
  return new Error(message);
}

export function usePortfolioImageProcessing() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [processedFile, setProcessedFile] = useState<File | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(
    null,
  );
  const [processedPreviewUrl, setProcessedPreviewUrl] = useState<string | null>(
    null,
  );
  const [isUsingProcessed, setIsUsingProcessed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);

  useEffect(() => {
    if (!originalFile) {
      setOriginalPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(originalFile);
    setOriginalPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [originalFile]);

  useEffect(() => {
    if (!processedFile) {
      setProcessedPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(processedFile);
    setProcessedPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [processedFile]);

  const resetProcessedState = () => {
    setProcessedFile(null);
    setIsUsingProcessed(false);
    setProcessingError(null);
  };

  const setFile = (file: File | null) => {
    if (!file) {
      setOriginalFile(null);
      resetProcessedState();
      return;
    }

    const validationError = validatePortfolioImageFile(file);
    if (validationError) {
      throw toFileError(validationError);
    }

    setOriginalFile(file);
    resetProcessedState();
  };

  const processImage = async () => {
    if (!originalFile) {
      throw toFileError("Please select an image first.");
    }

    setIsProcessing(true);
    setProcessingError(null);

    try {
      const processed = await removeBackgroundPreview(originalFile);
      setProcessedFile(processed);
      setIsUsingProcessed(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to remove the background. Please try again.";
      setProcessingError(message);
      throw toFileError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const fileForUpload = useMemo(() => {
    if (isUsingProcessed && processedFile) {
      return processedFile;
    }

    return originalFile;
  }, [isUsingProcessed, originalFile, processedFile]);

  const previewUrl = useMemo(() => {
    if (isUsingProcessed && processedPreviewUrl) {
      return processedPreviewUrl;
    }

    return originalPreviewUrl;
  }, [isUsingProcessed, originalPreviewUrl, processedPreviewUrl]);

  return {
    originalFile,
    processedFile,
    previewUrl,
    fileForUpload,
    isUsingProcessed,
    isProcessing,
    processingError,
    hasProcessedImage: !!processedFile,
    setFile,
    processImage,
    useOriginalImage: () => setIsUsingProcessed(false),
    useProcessedImage: () => {
      if (processedFile) {
        setIsUsingProcessed(true);
      }
    },
    clearProcessingError: () => setProcessingError(null),
  };
}
