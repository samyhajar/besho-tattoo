"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import BackButton from "@/components/ui/BackButton";
import { usePortfolioImageProcessing } from "@/hooks/usePortfolioImageProcessing";
import { uploadTattooImage, createTattoo } from "@/services/tattoos";
import type { TattooFormData } from "@/types/tattoo";
import TattooUploadForm from "@/components/dashboard/TattooUploadForm";
import TattooPreview from "@/components/dashboard/TattooPreview";

export default function NewArtPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imageProcessing = usePortfolioImageProcessing();

  const [formData, setFormData] = useState<TattooFormData>({
    title: "",
    description: "",
    category: "art", // Fixed to art category
    is_public: true, // Default to public
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      imageProcessing.setFile(e.target.files?.[0] || null);
      setError(null);
    } catch (fileError) {
      setError(
        fileError instanceof Error
          ? fileError.message
          : "Please select a valid image file.",
      );
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const inputValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: inputValue }));
  };

  const handleCategoryChange = () => {
    // Category is fixed to "art", but we keep this for the form component
    setFormData((prev) => ({ ...prev, category: "art" }));
  };

  const handleVisibilityChange = (isPublic: boolean) => {
    setFormData((prev) => ({ ...prev, is_public: isPublic }));
  };

  const handleSubmit = async () => {
    if (!imageProcessing.fileForUpload) {
      setError("Please select an image.");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a title.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Upload image first with art category
      const fileToUpload = imageProcessing.fileForUpload;
      if (!fileToUpload) {
        setError("Please select an image.");
        return;
      }

      const imageUrl = await uploadTattooImage(fileToUpload, "art");

      // Create art record
      await createTattoo({
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        category: "art", // Always art category
        image_url: imageUrl,
        is_public: formData.is_public,
      });

      // Redirect to art page
      router.push("/dashboard/art");
    } catch (err) {
      console.error("Error creating artwork:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create artwork. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Back Button - Mobile Only */}
      <BackButton />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Add New Artwork
          </h1>
          <p className="text-gray-600 mt-2">
            Upload a new art piece to your portfolio
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="w-fit sm:w-auto"
        >
          Cancel
        </Button>
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        <TattooUploadForm
          formData={formData}
          onInputChange={handleInputChange}
          onCategoryChange={handleCategoryChange}
          onVisibilityChange={handleVisibilityChange}
          onFileChange={handleFileChange}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          selectedFile={imageProcessing.originalFile}
          error={error}
          isLoading={isLoading}
          isProcessingImage={imageProcessing.isProcessing}
          processingError={imageProcessing.processingError}
          hasProcessedImage={imageProcessing.hasProcessedImage}
          isUsingProcessed={imageProcessing.isUsingProcessed}
          onRemoveBackground={() => {
            void imageProcessing.processImage().catch(() => undefined);
          }}
          onUseOriginalImage={imageProcessing.useOriginalImage}
          onUseProcessedImage={imageProcessing.useProcessedImage}
          fixedCategory="art" // Pass fixed category to form
        />
        <TattooPreview
          imagePreview={imageProcessing.previewUrl}
          formData={formData}
          previewVariant={
            imageProcessing.isUsingProcessed ? "processed" : "original"
          }
          isProcessing={imageProcessing.isProcessing}
        />
      </div>
    </div>
  );
}
