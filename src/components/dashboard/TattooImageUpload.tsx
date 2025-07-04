import { Upload } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

interface TattooImageUploadProps {
  currentImageUrl?: string;
  imagePreview?: string | null;
  imageFile?: File | null;
  isLoading?: boolean;
  onImageChange: (file: File | null) => void;
}

export default function TattooImageUpload({
  currentImageUrl,
  imagePreview,
  imageFile,
  isLoading = false,
  onImageChange,
}: TattooImageUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const handleButtonClick = () => {
    const input = document.getElementById('image-upload') as HTMLInputElement;
    input?.click();
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="image-upload">Tattoo Image</Label>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Current/Preview Image */}
        <div className="flex-1">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
            <Image
              src={imagePreview || currentImageUrl || '/placeholder-image.svg'}
              alt="Tattoo preview"
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-gray-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Click to upload a new image
            </p>
            <p className="text-xs text-gray-500 mb-4">
              PNG, JPG, GIF up to 10MB
            </p>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isLoading}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleButtonClick}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Choose File
            </Button>
          </div>
          {imageFile && (
            <p className="text-sm text-green-600 text-center">
              New image selected: {imageFile.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}