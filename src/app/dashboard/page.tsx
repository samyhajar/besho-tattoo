"use client";

import { useState, useEffect } from "react";
import { getTattooStats } from "@/services/tattoos";
import { fetchAppointmentStats } from "@/services/appointments";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentAppointments from "@/components/dashboard/RecentAppointments";
import QuickActions from "@/components/dashboard/QuickActions";

export default function DashboardPage() {
  const [tattooStats, setTattooStats] = useState({
    total: 0,
    categories: 0,
    thisMonth: 0,
  });
  const [appointmentStats, setAppointmentStats] = useState({
    today: 0,
    thisWeek: 0,
    pending: 0,
    completed: 0,
    confirmed: 0,
    cancelled: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [tattooData, appointmentData] = await Promise.all([
          getTattooStats(),
          fetchAppointmentStats(),
        ]);
        setTattooStats(tattooData);
        setAppointmentStats(appointmentData);
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadStats();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Welcome to your tattoo studio admin panel
        </p>
      </div>

      {/* Stats Grid */}
      <DashboardStats
        tattooStats={tattooStats}
        appointmentStats={appointmentStats}
        isLoading={isLoading}
      />

      {/* Recent Activity */}
      <div className="grid gap-6 xl:grid-cols-2">
        <RecentAppointments />
        <QuickActions />
      </div>
    </div>
  );
}
