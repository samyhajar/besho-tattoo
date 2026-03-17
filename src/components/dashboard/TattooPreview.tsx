import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type { TattooFormData } from "@/types/tattoo";

interface TattooPreviewProps {
  imagePreview: string | null;
  formData: TattooFormData;
  previewVariant?: "original" | "processed";
  isProcessing?: boolean;
}

export default function TattooPreview({
  imagePreview,
  formData,
  previewVariant = "original",
  isProcessing = false,
}: TattooPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>
          {isProcessing
            ? "Removing the background from the selected image..."
            : previewVariant === "processed"
              ? "Processed preview that will be uploaded if you keep it selected"
              : "Original preview of the selected upload"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {imagePreview ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                  previewVariant === "processed"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {previewVariant === "processed"
                  ? "Processed Preview"
                  : "Original Preview"}
              </span>
              {isProcessing ? (
                <span className="text-xs text-gray-500">Processing...</span>
              ) : null}
            </div>
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={imagePreview}
                alt="Preview"
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">
                {formData.title || "Untitled Tattoo"}
              </h3>
              {formData.category && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                  {formData.category}
                </span>
              )}
              {formData.description && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {formData.description}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-12 h-12 text-gray-400 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-gray-500">
                Upload an image to see preview
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
