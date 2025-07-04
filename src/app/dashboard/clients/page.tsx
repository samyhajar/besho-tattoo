"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import ClientsStats from "@/components/dashboard/ClientsStats";
import ClientsTable from "@/components/dashboard/ClientsTable";
import { fetchAllClients } from "@/services/clients";

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

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await fetchAllClients();
        setClients(data);
      } catch (error) {
        console.error("Error loading clients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadClients();
  }, []);

  const filteredClients = clients.filter(
    (client) =>
      client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClientClick = (email: string) => {
    router.push(`/dashboard/clients/${encodeURIComponent(email)}`);
  };

  return (
    <div className="space-y-6">
      {/* Back Button - Mobile Only */}
      <BackButton />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-1">Manage your client base and appointments</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <ClientsStats clients={clients} isLoading={isLoading} />

      {/* Clients Table */}
      <ClientsTable
        filteredClients={filteredClients}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onClientClick={handleClientClick}
      />
    </div>
  );
}