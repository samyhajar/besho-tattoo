"use client";

import { useState, useEffect } from 'react';
import { getLogsStats } from '@/services/logs';
import type { LogsStats as LogsStatsType } from '@/types/logs';

export default function LogsStats() {
  const [stats, setStats] = useState<LogsStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await getLogsStats();
        setStats(data);
      } catch (err) {
        console.error('Error loading logs stats:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    }

    void loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white border border-red-200 rounded-lg p-6 mb-8 shadow-sm">
        <p className="text-red-600">{error || 'Failed to load statistics'}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Sessions',
      value: stats.total,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'This Month',
      value: stats.this_month,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Cancelled/No-Show',
      value: stats.cancelled + stats.no_show,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.value.toLocaleString()}
              </p>
            </div>
            <div className="text-gray-400">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}