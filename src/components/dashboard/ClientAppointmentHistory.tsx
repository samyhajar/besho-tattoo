import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface Appointment {
  id: string;
  date: string;
  time_start: string;
  time_end: string;
  status: string;
  notes?: string;
  created_at: string;
}

interface ClientAppointmentHistoryProps {
  appointments: Appointment[];
}

export default function ClientAppointmentHistory({ appointments }: ClientAppointmentHistoryProps) {
  const router = useRouter();

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white border border-gray-100 rounded-lg hover:bg-gray-50/50 hover:border-gray-200 transition-all duration-150 shadow-sm"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="font-medium text-gray-900">
                    {formatDate(appointment.date)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatTime(appointment.time_start)} - {formatTime(appointment.time_end)}
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(appointment.status)}`}
                  >
                    {appointment.status}
                  </span>
                </div>
                {appointment.notes && (
                  <div className="text-sm text-gray-600 mt-1">
                    <strong>Notes:</strong> {appointment.notes}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Booked on {new Date(appointment.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-4">
                <Button
                  onClick={() => router.push(`/dashboard/appointments?appointment=${appointment.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-sm"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
          {appointments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No appointments found for this client.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}