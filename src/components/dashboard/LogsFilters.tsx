"use client";

import { useState } from 'react';
import type { LogsFilters as LogsFiltersType } from '@/types/logs';

interface LogsFiltersProps {
  onFiltersChange?: (filters: LogsFiltersType) => void;
}

export default function LogsFilters({ onFiltersChange }: LogsFiltersProps) {
  const [filters, setFilters] = useState<LogsFiltersType>({
    status: 'all',
    search: '',
    date_from: '',
    date_to: '',
  });

  const handleFilterChange = (key: keyof LogsFiltersType, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleReset = () => {
    const resetFilters: LogsFiltersType = {
      status: 'all',
      search: '',
      date_from: '',
      date_to: '',
    };
    setFilters(resetFilters);
    onFiltersChange?.(resetFilters);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Status Filter */}
          <div className="flex-1 min-w-0">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              id="status-filter"
              value={filters.status || 'all'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-2 bg-gray-800/80 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
              <option value="rescheduled">Rescheduled</option>
            </select>
          </div>

          {/* Date From */}
          <div className="flex-1 min-w-0">
            <label htmlFor="date-from-filter" className="block text-sm font-medium text-gray-300 mb-2">
              From Date
            </label>
            <input
              id="date-from-filter"
              type="date"
              value={filters.date_from || ''}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
              className="w-full px-4 py-2 bg-gray-800/80 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date To */}
          <div className="flex-1 min-w-0">
            <label htmlFor="date-to-filter" className="block text-sm font-medium text-gray-300 mb-2">
              To Date
            </label>
            <input
              id="date-to-filter"
              type="date"
              value={filters.date_to || ''}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
              className="w-full px-4 py-2 bg-gray-800/80 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Search */}
          <div className="flex-1 min-w-0">
            <label htmlFor="search-filter" className="block text-sm font-medium text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                id="search-filter"
                type="text"
                placeholder="Search clients, notes..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-800/80 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex-shrink-0">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}