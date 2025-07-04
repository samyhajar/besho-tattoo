"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import ClientDetailHeader from "@/components/dashboard/ClientDetailHeader";
import ClientDetailStats from "@/components/dashboard/ClientDetailStats";
import ClientAppointmentHistory from "@/components/dashboard/ClientAppointmentHistory";
import { fetchClientDetails, ClientDetail } from "@/services/clients";

export default function ClientDetailPage() {
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const email = decodeURIComponent(window.location.pathname.split("/").pop() ?? "");

  useEffect(() => {
    const loadClient = async () => {
      try {
        const data = await fetchClientDetails(email);
        setClient(data);
      } catch (error) {
        console.error("Error loading client:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (email) {
      void loadClient();
    }
  }, [email]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <BackButton />
        <div className="h-8 bg-gray-200 rounded w-64"></div>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="space-y-6">
        <BackButton />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Client not found</h1>
          <p className="text-gray-600 mb-4">The client with email &quot;{email}&quot; was not found.</p>
          <Button onClick={() => router.push("/dashboard/clients")}>
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button - Mobile Only */}
      <BackButton />

      {/* Header */}
      <ClientDetailHeader client={client} />

      {/* Stats Cards */}
      <ClientDetailStats client={client} />

      {/* Appointments History */}
      <ClientAppointmentHistory appointments={client.appointments} />
    </div>
  );
}