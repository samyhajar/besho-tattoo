import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface DashboardStatsProps {
  tattooStats: {
    total: number;
    categories: number;
    thisMonth: number;
  };
  appointmentStats: {
    today: number;
    thisWeek: number;
    pending: number;
    completed: number;
    confirmed: number;
    cancelled: number;
    total: number;
  };
  isLoading: boolean;
}

export default function DashboardStats({
  tattooStats,
  appointmentStats,
  isLoading,
}: DashboardStatsProps) {
  const totalAppointments = appointmentStats.total;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Total Tattoos</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-gray-600"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            ) : (
              tattooStats.total
            )}
          </div>
          <p className="text-sm text-gray-600">
            {isLoading ? (
              <span className="inline-block w-16 h-3 bg-gray-200 rounded animate-pulse"></span>
            ) : (
              `+${tattooStats.thisMonth} this month`
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Appointments</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-gray-600"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            ) : (
              totalAppointments
            )}
          </div>
          <p className="text-sm text-gray-600">
            {isLoading ? (
              <span className="inline-block w-16 h-3 bg-gray-200 rounded animate-pulse"></span>
            ) : (
              `+${appointmentStats.thisWeek} this week`
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Categories</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-gray-600"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <div className="w-6 h-8 bg-gray-200 rounded animate-pulse" />
            ) : (
              tattooStats.categories
            )}
          </div>
          <p className="text-sm text-gray-600">Tattoo styles</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Today</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-gray-600"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <div className="w-6 h-8 bg-gray-200 rounded animate-pulse" />
            ) : (
              appointmentStats.today
            )}
          </div>
          <p className="text-sm text-gray-600">
            {isLoading ? (
              <span className="inline-block w-16 h-3 bg-gray-200 rounded animate-pulse"></span>
            ) : (
              `${appointmentStats.pending} pending`
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
