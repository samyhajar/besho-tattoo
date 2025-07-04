import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadFieldProps {
  label: string;
  id: string;
  _file: File | null;
  preview: string | null;
  onFileSelect: (file: File | null) => void;
  onError: (error: string) => void;
  disabled?: boolean;
  maxSizeMB?: number;
}

export default function ImageUploadField({
  label,
  id,
  _file,
  preview,
  onFileSelect,
  onError,
  disabled = false,
  maxSizeMB = 10,
}: ImageUploadFieldProps) {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      onError(`Image size must be less than ${maxSizeMB}MB`);
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      onError("Please select a valid image file");
      return;
    }

    onFileSelect(selectedFile);
  };

  const removeImage = () => {
    onFileSelect(null);
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-2">
        <input
          id={id}
          type="file"
          accept="image/*"
          onChange={(e) => void handleImageUpload(e)}
          className="hidden"
          disabled={disabled}
        />

        {preview ? (
          <div className="relative">
            <div className="w-full max-w-sm">
              <Image
                src={preview}
                alt="Reference"
                width={400}
                height={192}
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white"
              disabled={disabled}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => document.getElementById(id)?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">
              Click to upload a reference image
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG up to {maxSizeMB}MB
            </p>
          </button>
        )}
      </div>
    </div>
  );
}
