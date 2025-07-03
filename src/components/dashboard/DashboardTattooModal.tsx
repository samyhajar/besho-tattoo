import Image from 'next/image';
import type { Tattoo } from '@/types/tattoo';
import { Button } from "@/components/ui/Button";

interface DashboardTattooModalProps {
  tattoo: Tattoo;
  signedUrl: string;
  isDeleting: boolean;
  onClose: () => void;
  onDelete: (tattoo: Tattoo) => Promise<void>;
}

export default function DashboardTattooModal({
  tattoo,
  signedUrl,
  isDeleting,
  onClose,
  onDelete
}: DashboardTattooModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{tattoo.title}</h2>
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
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
                  <p className="text-gray-700">{tattoo.description}</p>
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

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Button
                  variant="destructive"
                  onClick={() => { void onDelete(tattoo); }}
                  disabled={isDeleting}
                  className="w-full sm:w-auto"
                >
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
                  className="w-full sm:w-auto"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}