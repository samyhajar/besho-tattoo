import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { useLocale } from "@/contexts/LocaleContext";
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
  maxSizeMB = 5,
}: ImageUploadFieldProps) {
  const { copy } = useLocale();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      onError(copy.booking.fileTooLarge(maxSizeMB));
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      onError(copy.booking.invalidImageFile);
      return;
    }

    onFileSelect(selectedFile);
  };

  const handleRemove = () => {
    onFileSelect(null);
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {label && (
        <Label htmlFor={id} className="text-sm sm:text-base font-medium">
          {label}
        </Label>
      )}

      {/* Upload Area */}
      <div className="relative">
        {preview ? (
          /* Preview State */
          <div className="relative group">
            <div className="relative w-full aspect-video max-w-sm mx-auto bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
              <Image
                src={preview}
                alt={copy.booking.previewAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
            </div>

            {/* Remove Button */}
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
              className="absolute top-2 right-2 w-8 h-8 p-0 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* File Info */}
            {_file && (
              <div className="mt-2 text-center">
                <p className="text-xs sm:text-sm text-gray-600 truncate max-w-xs mx-auto">
                  {_file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {((_file.size || 0) / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Upload State */
          <div className="relative">
            <input
              id={id}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={disabled}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            />
            <div className="w-full aspect-video max-w-sm mx-auto border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors duration-200 bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 cursor-pointer">
              <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mb-3 sm:mb-4" />
              <div className="text-center space-y-1 sm:space-y-2">
                <p className="text-sm sm:text-base font-medium text-gray-600">
                  {copy.booking.uploadImage}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {copy.booking.uploadFormats(maxSizeMB)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="text-xs sm:text-sm text-gray-500 space-y-1">
        <p>• {copy.booking.uploadHelpVision}</p>
        <p>• {copy.booking.uploadHelpReferences}</p>
        <p>• {copy.booking.uploadHelpSize(maxSizeMB)}</p>
      </div>
    </div>
  );
}
