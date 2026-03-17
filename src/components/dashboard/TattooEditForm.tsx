import { useState } from "react";
import { Edit, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert } from "@/components/ui/Alert";
import Modal from "@/components/ui/Modal";
import CategoryInput from "@/components/ui/CategoryInput";
import PortfolioMediaEditor from "@/components/dashboard/PortfolioMediaEditor";
import { usePortfolioMediaManager } from "@/hooks/usePortfolioMediaManager";
import type { PortfolioMediaChangeSet, Tattoo } from "@/types/tattoo";

interface TattooEditFormProps {
  tattoo: Tattoo;
  isLoading?: boolean;
  onSave: (updates: {
    title: string;
    description: string;
    category: string;
    is_public: boolean;
    media: PortfolioMediaChangeSet;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function TattooEditForm({
  tattoo,
  isLoading = false,
  onSave,
  onCancel,
}: TattooEditFormProps) {
  const [formData, setFormData] = useState({
    title: tattoo.title || "",
    description: tattoo.description || "",
    category: tattoo.category || "",
    is_public: tattoo.is_public ?? true,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const mediaManager = usePortfolioMediaManager(tattoo.media || []);
  const fixedCategory =
    tattoo.category === "art" || tattoo.category === "designs"
      ? tattoo.category
      : undefined;

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setFormError("Title is required.");
      return;
    }

    if (!mediaManager.hasImages) {
      setFormError("At least one image is required.");
      return;
    }

    setFormError(null);

    await onSave({
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: fixedCategory || formData.category.trim(),
      is_public: formData.is_public,
      media: mediaManager.buildChangeSet(),
    });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      className="max-h-[90vh] w-full max-w-5xl overflow-y-auto"
      ariaLabelledBy="edit-tattoo-title"
    >
      <div className="p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Edit className="h-5 w-5 text-gray-600" />
            <h2
              id="edit-tattoo-title"
              className="text-xl font-bold text-gray-900 sm:text-2xl"
            >
              Edit Portfolio Item
            </h2>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="p-1 text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Close edit form"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="space-y-6"
        >
          {formError ? <Alert variant="destructive">{formError}</Alert> : null}

          <PortfolioMediaEditor
            mediaManager={mediaManager}
            disabled={isLoading}
            onError={setFormError}
          />

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              placeholder="Enter tattoo title"
            />
          </div>

          {fixedCategory ? (
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <div className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm capitalize text-gray-700">
                {fixedCategory}
              </div>
            </div>
          ) : (
            <CategoryInput
              value={formData.category}
              onChange={handleCategoryChange}
              disabled={isLoading}
              placeholder="e.g., Traditional, Realistic, Geometric"
            />
          )}

          <div className="space-y-2">
            <Label>Visibility</Label>
            <div className="flex items-center space-x-2">
              <input
                id="is_public"
                type="checkbox"
                checked={formData.is_public}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_public: event.target.checked,
                  }))
                }
                disabled={isLoading}
                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <Label
                htmlFor="is_public"
                className="text-sm font-medium text-gray-700"
              >
                Make this item visible in public portfolio
              </Label>
            </div>
            <p className="text-xs text-gray-500">
              {formData.is_public ? "✅ Visible to visitors" : "🔒 Admin only"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isLoading}
              rows={4}
              className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe this piece..."
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !mediaManager.hasImages}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
