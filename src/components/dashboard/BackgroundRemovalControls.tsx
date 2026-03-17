import { Button } from "@/components/ui/Button";

interface BackgroundRemovalControlsProps {
  disabled?: boolean;
  hasImage: boolean;
  hasProcessedImage: boolean;
  isProcessing: boolean;
  isUsingProcessed: boolean;
  processingError: string | null;
  onProcess: () => void;
  onUseOriginal: () => void;
  onUseProcessed: () => void;
}

export default function BackgroundRemovalControls({
  disabled = false,
  hasImage,
  hasProcessedImage,
  isProcessing,
  isUsingProcessed,
  processingError,
  onProcess,
  onUseOriginal,
  onUseProcessed,
}: BackgroundRemovalControlsProps) {
  if (!hasImage) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={onProcess}
          disabled={disabled || isProcessing}
          className="w-full sm:w-auto"
        >
          {isProcessing ? "Removing Background..." : "Remove Background"}
        </Button>

        {hasProcessedImage ? (
          <>
            <Button
              type="button"
              variant={isUsingProcessed ? "secondary" : "outline"}
              onClick={onUseProcessed}
              disabled={disabled || isProcessing || isUsingProcessed}
              className="w-full sm:w-auto"
            >
              Use Processed
            </Button>
            <Button
              type="button"
              variant={!isUsingProcessed ? "secondary" : "outline"}
              onClick={onUseOriginal}
              disabled={disabled || isProcessing || !isUsingProcessed}
              className="w-full sm:w-auto"
            >
              Use Original
            </Button>
          </>
        ) : null}
      </div>

      <p className="text-xs text-gray-500">
        The processed preview stays local until you save. The uploaded image
        will match whichever version is currently selected.
      </p>

      {processingError ? (
        <p className="text-sm text-red-600">{processingError}</p>
      ) : null}
    </div>
  );
}
