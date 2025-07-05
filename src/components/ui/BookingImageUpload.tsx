import { useState } from "react";
import ImageUploadField from "./ImageUploadField";

interface BookingImageUploadProps {
  onFileSelect: (file: File | null) => void;
  onError: (error: string | null) => void;
  disabled: boolean;
}

export default function BookingImageUpload({
  onFileSelect,
  onError,
  disabled,
}: BookingImageUploadProps) {
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageSelect = (file: File | null) => {
    setReferenceImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
    onError(null);
    onFileSelect(file);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base sm:text-lg font-medium text-gray-900 pb-2 border-b border-gray-200">
        Reference Image (Optional)
      </h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-xs sm:text-sm text-gray-600 mb-4">
          Upload a reference image to help us understand your tattoo vision
          better.
        </p>
        <ImageUploadField
          label=""
          id="reference-image"
          _file={referenceImage}
          preview={imagePreview}
          onFileSelect={handleImageSelect}
          onError={onError}
          disabled={disabled}
          maxSizeMB={10}
        />
      </div>
    </div>
  );
}
