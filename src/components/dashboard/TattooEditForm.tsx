import { useState } from "react";
import { X, Edit } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import Modal from "@/components/ui/Modal";
import CategoryInput from "@/components/ui/CategoryInput";
import TattooImageUpload from "@/components/dashboard/TattooImageUpload";
import type { Tattoo } from "@/types/tattoo";

interface TattooEditFormProps {
  tattoo: Tattoo;
  currentImageUrl?: string;
  isLoading?: boolean;
  onSave: (updates: {
    title: string;
    description: string;
    category: string;
    is_public: boolean;
    image?: File;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function TattooEditForm({
  tattoo,
  currentImageUrl,
  isLoading = false,
  onSave,
  onCancel,
}: TattooEditFormProps) {
  const [formData, setFormData] = useState({
    title: tattoo.title || "",
    description: tattoo.description || "",
    category: tattoo.category || "",
    is_public: tattoo.is_public ?? true, // Default to true if undefined
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const inputValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: inputValue }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    const updates = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      is_public: formData.is_public,
      ...(imageFile && { image: imageFile }),
    };

    await onSave(updates);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      ariaLabelledBy="edit-tattoo-title"
    >
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Edit className="w-5 h-5 text-gray-600" />
            <h2
              id="edit-tattoo-title"
              className="text-xl sm:text-2xl font-bold text-gray-900"
            >
              Edit Tattoo
            </h2>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Close edit form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Image Section */}
          <TattooImageUpload
            currentImageUrl={currentImageUrl}
            imagePreview={imagePreview}
            imageFile={imageFile}
            isLoading={isLoading}
            onImageChange={handleImageChange}
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
              className="w-full"
              placeholder="Enter tattoo title"
            />
          </div>

          <CategoryInput
            value={formData.category}
            onChange={handleCategoryChange}
            disabled={isLoading}
            placeholder="e.g., Traditional, Realistic, Geometric"
          />
            <div className="space-y-2">
              <Label>Visibility</Label>
              <div className="flex items-center space-x-2">
                <input
                  id="is_public"
                  type="checkbox"
                  checked={formData.is_public}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                  disabled={isLoading}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <Label htmlFor="is_public" className="text-sm font-medium text-gray-700">
                  Make this tattoo visible in public portfolio
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
              className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Describe this tattoo design..."
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
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
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
