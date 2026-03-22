"use client";

import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, RefreshCcw, Upload } from "lucide-react";
import { SiteContentFormData } from "@/types/site-content";
import { SiteContentSection } from "./SiteContentSection";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { createClient } from "@/lib/supabase/browser-client";
import {
  CONTACT_PAGE_IMAGE_FOLDER,
  DEFAULT_CONTACT_PAGE_IMAGE,
  PAGES_BUCKET,
  PAGE_IMAGE_ALLOWED_MIME_TYPES,
  PAGE_IMAGE_MAX_SIZE_MB,
} from "@/lib/page-assets";

interface SiteContentSectionsProps {
  formData: SiteContentFormData;
  onInputChange: (
    section: keyof SiteContentFormData,
    field: string,
    value: string,
  ) => void;
}

function sanitizeFileName(fileName: string) {
  return fileName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-");
}

export function ContactSection({
  formData,
  onInputChange,
}: SiteContentSectionsProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentImage =
    formData.contact.image_url.trim() || DEFAULT_CONTACT_PAGE_IMAGE;
  const hasCustomImage =
    formData.contact.image_url.trim() !== "" &&
    formData.contact.image_url.trim() !== DEFAULT_CONTACT_PAGE_IMAGE;

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (
      !PAGE_IMAGE_ALLOWED_MIME_TYPES.includes(
        file.type as (typeof PAGE_IMAGE_ALLOWED_MIME_TYPES)[number],
      )
    ) {
      setError("Please upload a JPG, PNG, GIF, or WebP image.");
      return;
    }

    if (file.size > PAGE_IMAGE_MAX_SIZE_MB * 1024 * 1024) {
      setError(
        `Please upload an image smaller than ${PAGE_IMAGE_MAX_SIZE_MB}MB.`,
      );
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const supabase = createClient();
      const filePath = `${CONTACT_PAGE_IMAGE_FOLDER}/${Date.now()}-${sanitizeFileName(file.name)}`;
      const { error: uploadError } = await supabase.storage
        .from(PAGES_BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(PAGES_BUCKET).getPublicUrl(filePath);

      onInputChange("contact", "image_url", publicUrl);
    } catch (uploadError) {
      console.error("Failed to upload contact page image:", uploadError);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload the contact page image.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleResetToDefault = () => {
    onInputChange("contact", "image_url", DEFAULT_CONTACT_PAGE_IMAGE);
    setError(null);
  };

  return (
    <SiteContentSection
      title="Contact Page"
      description="Contact details and the featured image displayed on the contact page."
      fields={[
        {
          id: "contact-title",
          label: "Page Title",
          value: formData.contact.title,
          onChange: (value) => onInputChange("contact", "title", value),
          placeholder: "Enter the contact page title",
          type: "input",
        },
        {
          id: "contact-description",
          label: "Page Description",
          value: formData.contact.description,
          onChange: (value) => onInputChange("contact", "description", value),
          placeholder:
            "Enter the intro text shown at the top of the contact page",
          type: "textarea",
        },
        {
          id: "contact-address",
          label: "Studio Address",
          value: formData.contact.address,
          onChange: (value) => onInputChange("contact", "address", value),
          placeholder: "Enter studio address",
          type: "textarea",
        },
        {
          id: "contact-phone",
          label: "Phone Number",
          value: formData.contact.phone,
          onChange: (value) => onInputChange("contact", "phone", value),
          placeholder: "Enter phone number",
          type: "input",
        },
        {
          id: "contact-email",
          label: "Email Address",
          value: formData.contact.email,
          onChange: (value) => onInputChange("contact", "email", value),
          placeholder: "Enter email address",
          type: "input",
        },
        {
          id: "contact-hours",
          label: "Studio Hours",
          value: formData.contact.hours,
          onChange: (value) => onInputChange("contact", "hours", value),
          placeholder: "Enter studio hours",
          type: "textarea",
        },
        {
          id: "contact-social-media",
          label: "Social Media",
          value: formData.contact.social_media,
          onChange: (value) => onInputChange("contact", "social_media", value),
          placeholder: "Enter social media handle or link",
          type: "input",
        },
      ]}
      gridCols={1}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contact-page-image" className="text-gray-900">
            Contact Page Image
          </Label>
          <p className="text-sm text-gray-600">
            Upload the image shown on the public contact page. Files are stored
            in the Supabase{" "}
            <span className="font-medium text-gray-900">pages</span> bucket.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-start">
          <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            <Image
              src={currentImage}
              alt="Contact page preview"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 320px"
            />
          </div>

          <div className="space-y-4">
            <input
              ref={inputRef}
              id="contact-page-image"
              type="file"
              accept={PAGE_IMAGE_ALLOWED_MIME_TYPES.join(",")}
              onChange={(event) => void handleFileChange(event)}
              className="hidden"
            />

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading image...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Image
                  </>
                )}
              </Button>

              {hasCustomImage ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResetToDefault}
                  disabled={uploading}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Use Default Image
                </Button>
              ) : null}
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>
                Recommended portrait crop, up to {PAGE_IMAGE_MAX_SIZE_MB}MB.
              </p>
              <p>
                The upload sets the image URL in the form. Use Save Changes
                below to publish it on the site.
              </p>
            </div>

            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
          </div>
        </div>
      </div>
    </SiteContentSection>
  );
}
