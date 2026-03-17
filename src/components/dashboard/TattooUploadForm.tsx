import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import CategoryInput from "@/components/ui/CategoryInput";
import PortfolioMediaEditor from "@/components/dashboard/PortfolioMediaEditor";
import type { PortfolioMediaManagerState } from "@/hooks/usePortfolioMediaManager";
import type { TattooFormData } from "@/types/tattoo";

interface TattooUploadFormProps {
  formData: TattooFormData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onCategoryChange: (value: string) => void;
  onVisibilityChange: (isPublic: boolean) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  mediaManager: PortfolioMediaManagerState;
  onMediaError: (message: string | null) => void;
  error: string | null;
  isLoading: boolean;
  fixedCategory?: string;
}

export default function TattooUploadForm({
  formData,
  onInputChange,
  onCategoryChange,
  onVisibilityChange,
  onSubmit,
  onCancel,
  mediaManager,
  onMediaError,
  error,
  isLoading,
  fixedCategory,
}: TattooUploadFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {fixedCategory === "art"
            ? "Artwork Details"
            : fixedCategory === "designs"
              ? "Design Details"
              : "Tattoo Details"}
        </CardTitle>
        <CardDescription>
          {fixedCategory === "art"
            ? "Fill in the information about your artwork and upload multiple images or videos."
            : fixedCategory === "designs"
              ? "Fill in the information about your design and upload multiple images or videos."
              : "Fill in the information about your tattoo and upload multiple images or videos."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void onSubmit();
          }}
          className="space-y-6"
        >
          {error ? <Alert variant="destructive">{error}</Alert> : null}

          <PortfolioMediaEditor
            mediaManager={mediaManager}
            disabled={isLoading}
            onError={onMediaError}
          />

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={onInputChange}
              placeholder="Enter tattoo title"
              required
            />
          </div>

          {fixedCategory ? (
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <div className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm capitalize text-gray-700">
                {fixedCategory}
              </div>
              <p className="text-xs text-gray-500">
                Category is automatically set to {fixedCategory}.
              </p>
            </div>
          ) : (
            <CategoryInput
              value={formData.category}
              onChange={onCategoryChange}
              disabled={isLoading}
              placeholder="e.g., Traditional, Realism, Geometric"
            />
          )}

          <div className="space-y-2">
            <Label>Visibility</Label>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <input
                  id="is_public"
                  type="checkbox"
                  checked={formData.is_public}
                  onChange={(event) => onVisibilityChange(event.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <Label
                  htmlFor="is_public"
                  className="text-sm font-medium text-gray-700"
                >
                  Make this tattoo visible in public portfolio
                </Label>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {formData.is_public
                ? "✅ This item will be visible to visitors."
                : "🔒 This item will stay visible only in the dashboard."}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onInputChange}
              placeholder="Describe the tattoo, inspiration, or story behind it..."
              rows={4}
              className="flex w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-500 hover:border-gray-400 focus-visible:border-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <Button
              type="submit"
              disabled={isLoading || !mediaManager.hasImages}
              className="w-full sm:w-auto"
            >
              {isLoading
                ? fixedCategory === "art"
                  ? "Creating Artwork..."
                  : fixedCategory === "designs"
                    ? "Creating Design..."
                    : "Creating Tattoo..."
                : fixedCategory === "art"
                  ? "Create Artwork"
                  : fixedCategory === "designs"
                    ? "Create Design"
                    : "Create Tattoo"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
