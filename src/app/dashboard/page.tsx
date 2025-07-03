"use client";

import { useState, useEffect } from "react";
import { getTattooStats } from "@/services/tattoos";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentAppointments from "@/components/dashboard/RecentAppointments";
import QuickActions from "@/components/dashboard/QuickActions";

export default function DashboardPage() {
  const [tattooStats, setTattooStats] = useState({ total: 0, categories: 0, thisMonth: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await getTattooStats();
        setTattooStats(stats);
      } catch (error) {
        console.error('Error loading tattoo stats:', error);
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your tattoo studio admin panel</p>
      </div>

      {/* Stats Grid */}
      <DashboardStats tattooStats={tattooStats} isLoading={isLoading} />

      {/* Recent Activity */}
      <div className="grid gap-6 xl:grid-cols-2">
        <RecentAppointments />
        <QuickActions />
      </div>
    </div>
  );
}