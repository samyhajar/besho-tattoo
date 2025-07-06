import { Suspense } from 'react';
import LogsStats from '@/components/dashboard/LogsStats';
import LogsTable from '@/components/dashboard/LogsTable';
import LogsFilters from '@/components/dashboard/LogsFilters';
import CleanupButton from '@/components/dashboard/CleanupButton';

export default function LogsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Session Logs
            </h1>
            <p className="text-gray-400 mt-1">
              Track client appointments and session history
            </p>
          </div>
          <CleanupButton />
        </div>
      </div>

      {/* Stats */}
      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      }>
        <LogsStats />
      </Suspense>

      {/* Filters */}
      <div className="mb-6">
        <LogsFilters />
      </div>

      {/* Logs Table */}
      <Suspense fallback={
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex space-x-4 mb-3">
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      }>
        <LogsTable />
      </Suspense>
    </div>
  );
}