import { Upload } from "lucide-react";
import Image from "next/image";
import BackgroundRemovalControls from "@/components/dashboard/BackgroundRemovalControls";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { MAX_PORTFOLIO_IMAGE_SIZE_MB } from "@/lib/portfolio-image";

interface TattooImageUploadProps {
  currentImageUrl?: string;
  imagePreview?: string | null;
  imageFile?: File | null;
  isLoading?: boolean;
  onImageChange: (file: File | null) => void;
  isProcessingImage?: boolean;
  processingError?: string | null;
  hasProcessedImage?: boolean;
  isUsingProcessed?: boolean;
  onRemoveBackground: () => void;
  onUseOriginalImage: () => void;
  onUseProcessedImage: () => void;
}

export default function TattooImageUpload({
  currentImageUrl,
  imagePreview,
  imageFile,
  isLoading = false,
  onImageChange,
  isProcessingImage = false,
  processingError = null,
  hasProcessedImage = false,
  isUsingProcessed = false,
  onRemoveBackground,
  onUseOriginalImage,
  onUseProcessedImage,
}: TattooImageUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const handleButtonClick = () => {
    const input = document.getElementById("image-upload") as HTMLInputElement;
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
              src={imagePreview || currentImageUrl || "/placeholder-image.svg"}
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
              PNG, JPG, WEBP, GIF up to {MAX_PORTFOLIO_IMAGE_SIZE_MB}MB
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
          <BackgroundRemovalControls
            disabled={isLoading}
            hasImage={!!imageFile}
            hasProcessedImage={hasProcessedImage}
            isProcessing={isProcessingImage}
            isUsingProcessed={isUsingProcessed}
            processingError={processingError}
            onProcess={onRemoveBackground}
            onUseOriginal={onUseOriginalImage}
            onUseProcessed={onUseProcessedImage}
          />
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
