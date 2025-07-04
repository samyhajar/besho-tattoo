"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { X, CheckCircle, XCircle } from "lucide-react";
import type { Appointment } from "@/services/appointments";
import AppointmentDetails from "./AppointmentDetails";
import AppointmentImageViewer from "./AppointmentImageViewer";

interface AppointmentModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (appointmentId: string) => Promise<void>;
  onCancel: (appointmentId: string, reason: string) => Promise<void>;
}

export default function AppointmentModal({
  appointment,
  isOpen,
  onClose,
  onConfirm,
  onCancel,
}: AppointmentModalProps) {
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!appointment) return;

    try {
      setProcessing(true);
      setError(null);
      await onConfirm(appointment.id);
      onClose();
    } catch (err) {
      console.error("Error confirming appointment:", err);
      setError("Failed to confirm appointment");
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!appointment || !cancelReason.trim()) return;

    try {
      setProcessing(true);
      setError(null);
      await onCancel(appointment.id, cancelReason);
      onClose();
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      setError("Failed to cancel appointment");
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen || !appointment) return null;

  const isPending = appointment.status === "pending";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Appointment Details
          </h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column - Appointment Details */}
            <div>
              <AppointmentDetails appointment={appointment} />
            </div>

            {/* Right Column - Reference Image */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Reference Image
              </h3>
              <AppointmentImageViewer
                imageUrl={appointment.image_url}
                isOpen={isOpen}
              />
            </div>
          </div>

          {/* Actions */}
          {isPending && (
            <>
              {showCancelForm ? (
                <div className="mt-8 p-6 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="font-semibold text-red-900 mb-3">
                    Cancel Appointment
                  </h4>
                  <textarea
                    placeholder="Please provide a reason for cancellation..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCancelForm(false);
                        setCancelReason("");
                      }}
                      disabled={processing}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => void handleCancel()}
                      disabled={processing || !cancelReason.trim()}
                      variant="destructive"
                      className="flex items-center gap-2 min-w-[160px]"
                    >
                      {processing ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      {processing ? "Cancelling..." : "Confirm Cancellation"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 pt-6 border-t lg:grid-cols-2">
                  <Button
                    onClick={() => void handleConfirm()}
                    disabled={processing}
                    size="lg"
                    className="flex items-center justify-center gap-2 h-12"
                  >
                    {processing ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    {processing ? "Confirming..." : "Confirm Appointment"}
                  </Button>

                  <Button
                    onClick={() => setShowCancelForm(true)}
                    disabled={processing}
                    variant="outline"
                    size="lg"
                    className="flex items-center justify-center gap-2 h-12 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <XCircle className="w-5 h-5" />
                    Cancel Appointment
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
