import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  MessageSquare,
} from "lucide-react";
import type { Appointment } from "@/services/appointments";

interface AppointmentDetailsProps {
  appointment: Appointment;
}

export default function AppointmentDetails({
  appointment,
}: AppointmentDetailsProps) {
  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Client Information */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{appointment.full_name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{appointment.email}</span>
          </div>
          {appointment.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{appointment.phone}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-green-600" />
            </div>
            Appointment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{formatDate(appointment.date)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {formatTime(appointment.time_start)} -{" "}
              {formatTime(appointment.time_end)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4" /> {/* Spacer */}
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                appointment.status,
              )}`}
            >
              {appointment.status.charAt(0).toUpperCase() +
                appointment.status.slice(1)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {appointment.notes && (
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-purple-600" />
              </div>
              Client Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{appointment.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
