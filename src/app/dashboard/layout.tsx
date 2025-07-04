import { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardGuard from "@/components/dashboard/DashboardGuard";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardGuard>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        {/* Main content area with responsive margins */}
        <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-white/50 min-h-screen text-base">
          {children}
        </main>
      </div>
    </DashboardGuard>
  );
}