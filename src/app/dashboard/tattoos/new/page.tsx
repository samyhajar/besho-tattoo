"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import BackButton from "@/components/ui/BackButton";
import { uploadTattooImage, createTattoo } from "@/services/tattoos";
import type { TattooFormData } from "@/types/tattoo";
import TattooUploadForm from "@/components/dashboard/TattooUploadForm";
import TattooPreview from "@/components/dashboard/TattooPreview";

export default function NewTattooPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<TattooFormData>({
    title: "",
    description: "",
    category: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB.");
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
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
      // Upload image first
      const imageUrl = await uploadTattooImage(selectedFile);

      // Create tattoo record
      await createTattoo({
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        category: formData.category.trim() || null,
        image_url: imageUrl,
      });

      // Redirect to tattoos page
      router.push("/dashboard/tattoos");
    } catch (err) {
      console.error("Error creating tattoo:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create tattoo. Please try again.",
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
            Add New Tattoo
          </h1>
          <p className="text-gray-600 mt-2">
            Upload a new piece to your portfolio
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
          onFileChange={handleFileChange}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          selectedFile={selectedFile}
          error={error}
          isLoading={isLoading}
        />
        <TattooPreview imagePreview={imagePreview} formData={formData} />
      </div>
    </div>
  );
}
