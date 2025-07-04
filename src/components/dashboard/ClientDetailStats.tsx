import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface ClientDetailStatsProps {
  client: {
    appointment_count: number;
    first_appointment: string | null;
    last_appointment: string | null;
    appointment_statuses: string[];
  };
}

export default function ClientDetailStats({ client }: ClientDetailStatsProps) {
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

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{client.appointment_count}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">First Visit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">
            {client.first_appointment ? formatDate(client.first_appointment) : "N/A"}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Last Visit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">
            {client.last_appointment ? formatDate(client.last_appointment) : "N/A"}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {client.appointment_statuses.map((status) => (
              <span
                key={status}
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(status)}`}
              >
                {status}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}