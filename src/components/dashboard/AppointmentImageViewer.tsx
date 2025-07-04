import { useState, useEffect, useCallback } from "react";
import { Upload } from "lucide-react";
import Image from "next/image";
import { getAppointmentImageSignedUrl } from "@/services/appointments";

interface AppointmentImageViewerProps {
  imageUrl: string | null;
  isOpen: boolean;
}

export default function AppointmentImageViewer({
  imageUrl,
  isOpen,
}: AppointmentImageViewerProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  const loadImage = useCallback(async () => {
    if (!imageUrl) return;

    try {
      setLoadingImage(true);
      const url = await getAppointmentImageSignedUrl(imageUrl);
      setSignedUrl(url);
    } catch (err) {
      console.error("Error loading image:", err);
      setSignedUrl(null);
    } finally {
      setLoadingImage(false);
    }
  }, [imageUrl]);

  useEffect(() => {
    if (imageUrl && isOpen) {
      void loadImage();
    } else {
      setSignedUrl(null);
    }
  }, [imageUrl, isOpen, loadImage]);

  if (!imageUrl) {
    return (
      <div className="w-full h-80 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <Upload className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No reference image uploaded</p>
        </div>
      </div>
    );
  }

  if (loadingImage) {
    return (
      <div className="w-full h-80 border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading image...</p>
        </div>
      </div>
    );
  }

  if (!signedUrl) {
    return (
      <div className="w-full h-80 border border-red-200 rounded-lg flex items-center justify-center bg-red-50">
        <div className="text-center text-red-600">
          <Upload className="w-12 h-12 mx-auto mb-2 text-red-300" />
          <p className="text-sm">Failed to load image</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-80">
      <Image
        src={signedUrl}
        alt="Client reference for tattoo design"
        fill
        className="object-contain rounded-lg border border-gray-200 bg-gray-50"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
