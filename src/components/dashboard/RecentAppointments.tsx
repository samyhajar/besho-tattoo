import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { parseLocalDate, parseLocalDateTime } from "@/lib/utils";
import {
  fetchAllAppointments,
  type Appointment,
} from "@/services/appointments";
import GoogleMeetButton from "./GoogleMeetButton";

export default function RecentAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const allAppointments = await fetchAllAppointments();
        // Get the 3 most recent appointments (limit to upcoming and recent)
        const now = new Date();
        const recentAppointments = allAppointments
          .filter((apt) => {
            const aptDate = new Date(`${apt.date}T${apt.time_start}`);
            // Show appointments from today onwards, or recently past (within 7 days)
            const sevenDaysAgo = new Date(
              now.getTime() - 7 * 24 * 60 * 60 * 1000,
            );
            return aptDate >= sevenDaysAgo;
          })
          .sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time_start}`);
            const dateB = new Date(`${b.date}T${b.time_start}`);
            return dateA.getTime() - dateB.getTime();
          })
          .slice(0, 3);

        setAppointments(recentAppointments);
      } catch (error) {
        console.error("Error loading appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadAppointments();
  }, []);

  const formatAppointmentTime = (date: string, timeStart: string) => {
    // Parse date and time in local timezone to avoid UTC conversion issues
    const appointmentDate = parseLocalDateTime(date, timeStart);
    const aptDay = parseLocalDate(date);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    let dateStr = "";
    if (aptDay.getTime() === today.getTime()) {
      dateStr = "Today";
    } else if (aptDay.getTime() === tomorrow.getTime()) {
      dateStr = "Tomorrow";
    } else {
      dateStr = appointmentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    const timeStr = appointmentDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${dateStr}, ${timeStr}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleMeetCreated = (appointmentId: string, meetLink: string) => {
    // Update the appointment in the local state
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, google_meet_link: meetLink } : apt,
      ),
    );
  };

  const handleMeetDeleted = (appointmentId: string) => {
    // Update the appointment in the local state
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? { ...apt, google_meet_link: null, google_meet_event_id: null }
          : apt,
      ),
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Appointments</CardTitle>
        <CardDescription>Latest bookings from your clients</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="space-y-2">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="text-right space-y-2">
                <div className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))
        ) : appointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No recent appointments found</p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-3 bg-gray-50 rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{appointment.full_name}</p>
                  <p className="text-xs text-gray-600">
                    {appointment.notes || "No description provided"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {formatAppointmentTime(
                      appointment.date,
                      appointment.time_start,
                    )}
                  </p>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}
                  >
                    {getStatusLabel(appointment.status)}
                  </span>
                </div>
              </div>

              {/* Google Meet Button - Only show for confirmed appointments */}
              {appointment.status === "confirmed" && (
                <div className="pt-2 border-t border-gray-200">
                  <GoogleMeetButton
                    appointmentId={appointment.id}
                    existingMeetLink={appointment.google_meet_link}
                    existingEventId={appointment.google_meet_event_id}
                    onMeetCreated={(meetLink) =>
                      handleMeetCreated(appointment.id, meetLink)
                    }
                    onMeetDeleted={() => handleMeetDeleted(appointment.id)}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
