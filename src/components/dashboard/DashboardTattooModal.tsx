import { useState } from "react";
import { Edit, Trash2, X } from "lucide-react";
import type { PortfolioMediaChangeSet, Tattoo } from "@/types/tattoo";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import TattooEditForm from "@/components/dashboard/TattooEditForm";
import PortfolioMediaCarousel from "@/components/shared/PortfolioMediaCarousel";

interface DashboardTattooModalProps {
  tattoo: Tattoo;
  isDeleting: boolean;
  onClose: () => void;
  onDelete: (tattoo: Tattoo) => Promise<void>;
  onEdit: (
    tattoo: Tattoo,
    updates: {
      title: string;
      description: string;
      category: string;
      is_public: boolean;
      media: PortfolioMediaChangeSet;
    },
  ) => Promise<void>;
}

export default function DashboardTattooModal({
  tattoo,
  isDeleting,
  onClose,
  onDelete,
  onEdit,
}: DashboardTattooModalProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    setShowDeleteConfirmation(false);
    await onDelete(tattoo);
  };

  const handleEdit = async (updates: {
    title: string;
    description: string;
    category: string;
    is_public: boolean;
    media: PortfolioMediaChangeSet;
  }) => {
    try {
      setIsEditing(true);
      await onEdit(tattoo, updates);
      setShowEditForm(false);
    } catch (error) {
      console.error("Error editing tattoo:", error);
    } finally {
      setIsEditing(false);
    }
  };

  if (showEditForm) {
    return (
      <TattooEditForm
        tattoo={tattoo}
        isLoading={isEditing}
        onSave={handleEdit}
        onCancel={() => setShowEditForm(false)}
      />
    );
  }

  return (
    <>
      <Modal
        isOpen={true}
        onClose={onClose}
        className="max-h-[90vh] w-full max-w-6xl overflow-y-auto"
        ariaLabelledBy="tattoo-modal-title"
      >
        <div className="p-4 sm:p-6">
          <div className="mb-4 flex items-start justify-between sm:mb-6">
            <div>
              <h2
                id="tattoo-modal-title"
                className="text-xl font-bold text-gray-900 sm:text-2xl"
              >
                {tattoo.title}
              </h2>
              {tattoo.category ? (
                <span className="mt-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-800">
                  {tattoo.category}
                </span>
              ) : null}
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 transition-colors hover:text-gray-600"
              aria-label="Close modal"
              type="button"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr,0.9fr]">
            <PortfolioMediaCarousel tattoo={tattoo} theme="light" />

            <div className="space-y-4">
              {tattoo.description ? (
                <div>
                  <h3 className="mb-2 font-medium text-gray-900">
                    Description
                  </h3>
                  <p className="leading-relaxed text-gray-700">
                    {tattoo.description}
                  </p>
                </div>
              ) : null}

              <div>
                <h3 className="mb-2 font-medium text-gray-900">Details</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-600">Created:</dt>
                    <dd className="text-right text-gray-900">
                      {new Date(tattoo.created_at).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-600">Media:</dt>
                    <dd className="text-right text-gray-900">
                      {tattoo.media?.length || 0} items
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-600">Primary image:</dt>
                    <dd className="text-right text-gray-900">
                      {tattoo.primaryMedia?.storage_path
                        ?.split("/")
                        .pop()
                        ?.slice(0, 28) || "None"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-600">Visibility:</dt>
                    <dd className="text-right text-gray-900">
                      {tattoo.is_public ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          ✅ Public
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                          🔒 Private
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowEditForm(true)}
                  disabled={isDeleting}
                  className="w-full sm:w-auto"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Item
                </Button>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteConfirmation(true)}
                    disabled={isDeleting}
                    className="w-full sm:w-auto"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete Item"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={isDeleting}
                    className="w-full sm:w-auto"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        title="Delete Portfolio Item"
        message={`Are you sure you want to delete "${tattoo.title}"? This action cannot be undone and will remove every uploaded image and video for this item.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={() => {
          void handleDelete();
        }}
        onCancel={() => setShowDeleteConfirmation(false)}
      />
    </>
  );
}
