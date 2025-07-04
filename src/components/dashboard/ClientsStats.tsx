import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface Client {
  email: string;
  full_name: string;
  phone?: string;
  appointment_count: number;
  last_appointment: string | null;
  first_appointment: string | null;
  appointment_statuses: string[];
  total_spent: number;
}

interface ClientsStatsProps {
  clients: Client[];
  isLoading: boolean;
}

export default function ClientsStats({ clients, isLoading }: ClientsStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : clients.length}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : clients.filter(c => c.appointment_statuses.includes("confirmed") || c.appointment_statuses.includes("pending")).length}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Returning Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : clients.filter(c => c.appointment_count > 1).length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}