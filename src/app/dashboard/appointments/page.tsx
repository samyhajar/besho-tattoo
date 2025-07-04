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

  useEffect(() => {
    void loadAppointmentData();
  }, []);

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

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
  };

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-600 mt-2">
          Manage and track client appointments
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <AppointmentStats appointments={appointments} />

      {/* Upcoming Appointments */}
      <UpcomingAppointments
        appointments={appointments}
        onAppointmentClick={handleAppointmentClick}
        onRefresh={() => void loadAppointmentData()}
        loading={loading}
      />

      {/* Appointment Modal */}
      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAppointment}
        onCancel={handleCancelAppointment}
      />
    </div>
  );
}
