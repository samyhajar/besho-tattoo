"use client";

import type { LogRow } from '@/services/logs';

interface LogsDetailsModalProps {
  selectedLog: LogRow | null;
  onClose: () => void;
}

export default function LogsDetailsModal({ selectedLog, onClose }: LogsDetailsModalProps) {
  if (!selectedLog) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-900/20 text-green-400 border-green-700/50',
      cancelled: 'bg-red-900/20 text-red-400 border-red-700/50',
      'no-show': 'bg-orange-900/20 text-orange-400 border-orange-700/50',
      rescheduled: 'bg-yellow-900/20 text-yellow-400 border-yellow-700/50',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || 'bg-gray-900/20 text-gray-400 border-gray-700/50'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    const diff = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Session Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Client Info */}
          <div>
            <h4 className="text-lg font-medium text-white mb-3">Client Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-white">{selectedLog.client_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white">{selectedLog.client_email}</p>
              </div>
              {selectedLog.client_phone && (
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-white">{selectedLog.client_phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Session Details */}
          <div>
            <h4 className="text-lg font-medium text-white mb-3">Session Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Date</p>
                <p className="text-white">{formatDate(selectedLog.appointment_date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Time</p>
                <p className="text-white">
                  {formatTime(selectedLog.appointment_time_start)} - {formatTime(selectedLog.appointment_time_end)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Duration</p>
                <p className="text-white">
                  {calculateDuration(selectedLog.appointment_time_start, selectedLog.appointment_time_end)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <div className="mt-1">{getStatusBadge(selectedLog.status)}</div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {(selectedLog.session_notes || selectedLog.admin_notes) && (
            <div>
              <h4 className="text-lg font-medium text-white mb-3">Notes</h4>
              {selectedLog.session_notes && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">Session Notes</p>
                  <p className="text-gray-300 bg-gray-900/50 rounded-lg p-3">
                    {selectedLog.session_notes}
                  </p>
                </div>
              )}
              {selectedLog.admin_notes && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Admin Notes</p>
                  <p className="text-gray-300 bg-gray-900/50 rounded-lg p-3">
                    {selectedLog.admin_notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Reference Image */}
          {selectedLog.reference_image_url && (
            <div>
              <h4 className="text-lg font-medium text-white mb-3">Reference Image</h4>
              <img
                src={selectedLog.reference_image_url}
                alt="Reference"
                className="rounded-lg max-w-full h-auto"
              />
            </div>
          )}

          {/* Result Images */}
          {selectedLog.result_images && selectedLog.result_images.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-white mb-3">Result Images</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedLog.result_images.map((url: string, index: number) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Result ${index + 1}`}
                    className="rounded-lg w-full h-auto"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}