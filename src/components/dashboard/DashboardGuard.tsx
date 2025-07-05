"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface DashboardGuardProps {
  children: React.ReactNode;
}

export default function DashboardGuard({ children }: DashboardGuardProps) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
        return;
      }

      if (!isAdmin) {
        router.replace("/login");
        return;
      }
    }
  }, [user, isAdmin, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated or not admin
  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
