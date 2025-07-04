"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import AppointmentModal from "@/components/dashboard/AppointmentModal";
import AppointmentStats from "@/components/dashboard/AppointmentStats";
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments";
import { createClient } from "@/lib/supabase/browser-client";
import { confirmAppointment, cancelAppointment } from "@/services/appointments";
import type { Appointment } from "@/services/appointments";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadAppointmentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("date", { ascending: true })
        .order("time_start", { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (err) {
      console.error("Error loading appointments:", err);
      setError("Failed to load appointment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAppointmentData();
  }, []);

  const handleConfirmAppointment = async (appointmentId: string) => {
    await confirmAppointment(appointmentId);
    await loadAppointmentData();
  };

  const handleCancelAppointment = async (
    appointmentId: string,
    reason: string,
  ) => {
    await cancelAppointment(appointmentId, reason);
    await loadAppointmentData();
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Appointments
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Manage and track client appointments
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">
            Loading appointments...
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Stats */}
          <AppointmentStats appointments={appointments} />

          {/* Appointments List */}
          <UpcomingAppointments
            appointments={appointments}
            onAppointmentClick={handleAppointmentClick}
            onRefresh={() => void loadAppointmentData()}
            loading={loading}
          />
        </div>
      )}

      {/* Appointment Modal */}
      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={modalOpen}
        onClose={handleModalClose}
        onConfirm={handleConfirmAppointment}
        onCancel={handleCancelAppointment}
      />
    </div>
  );
}
