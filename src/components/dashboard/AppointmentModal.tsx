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
      await onCancel(appointment.id, cancelReason.trim());
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Appointment Details
          </h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            {error && (
              <Alert variant="destructive" className="mb-4 sm:mb-6">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-6 lg:space-y-0 lg:grid lg:gap-6 lg:grid-cols-2">
              {/* Left Column - Appointment Details */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 lg:hidden">
                  Appointment Information
                </h3>
                <AppointmentDetails appointment={appointment} />
              </div>

              {/* Right Column - Reference Image */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Reference Image
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] sm:min-h-[300px]">
                  <AppointmentImageViewer
                    imageUrl={appointment.image_url}
                    isOpen={isOpen}
                  />
                </div>
              </div>
            </div>

            {/* Actions Section */}
            {isPending && (
              <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
                {showCancelForm ? (
                  <div className="space-y-4 p-4 sm:p-6 border border-red-200 rounded-lg bg-red-50">
                    <h4 className="font-semibold text-red-900 text-sm sm:text-base">
                      Cancel Appointment
                    </h4>
                    <textarea
                      placeholder="Please provide a reason for cancellation..."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-red-300 rounded-md
                               placeholder-red-400 focus:outline-none focus:ring-2 focus:ring-red-500
                               focus:border-red-500 resize-none"
                      disabled={processing}
                    />
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCancelForm(false);
                          setCancelReason("");
                        }}
                        disabled={processing}
                        className="order-2 sm:order-1 w-full sm:w-auto"
                      >
                        Back
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => void handleCancel()}
                        disabled={processing || !cancelReason.trim()}
                        className="order-1 sm:order-2 w-full sm:w-auto"
                      >
                        {processing ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <span className="hidden sm:inline">
                              Cancelling...
                            </span>
                          </div>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">
                              Confirm Cancellation
                            </span>
                            <span className="sm:hidden">Cancel</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowCancelForm(true)}
                      disabled={processing}
                      className="order-2 sm:order-1 w-full sm:flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">
                        Cancel Appointment
                      </span>
                      <span className="sm:hidden">Cancel</span>
                    </Button>

                    <Button
                      onClick={() => void handleConfirm()}
                      disabled={processing}
                      className="order-1 sm:order-2 w-full sm:flex-1 py-3 sm:py-2"
                    >
                      {processing ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span className="hidden sm:inline">
                            Confirming...
                          </span>
                        </div>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 sm:mr-2" />
                          <span className="hidden sm:inline">
                            Confirm Appointment
                          </span>
                          <span className="sm:hidden">Confirm</span>
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
