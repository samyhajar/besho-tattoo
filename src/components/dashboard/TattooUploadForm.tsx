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
import type { TattooFormData } from "@/types/tattoo";

interface TattooUploadFormProps {
  formData: TattooFormData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onCategoryChange: (value: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  selectedFile: File | null;
  error: string | null;
  isLoading: boolean;
}

export default function TattooUploadForm({
  formData,
  onInputChange,
  onCategoryChange,
  onFileChange,
  onSubmit,
  onCancel,
  selectedFile,
  error,
  isLoading,
}: TattooUploadFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tattoo Details</CardTitle>
        <CardDescription>
          Fill in the information about your tattoo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit();
          }}
          className="space-y-6"
        >
          {error && <Alert variant="destructive">{error}</Alert>}

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Image *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : "Click to upload image"}
                </span>
                <span className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </span>
              </label>
            </div>
          </div>

          {/* Title */}
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

          {/* Category */}
          <CategoryInput
            value={formData.category}
            onChange={onCategoryChange}
            disabled={isLoading}
            placeholder="e.g., Traditional, Realism, Geometric"
          />

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onInputChange}
              placeholder="Describe the tattoo, inspiration, or story behind it..."
              rows={4}
              className="flex w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all duration-200 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:border-gray-900 hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading || !selectedFile || !formData.title.trim()}
              className="w-full sm:flex-1"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                "Add to Portfolio"
              )}
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
