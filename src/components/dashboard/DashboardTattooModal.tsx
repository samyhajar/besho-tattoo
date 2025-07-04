import { useState } from 'react';
import { X, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import type { Tattoo } from '@/types/tattoo';
import { Button } from "@/components/ui/Button";
import Modal from '@/components/ui/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import TattooEditForm from '@/components/dashboard/TattooEditForm';

interface DashboardTattooModalProps {
  tattoo: Tattoo;
  signedUrl: string;
  isDeleting: boolean;
  onClose: () => void;
  onDelete: (tattoo: Tattoo) => Promise<void>;
  onEdit: (tattoo: Tattoo, updates: {
    title: string;
    description: string;
    category: string;
    image?: File;
  }) => Promise<void>;
}

export default function DashboardTattooModal({
  tattoo,
  signedUrl,
  isDeleting,
  onClose,
  onDelete,
  onEdit
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
    image?: File;
  }) => {
    try {
      setIsEditing(true);
      await onEdit(tattoo, updates);
      setShowEditForm(false);
    } catch (error) {
      console.error('Error editing tattoo:', error);
    } finally {
      setIsEditing(false);
    }
  };

    // Show edit form if editing
  if (showEditForm) {
    return (
      <TattooEditForm
        tattoo={tattoo}
        currentImageUrl={signedUrl}
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
        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        ariaLabelledBy="tattoo-modal-title"
      >
          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <div>
                <h2 id="tattoo-modal-title" className="text-xl sm:text-2xl font-bold text-gray-900">
                  {tattoo.title}
                </h2>
                {tattoo.category && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-800 mt-2">
                    {tattoo.category}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={signedUrl || '/placeholder-image.svg'}
                  alt={tattoo.title}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                {tattoo.description && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{tattoo.description}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Details</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Created:</dt>
                      <dd className="text-gray-900">{new Date(tattoo.created_at).toLocaleDateString()}</dd>
                    </div>
                    {tattoo.category && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Category:</dt>
                        <dd className="text-gray-900">{tattoo.category}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div className="pt-4 space-y-3">
                  {/* Edit Button */}
                  <Button
                    variant="outline"
                    onClick={() => setShowEditForm(true)}
                    disabled={isDeleting}
                    className="w-full sm:w-auto"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Tattoo
                  </Button>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteConfirmation(true)}
                      disabled={isDeleting}
                      className="w-full sm:w-auto"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {isDeleting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                          Deleting...
                        </>
                      ) : (
                        'Delete Tattoo'
                      )}
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

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        title="Delete Tattoo"
        message={`Are you sure you want to delete "${tattoo.title}"? This action cannot be undone and will permanently remove the tattoo from your portfolio.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={() => { void handleDelete(); }}
        onCancel={() => setShowDeleteConfirmation(false)}
      />
    </>
  );
}