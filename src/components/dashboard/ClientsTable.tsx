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

interface ClientsTableProps {
  filteredClients: Client[];
  isLoading: boolean;
  searchTerm: string;
  onClientClick: (email: string) => void;
}

export default function ClientsTable({
  filteredClients,
  isLoading,
  searchTerm,
  onClientClick,
}: ClientsTableProps) {
  const getStatusBadgeColor = (statuses: string[]) => {
    if (statuses.includes("completed")) return "bg-green-100 text-green-800";
    if (statuses.includes("confirmed")) return "bg-blue-100 text-blue-800";
    if (statuses.includes("pending")) return "bg-yellow-100 text-yellow-800";
    if (statuses.includes("cancelled")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Clients</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="w-32 h-4 bg-gray-200 rounded"></div>
                  <div className="w-48 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="pb-4 pt-2 font-medium text-gray-600 text-sm">Client</th>
                  <th className="pb-4 pt-2 font-medium text-gray-600 text-sm hidden sm:table-cell">Appointments</th>
                  <th className="pb-4 pt-2 font-medium text-gray-600 text-sm hidden md:table-cell">Last Visit</th>
                  <th className="pb-4 pt-2 font-medium text-gray-600 text-sm hidden lg:table-cell">Status</th>
                  <th className="pb-4 pt-2 font-medium text-gray-600 text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredClients.map((client) => (
                  <tr
                    key={client.email}
                    className="hover:bg-gray-50/50 cursor-pointer transition-colors duration-150"
                    onClick={() => onClientClick(client.email)}
                  >
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {client.full_name.split(" ").map(n => n[0]).join("").toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{client.full_name}</div>
                          <div className="text-sm text-gray-500">{client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 hidden sm:table-cell">
                      <div className="text-sm">
                        <div className="font-medium">{client.appointment_count} appointments</div>
                        <div className="text-gray-500">
                          Since {formatDate(client.first_appointment)}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-900">
                        {formatDate(client.last_appointment)}
                      </div>
                    </td>
                    <td className="py-4 hidden lg:table-cell">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(client.appointment_statuses)}`}
                      >
                        {client.appointment_statuses.join(", ")}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClientClick(client.email);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredClients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "No clients found matching your search." : "No clients found."}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}